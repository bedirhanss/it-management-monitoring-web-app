import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import jwt from 'jsonwebtoken'
import { createLog, getClientIp } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const client = await pool.connect()
    const result = await client.query(`
      SELECT 
        p.*,
        u.name as assigned_to_name
      FROM projects p
      LEFT JOIN users u ON p.assigned_to = u.id
      ORDER BY p.created_at DESC
    `)
    client.release()

    return NextResponse.json({ projects: result.rows })
  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    const { name, description, status, priority, startDate, endDate, assignedTo, budget } = await request.json()

    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO projects (name, description, status, priority, start_date, end_date, assigned_to, budget, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, description, status || 'Planlama', priority || 'Orta', startDate, endDate, assignedTo, budget, decoded.userId]
    )
    client.release()

    // Log kaydı
    const ipAddress = getClientIp(request)
    await createLog(
      'SUCCESS',
      'Project',
      `Yeni proje oluşturuldu: ${name}`,
      ipAddress,
      `Kullanıcı ID: ${decoded.userId}, Öncelik: ${priority}, Bütçe: ${budget}`
    )

    return NextResponse.json({ project: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Projects POST error:', error)
    
    const ipAddress = getClientIp(request)
    await createLog(
      'ERROR',
      'Project',
      'Proje oluşturma hatası',
      ipAddress,
      error instanceof Error ? error.message : 'Bilinmeyen hata'
    )
    
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    const { id, name, description, status, priority, startDate, endDate, assignedTo, budget } = await request.json()

    const client = await pool.connect()
    const result = await client.query(
      'UPDATE projects SET name = $1, description = $2, status = $3, priority = $4, start_date = $5, end_date = $6, assigned_to = $7, budget = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [name, description, status, priority, startDate, endDate, assignedTo, budget, id]
    )
    client.release()

    // Log kaydı
    const ipAddress = getClientIp(request)
    await createLog(
      'INFO',
      'Project',
      `Proje güncellendi: ${name}`,
      ipAddress,
      `Kullanıcı ID: ${decoded.userId}, Proje ID: ${id}, Durum: ${status}`
    )

    return NextResponse.json({ project: result.rows[0] })
  } catch (error) {
    console.error('Projects PUT error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const client = await pool.connect()
    const project = await client.query('SELECT name FROM projects WHERE id = $1', [id])
    await client.query('DELETE FROM projects WHERE id = $1', [id])
    client.release()

    // Log kaydı
    const ipAddress = getClientIp(request)
    await createLog(
      'WARNING',
      'Project',
      `Proje silindi: ${project.rows[0]?.name || id}`,
      ipAddress,
      `Kullanıcı ID: ${decoded.userId}, Proje ID: ${id}`
    )

    return NextResponse.json({ message: 'Proje silindi' })
  } catch (error) {
    console.error('Projects DELETE error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
