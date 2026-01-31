import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email ve şifre gerekli' }, { status: 400 })
    }

    // Kullanıcıyı veritabanından bul
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM users WHERE email = $1 AND status = $2', [email, 'active'])
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Geçersiz giriş bilgileri' }, { status: 401 })
    }

    const user = result.rows[0]

    // Şifre kontrolü (demo için basit kontrol + bcrypt)
    const isValidPassword = password === 'demo123' || await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Geçersiz giriş bilgileri' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400
    })

    return response

  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}