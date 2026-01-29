const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function setupDatabase() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_Ew8YdKRWPc6A@ep-billowing-tooth-a2ssqyin-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  })

  try {
    const client = await pool.connect()
    console.log('✅ Connected to NeonDB')
    
    const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8')
    await client.query(schema)
    console.log('✅ Schema loaded successfully')
    
    client.release()
    await pool.end()
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

setupDatabase()