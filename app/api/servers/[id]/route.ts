import { NextResponse } from 'next/server'
import pool from '@/lib/db'

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
    const result = await client.query('DELETE FROM servers WHERE id = $1 RETURNING id', [id])
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Sunucu bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Servers DELETE error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
