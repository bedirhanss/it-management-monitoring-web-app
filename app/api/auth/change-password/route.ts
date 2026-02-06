import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const { currentPassword, newPassword } = await request.json()

    const client = await pool.connect()
    const result = await client.query('SELECT password_hash FROM users WHERE id = $1', [decoded.userId])
    
    if (result.rows.length === 0) {
      client.release()
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash)
    if (!isValid) {
      client.release()
      return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    await client.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newPasswordHash, decoded.userId])
    client.release()

    return NextResponse.json({ message: 'Şifre başarıyla güncellendi' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Şifre güncellenemedi' }, { status: 500 })
  }
}
