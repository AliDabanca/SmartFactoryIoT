require('dotenv').config();
const mqtt = require('mqtt');
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ─── 1. REST API SUNUCUSU (Kullanıcı Yönetimi İçin) ───
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/add-user', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const { data: userRecord, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true
    });
    if (authError) throw authError;

    const { error: dbError } = await supabase.from('user_roles').insert([
      { user_id: userRecord.user.id, role: role }
    ]);
    if (dbError) throw dbError;

    console.log(`👤 Yeni çalışan eklendi: ${email} (${role})`);
    res.json({ success: true, message: 'Kullanıcı başarıyla oluşturuldu.' });

  } catch (err) {
    console.error('Kullanıcı ekleme hatası:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/ota-update', async (req, res) => {
  const { version } = req.body;
  try {
    // Önce MQTT komutu gönder
    const command = { type: 'OTA_UPDATE', version: version };
    const publishResult = await new Promise((resolve, reject) => {
      mqttClient.publish('dabanca_factory/commands', JSON.stringify(command), (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (!publishResult) throw new Error('MQTT yayını başarısız');

    // MQTT başarılı olursa, Supabase'e kaydet
    const { error } = await supabase.from('ota_updates').insert([{
      version: version,
      status: 'started',
      device_id: 'line_01'
    }]);
    if (error) throw error;

    console.log(`📡 OTA başlatıldı: v${version}`);
    res.json({ success: true, message: 'OTA güncelleme başlatıldı.' });
  } catch (err) {
    console.error('OTA hatası:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

app.listen(3001, () => console.log('🌐 API Sunucusu 3001 portunda aktif! (Kullanıcı Yönetimi İçin)'));

// ─── 2. MQTT KÖPRÜSÜ (Şifreli IoT Haberleşmesi) ───
const mqttOptions = {
  port: 8883,
  rejectUnauthorized: process.env.NODE_ENV === 'production'
};

const mqttClient = mqtt.connect('mqtts://broker.hivemq.com', mqttOptions);

mqttClient.on('connect', () => {
  console.log('✅ TLS Şifreli MQTT Sunucusuna Bağlanıldı!');
  mqttClient.subscribe('dabanca_factory/production/line1');
  mqttClient.subscribe('dabanca_factory/commands');
});

mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const { error } = await supabase.from('factory_telemetry').insert([{
      line_id: data.line_id, speed: data.speed, temp: data.temp, humidity: data.humidity,
      status: data.status, total_prod: data.total_prod, stock: data.stock,
      restock_needed: data.restock_needed, gas_level: data.gas_level, gas_alert: data.gas_alert
    }]);
    if (error) console.error('❌ Supabase Hatası:', error.message);
  } catch (e) {
    console.error('Veri işleme hatası:', e.message);
  }
});