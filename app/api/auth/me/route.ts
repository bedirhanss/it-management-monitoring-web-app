import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]

    if (!token) {
      return NextResponse.json({ error: 'Token bulunamadı' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    
    const client = await pool.connect()
    const result = await client.query('SELECT id, name, email, role FROM users WHERE id = $1 AND status = $2', [decoded.userId, 'active'])
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 401 })
    }

    return NextResponse.json({ user: result.rows[0] })

  } catch (error) {
    return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 })
  }
}