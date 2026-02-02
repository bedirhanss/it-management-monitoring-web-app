const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function resetDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Veritabanı sıfırlanıyor...');
    
    // Mevcut tabloları sil
    await pool.query('DROP TABLE IF EXISTS system_logs CASCADE');
    await pool.query('DROP TABLE IF EXISTS calendar_events CASCADE');
    await pool.query('DROP TABLE IF EXISTS projects CASCADE');
    await pool.query('DROP TABLE IF EXISTS inventory CASCADE');
    await pool.query('DROP TABLE IF EXISTS tickets CASCADE');
    await pool.query('DROP TABLE IF EXISTS servers CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('✅ Eski tablolar silindi');
    
    // Yeni şemayı yükle
    const fs = require('fs');
    const schema = fs.readFileSync('./database/schema.sql', 'utf8');
    
    await pool.query(schema);
    
    console.log('✅ Yeni şema yüklendi');
    console.log('🎉 Veritabanı başarıyla güncellendi!');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await pool.end();
  }
}

resetDatabase();