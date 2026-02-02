const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function updateDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Veritabanı güncelleniyor...');
    
    // System logs tablosunu güncelle
    await pool.query(`
      ALTER TABLE system_logs 
      ADD COLUMN IF NOT EXISTS source VARCHAR(100),
      ADD COLUMN IF NOT EXISTS ip_address INET,
      ADD COLUMN IF NOT EXISTS details TEXT;
    `);
    console.log('✅ System logs tablosu güncellendi');
    
    // Inventory tablosunu oluştur
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        brand VARCHAR(100),
        model VARCHAR(100),
        serial_number VARCHAR(100) UNIQUE,
        location VARCHAR(100),
        status VARCHAR(20) DEFAULT 'Aktif',
        purchase_date DATE,
        warranty_period DECIMAL(3,1),
        warranty_end_date DATE,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Inventory tablosu oluşturuldu');
    
    // Projects tablosunu oluştur
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'Planlama',
        priority VARCHAR(20) DEFAULT 'Orta',
        start_date DATE,
        end_date DATE,
        assigned_to INTEGER REFERENCES users(id),
        budget VARCHAR(50),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Projects tablosu oluşturuldu');
    
    // Calendar events tablosunu oluştur
    await pool.query(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_type VARCHAR(50) NOT NULL,
        event_date DATE NOT NULL,
        start_time TIME,
        end_time TIME,
        assigned_to INTEGER REFERENCES users(id),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Calendar events tablosu oluşturuldu');
    
    // Örnek verileri ekle
    await pool.query(`
      INSERT INTO inventory (name, type, brand, model, serial_number, location, status, purchase_date, warranty_period, warranty_end_date, created_by) VALUES
      ('Dell OptiPlex 7090', 'Bilgisayar', 'Dell', 'OptiPlex 7090', 'DL001234', 'IT Ofis', 'Aktif', '2023-01-15', 3, '2026-01-15', 1),
      ('HP LaserJet Pro', 'Yazıcı', 'HP', 'LaserJet Pro M404n', 'HP567890', 'Muhasebe', 'Aktif', '2023-03-20', 2, '2025-03-20', 1),
      ('Cisco Switch 24P', 'Network', 'Cisco', 'SG220-26', 'CS789012', 'Server Odası', 'Aktif', '2022-11-10', 3, '2025-11-10', 1),
      ('MacBook Pro 13"', 'Laptop', 'Apple', 'MacBook Pro M2', 'AP345678', 'Tasarım', 'Bakımda', '2023-06-05', 3, '2026-06-05', 1),
      ('Samsung Monitor', 'Monitör', 'Samsung', '27" Curved', 'SM901234', 'Geliştirme', 'Aktif', '2023-02-12', 3, '2026-02-12', 1)
      ON CONFLICT (serial_number) DO NOTHING;
    `);
    console.log('✅ Inventory örnek verileri eklendi');
    
    await pool.query(`
      INSERT INTO projects (name, description, status, priority, start_date, end_date, assigned_to, budget, created_by) VALUES
      ('Network Altyapı Yenileme', 'Ofis network altyapısının tamamen yenilenmesi', 'Devam Ediyor', 'Yüksek', '2024-01-01', '2024-03-31', 1, '₺150,000', 1),
      ('ERP Sistemi Entegrasyonu', 'Yeni ERP sisteminin mevcut altyapıya entegrasyonu', 'Planlama', 'Yüksek', '2024-02-15', '2024-06-30', 2, '₺300,000', 1),
      ('Güvenlik Sistemi Güncelleme', 'Firewall ve güvenlik yazılımlarının güncellenmesi', 'Tamamlandı', 'Orta', '2023-11-01', '2023-12-31', 1, '₺75,000', 1),
      ('Mobil Uygulama Geliştirme', 'İç kullanım için mobil uygulama geliştirme projesi', 'Devam Ediyor', 'Orta', '2024-01-15', '2024-05-15', 2, '₺200,000', 1),
      ('Veri Merkezi Taşınması', 'Sunucuların yeni veri merkezine taşınması', 'Beklemede', 'Düşük', '2024-04-01', '2024-07-31', 1, '₺500,000', 1);
    `);
    console.log('✅ Projects örnek verileri eklendi');
    
    await pool.query(`
      INSERT INTO calendar_events (title, description, event_type, event_date, start_time, end_time, assigned_to, created_by) VALUES
      ('Server Bakımı', 'Web sunucusu rutin bakımı', 'Bakım', '2024-01-15', '14:00', '16:00', 1, 1),
      ('Network Güncelleme', 'Switch firmware güncelleme', 'Güncelleme', '2024-01-16', '09:00', '11:00', 2, 1),
      ('Proje Toplantısı', 'ERP projesi durum toplantısı', 'Toplantı', '2024-01-18', '10:00', '12:00', 2, 1),
      ('Yedekleme Kontrolü', 'Haftalık yedekleme kontrolü', 'Kontrol', '2024-01-20', '15:00', '17:00', 1, 1),
      ('Güvenlik Taraması', 'Sistem güvenlik taraması', 'Güvenlik', '2024-01-22', '13:00', '15:00', 1, 1);
    `);
    console.log('✅ Calendar events örnek verileri eklendi');
    
    console.log('🎉 Veritabanı başarıyla güncellendi!');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await pool.end();
  }
}

updateDatabase();