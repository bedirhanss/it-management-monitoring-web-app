import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, email } = await request.json()

    const client = await pool.connect()
    const result = await client.query(
      'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, role, status',
      [name, email, id]
    )
    client.release()

    return NextResponse.json({ user: result.rows[0] })
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json({ error: 'Kullanıcı güncellenemedi' }, { status: 500 })
  }
}
