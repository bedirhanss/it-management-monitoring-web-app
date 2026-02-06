import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { title, description, eventType, eventDate, startTime, endTime, assignedTo } = body
    const { id } = await params

    const client = await pool.connect()
    const result = await client.query(
      `UPDATE calendar_events 
       SET title = $1, description = $2, event_type = $3, event_date = $4::date, 
           start_time = $5, end_time = $6, assigned_to = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING id, title, description, event_type, TO_CHAR(event_date, 'YYYY-MM-DD') as event_date, start_time, end_time, assigned_to`,
      [title, description, eventType, eventDate, startTime, endTime, assignedTo, id]
    )
    client.release()

    return NextResponse.json({ event: result.rows[0] })
  } catch (error) {
    console.error('Calendar update error:', error)
    return NextResponse.json({ error: 'Etkinlik güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const client = await pool.connect()
    await client.query('DELETE FROM calendar_events WHERE id = $1', [id])
    client.release()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Calendar delete error:', error)
    return NextResponse.json({ error: 'Etkinlik silinemedi' }, { status: 500 })
  }
}
