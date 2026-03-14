Markdown
# 🏭 Akıllı Fabrika IoT Dashboard (Smart Factory)

Bu proje, Wokwi (ESP32) simülasyonundan gelen sensör verilerini (Sıcaklık, Stok, Gaz Alarmı) anlık olarak izleyen ve Supabase üzerinden çift yönlü kontrol sağlayan bir IoT sistemidir.

## 🚀 Kurulum ve Çalıştırma

### 1. Projeyi Bilgisayarınıza İndirin
```bash
git clone [https://github.com/AliDabanca/SmartFactoryIoT.git](https://github.com/AliDabanca/SmartFactoryIoT.git)
cd SmartFactoryIoT
2. Backend (Node.js) Hazırlığı
smartFactoryBackend klasörüne girin ve kütüphaneleri yükleyin:

Bash
cd smartFactoryBackend
npm install
NOT: Klasör içinde bir .env dosyası oluşturup içine Ali'den aldığınız Supabase URL ve Key bilgilerini şu formatta yazın:
SUPABASE_URL=...
SUPABASE_KEY=...

3. Arayüz (React) Hazırlığı
smartFactoryUI klasörüne girin ve kütüphaneleri yükleyin:

Bash
cd ../smartFactoryUI
npm install
🛠️ Sistemi Çalıştırma
Sistemin çalışması için iki ayrı terminalde şu komutları çalıştırın:

Terminal 1 (Backend): node index.js

Terminal 2 (Frontend): npm start

Wokwi: ESP32 simülasyonunu başlatın.

🕹️ Nasıl Test Edilir?
Dashboard açıldığında Wokwi'deki verileri (Sıcaklık, Hız) anlık göreceksiniz.

Wokwi'deki potansiyometreyi çevirince grafik değişir.

Dashboard'daki "Stok Yenile" butonuna basınca Wokwi terminalinde stokların 500'e çıktığını göreceksiniz!
