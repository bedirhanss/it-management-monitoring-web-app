import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { createLog, getClientIp } from '@/lib/logger'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { id } = await params
    const { name, ipAddress, status, cpuUsage, memoryUsage, diskUsage } = await request.json()
    const client = await pool.connect()
    
    const result = await client.query(
      'UPDATE servers SET name = $1, ip_address = $2, status = $3, cpu_usage = $4, memory_usage = $5, disk_usage = $6 WHERE id = $7 RETURNING *',
      [name, ipAddress, status, cpuUsage, memoryUsage, diskUsage, id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Sunucu bulunamadı' }, { status: 404 })
    }

    // Log kaydı
    const clientIp = getClientIp(request)
    await createLog(
      'INFO',
      'Monitoring',
      `Sunucu güncellendi: ${name}`,
      clientIp,
      `Sunucu ID: ${id}, Durum: ${status}, CPU: ${cpuUsage}%`,
      parseInt(id)
    )

    return NextResponse.json({ server: result.rows[0] })
  } catch (error) {
    console.error('Servers PUT error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { id } = await params
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      const server = await client.query('SELECT name FROM servers WHERE id = $1', [id])
      
      if (server.rows.length === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Sunucu bulunamadı' }, { status: 404 })
      }
      
      // Önce ilgili logları sil
      await client.query('DELETE FROM system_logs WHERE server_id = $1', [id])
      // Sonra sunucuyu sil
      await client.query('DELETE FROM servers WHERE id = $1', [id])
      await client.query('COMMIT')
      
      // Log kaydı
      const clientIp = getClientIp(request)
      await createLog(
        'WARNING',
        'Monitoring',
        `Sunucu silindi: ${server.rows[0].name}`,
        clientIp,
        `Sunucu ID: ${id}`
      )
      
      return NextResponse.json({ success: true })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Servers DELETE error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
