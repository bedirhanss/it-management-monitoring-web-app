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
    const result = await client.query('SELECT * FROM inventory ORDER BY created_at DESC')
    client.release()

    return NextResponse.json({ inventory: result.rows })
  } catch (error) {
    console.error('Inventory GET error:', error)
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
    const { name, type, brand, model, serialNumber, location, status, purchaseDate, warrantyPeriod, warrantyEndDate } = await request.json()

    const client = await pool.connect()
    
    const checkSerial = await client.query('SELECT id FROM inventory WHERE serial_number = $1', [serialNumber])
    if (checkSerial.rows.length > 0) {
      client.release()
      return NextResponse.json({ error: 'Bu seri numarası zaten kullanılıyor' }, { status: 400 })
    }
    
    const result = await client.query(
      'INSERT INTO inventory (name, type, brand, model, serial_number, location, status, purchase_date, warranty_period, warranty_end_date, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, type, brand, model, serialNumber, location, status || 'Aktif', purchaseDate, warrantyPeriod, warrantyEndDate, decoded.userId]
    )
    client.release()

    // Log kaydı oluştur
    const ipAddress = getClientIp(request)
    await createLog(
      'SUCCESS',
      'Inventory',
      `Yeni envanter eklendi: ${name}`,
      ipAddress,
      `Kullanıcı ID: ${decoded.userId}, Tip: ${type}, Seri No: ${serialNumber}`
    )

    return NextResponse.json({ item: result.rows[0] }, { status: 201 })
  } catch (error: any) {
    console.error('Inventory POST error:', error)
    
    // Hata logu
    const ipAddress = getClientIp(request)
    await createLog(
      'ERROR',
      'Inventory',
      'Envanter ekleme hatası',
      ipAddress,
      error.message
    )
    
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Bu seri numarası zaten kullanılıyor' }, { status: 400 })
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    const { id, name, type, brand, model, serialNumber, location, status, purchaseDate, warrantyPeriod, warrantyEndDate } = await request.json()

    const client = await pool.connect()
    const result = await client.query(
      'UPDATE inventory SET name = $1, type = $2, brand = $3, model = $4, serial_number = $5, location = $6, status = $7, purchase_date = $8, warranty_period = $9, warranty_end_date = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11 RETURNING *',
      [name, type, brand, model, serialNumber, location, status, purchaseDate, warrantyPeriod, warrantyEndDate, id]
    )
    client.release()

    // Log kaydı
    const ipAddress = getClientIp(request)
    await createLog(
      'INFO',
      'Inventory',
      `Envanter güncellendi: ${name}`,
      ipAddress,
      `Kullanıcı ID: ${decoded.userId}, Envanter ID: ${id}`
    )

    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error('Inventory PUT error:', error)
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
    const item = await client.query('SELECT name FROM inventory WHERE id = $1', [id])
    await client.query('DELETE FROM inventory WHERE id = $1', [id])
    client.release()

    // Log kaydı
    const ipAddress = getClientIp(request)
    await createLog(
      'WARNING',
      'Inventory',
      `Envanter silindi: ${item.rows[0]?.name || id}`,
      ipAddress,
      `Kullanıcı ID: ${decoded.userId}, Envanter ID: ${id}`
    )

    return NextResponse.json({ message: 'Envanter silindi' })
  } catch (error) {
    console.error('Inventory DELETE error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
