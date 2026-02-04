import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { createLog, getClientIp } from '@/lib/logger'

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

    // Log kaydı
    const clientIp = getClientIp(request)
    await createLog(
      'SUCCESS',
      'Monitoring',
      `Yeni sunucu eklendi: ${name}`,
      clientIp,
      `IP: ${ipAddress}, CPU: ${cpuUsage}%, RAM: ${memoryUsage}%, Disk: ${diskUsage}%`,
      result.rows[0].id
    )

    return NextResponse.json({ server: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Servers POST error:', error)
    
    const clientIp = getClientIp(request)
    await createLog(
      'ERROR',
      'Monitoring',
      'Sunucu ekleme hatası',
      clientIp,
      error instanceof Error ? error.message : 'Bilinmeyen hata'
    )
    
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
