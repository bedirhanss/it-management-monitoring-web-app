import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import jwt from 'jsonwebtoken'
import { createLog, getClientIp } from '@/lib/logger'

// GET - Tüm ticketları getir
export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const client = await pool.connect()
    const result = await client.query(`
      SELECT 
        t.id, 
        t.title, 
        t.description, 
        t.status, 
        t.priority,
        t.created_at,
        u.name as assigned_to_name,
        creator.name as created_by_name
      FROM tickets t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users creator ON t.created_by = creator.id
      ORDER BY t.created_at DESC
    `)
    client.release()

    return NextResponse.json({ tickets: result.rows })
  } catch (error) {
    console.error('Tickets GET error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST - Yeni ticket oluştur
export async function POST(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    const { title, description, priority, status, assignedTo } = await request.json()

    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO tickets (title, description, priority, status, assigned_to, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, priority || 'medium', status || 'open', assignedTo || null, decoded.userId]
    )
    client.release()

    // Log kaydı
    const ipAddress = getClientIp(request)
    await createLog(
      'SUCCESS',
      'Ticket',
      `Yeni ticket oluşturuldu: ${title}`,
      ipAddress,
      `Kullanıcı ID: ${decoded.userId}, Öncelik: ${priority}, Durum: ${status}`
    )

    return NextResponse.json({ ticket: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Tickets POST error:', error)
    
    const ipAddress = getClientIp(request)
    await createLog(
      'ERROR',
      'Ticket',
      'Ticket oluşturma hatası',
      ipAddress,
      error instanceof Error ? error.message : 'Bilinmeyen hata'
    )
    
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
