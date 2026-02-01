import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table')

    let data: any[] = []
    let columns: any[] = []
    let sheetName = ''
    let fileName = ''

    switch (table) {
      case 'tickets':
        const ticketsResult = await pool.query(`
          SELECT 
            t.id,
            t.title,
            t.description,
            t.status,
            t.priority,
            u.name as assigned_to,
            t.created_at::date as created
          FROM tickets t
          LEFT JOIN users u ON t.assigned_to = u.id
          ORDER BY t.created_at DESC
        `)
        data = ticketsResult.rows.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          status: row.status,
          priority: row.priority,
          assignedTo: row.assigned_to || 'Atanmamış',
          created: row.created
        }))
        columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Başlık', key: 'title', width: 30 },
          { header: 'Açıklama', key: 'description', width: 50 },
          { header: 'Durum', key: 'status', width: 15 },
          { header: 'Öncelik', key: 'priority', width: 15 },
          { header: 'Atanan', key: 'assignedTo', width: 20 },
          { header: 'Oluşturulma', key: 'created', width: 15 },
        ]
        sheetName = 'Destek Talepleri'
        fileName = 'destek_talepleri'
        break

      case 'users':
        const usersResult = await pool.query(`
          SELECT 
            id,
            name,
            email,
            role,
            status,
            created_at::date as created
          FROM users
          ORDER BY created_at DESC
        `)
        data = usersResult.rows
        columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Ad Soyad', key: 'name', width: 25 },
          { header: 'Email', key: 'email', width: 30 },
          { header: 'Rol', key: 'role', width: 15 },
          { header: 'Durum', key: 'status', width: 15 },
          { header: 'Oluşturulma', key: 'created', width: 15 },
        ]
        sheetName = 'Kullanıcılar'
        fileName = 'kullanicilar'
        break

      case 'servers':
        const serversResult = await pool.query(`
          SELECT 
            id,
            name,
            ip_address,
            status,
            cpu_usage,
            memory_usage,
            disk_usage,
            last_check::date as last_check,
            created_at::date as created
          FROM servers
          ORDER BY created_at DESC
        `)
        data = serversResult.rows.map(row => ({
          id: row.id,
          name: row.name,
          ipAddress: row.ip_address,
          status: row.status === 'online' ? 'Çevrimiçi' : 'Çevrimişdışı',
          cpu: row.cpu_usage,
          memory: row.memory_usage,
          disk: row.disk_usage,
          lastCheck: row.last_check,
          created: row.created
        }))
        columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Sunucu Adı', key: 'name', width: 25 },
          { header: 'IP Adresi', key: 'ipAddress', width: 20 },
          { header: 'Durum', key: 'status', width: 15 },
          { header: 'CPU %', key: 'cpu', width: 10 },
          { header: 'Bellek %', key: 'memory', width: 10 },
          { header: 'Disk %', key: 'disk', width: 10 },
          { header: 'Son Kontrol', key: 'lastCheck', width: 15 },
          { header: 'Oluşturulma', key: 'created', width: 15 },
        ]
        sheetName = 'Sunucular'
        fileName = 'sunucular'
        break

      default:
        return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
    }

    // Excel workbook oluştur
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(sheetName)

    // Sütunları ayarla
    worksheet.columns = columns

    // Başlık satırını stillendir
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6F3FF' }
    }

    // Verileri ekle
    data.forEach(row => {
      worksheet.addRow(row)
    })

    // Excel dosyasını buffer'a çevir
    const buffer = await workbook.xlsx.writeBuffer()

    // Response headers
    const currentDate = new Date().toISOString().split('T')[0]
    const fullFileName = `${fileName}_${currentDate}.xlsx`

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fullFileName}"`,
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}