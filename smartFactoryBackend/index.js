require('dotenv').config();
const mqtt = require('mqtt');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');


const topics = [
  'dabanca_factory/production/line1',
  'dabanca_factory/warehouse/inventory'
];

mqttClient.on('connect', () => {
  console.log('Fabrika Bulut Köprüsü Aktif!');
  mqttClient.subscribe(topics);
});

supabase
  .channel('remote-commands')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'factory_commands' 
  }, (payload) => {

    console.log('--- KOMUT ALINDI ---');
    console.log('Tip:', payload.new.type);
    
    mqttClient.publish('dabanca_factory/commands', JSON.stringify(payload.new));
  })
  .subscribe((status) => {
    console.log('Komut Kanalı Durumu:', status); 
  });

mqttClient.on('message', (topic, message) => { 
  try {
    const data = JSON.parse(message.toString());

    if (topic === 'dabanca_factory/production/line1') {
   
      supabase
        .from('factory_telemetry')
        .insert([{
          line_id: data.line_id,
          temp: data.temp,
          speed: data.speed,
          status: data.status,
          gas_alert: data.gas_alert,
          total_prod: data.total_prod,
          stock: data.stock,
          restock_needed: data.restock_needed
        }])
        .then(({ error }) => {
          if (error) console.error('Hata:', error.message);
          else console.log('Veri anlık iletildi: ' + data.temp + '°C');
        });
    }
  } catch (err) {
    console.error('İşleme Hatası:', err.message);
  }
});  