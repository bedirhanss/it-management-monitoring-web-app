import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const client = await pool.connect()
    const result = await client.query('SELECT * FROM servers ORDER BY created_at DESC')
    client.release()

    return NextResponse.json({ servers: result.rows })
  } catch (error) {
    console.error('Servers GET error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { name, ipAddress, cpuUsage, memoryUsage, diskUsage } = await request.json()

    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO servers (name, ip_address, status, cpu_usage, memory_usage, disk_usage) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, ipAddress, 'online', cpuUsage || 0, memoryUsage || 0, diskUsage || 0]
    )
    client.release()

    return NextResponse.json({ server: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Servers POST error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
