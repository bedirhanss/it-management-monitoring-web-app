import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const client = await pool.connect()
    const result = await client.query('SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC')
    client.release()

    return NextResponse.json({ users: result.rows })
  } catch (error) {
    console.error('Users GET error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { name, email, password, role, status } = await request.json()

    const passwordHash = await bcrypt.hash(password || 'temp123', 10)

    const client = await pool.connect()
    
    // Email kontrolü
    const checkEmail = await client.query('SELECT id FROM users WHERE email = $1', [email])
    if (checkEmail.rows.length > 0) {
      client.release()
      return NextResponse.json({ error: 'Bu email adresi zaten kullanılıyor' }, { status: 400 })
    }
    
    const result = await client.query(
      'INSERT INTO users (name, email, password_hash, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, status, created_at',
      [name, email, passwordHash, role || 'user', status || 'active']
    )
    client.release()

    return NextResponse.json({ user: result.rows[0] }, { status: 201 })
  } catch (error: any) {
    console.error('Users POST error:', error)
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Bu email adresi zaten kullanılıyor' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { id, name, email, role, status } = await request.json()

    const client = await pool.connect()
    const result = await client.query(
      'UPDATE users SET name = $1, email = $2, role = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, name, email, role, status, created_at',
      [name, email, role, status, id]
    )
    client.release()

    return NextResponse.json({ user: result.rows[0] })
  } catch (error) {
    console.error('Users PUT error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const client = await pool.connect()
    await client.query('DELETE FROM users WHERE id = $1', [id])
    client.release()

    return NextResponse.json({ message: 'Kullanıcı silindi' })
  } catch (error) {
    console.error('Users DELETE error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
