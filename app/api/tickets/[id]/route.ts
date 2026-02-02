import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import jwt from 'jsonwebtoken'

// PUT - Ticket güncelle
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { id } = await params
    const { title, description, status, priority, assignedTo } = await request.json()
    const client = await pool.connect()
    
    const result = await client.query(
      `UPDATE tickets 
       SET title = $1, description = $2, status = $3, priority = $4, assigned_to = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 
       RETURNING *`,
      [title, description, status, priority, assignedTo || null, id]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ ticket: result.rows[0] })
  } catch (error) {
    console.error('Tickets PUT error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// DELETE - Ticket sil
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { id } = await params
    const client = await pool.connect()
    const result = await client.query('DELETE FROM tickets WHERE id = $1 RETURNING id', [id])
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Tickets DELETE error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
