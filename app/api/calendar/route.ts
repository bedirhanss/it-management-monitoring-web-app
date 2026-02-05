import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(`
      SELECT 
        ce.id,
        ce.title,
        ce.description,
        ce.event_type,
        TO_CHAR(ce.event_date, 'YYYY-MM-DD') as event_date,
        ce.start_time,
        ce.end_time,
        ce.assigned_to,
        u.name as assigned_to_name
      FROM calendar_events ce
      LEFT JOIN users u ON ce.assigned_to = u.id
      ORDER BY ce.event_date DESC, ce.start_time DESC
    `)
    client.release()
    
    return NextResponse.json({ events: result.rows })
  } catch (error) {
    console.error('Calendar fetch error:', error)
    return NextResponse.json({ error: 'Etkinlikler yüklenemedi' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, eventType, eventDate, startTime, endTime, assignedTo } = body

    console.log('Gelen tarih:', eventDate) // Debug için

    // PostgreSQL DATE tipine timezone olmadan kaydet
    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO calendar_events (title, description, event_type, event_date, start_time, end_time, assigned_to, created_by)
       VALUES ($1, $2, $3, $4::date, $5, $6, $7, 1)
       RETURNING id, title, description, event_type, TO_CHAR(event_date, 'YYYY-MM-DD') as event_date, start_time, end_time, assigned_to`,
      [title, description, eventType, eventDate, startTime, endTime, assignedTo]
    )
    client.release()

    console.log('Kaydedilen tarih:', result.rows[0].event_date) // Debug için

    return NextResponse.json({ event: result.rows[0] })
  } catch (error) {
    console.error('Calendar create error:', error)
    return NextResponse.json({ error: 'Etkinlik oluşturulamadı' }, { status: 500 })
  }
}
