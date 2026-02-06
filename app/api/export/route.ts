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

      case 'inventory':
        const inventoryResult = await pool.query(`
          SELECT 
            i.id,
            i.name,
            i.type,
            i.brand,
            i.model,
            i.serial_number,
            i.location,
            i.status,
            i.purchase_date,
            i.warranty_period,
            i.warranty_end_date,
            u.name as created_by_name,
            i.created_at::date as created
          FROM inventory i
          LEFT JOIN users u ON i.created_by = u.id
          ORDER BY i.created_at DESC
        `)
        data = inventoryResult.rows
        columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Cihaz Adı', key: 'name', width: 25 },
          { header: 'Tip', key: 'type', width: 15 },
          { header: 'Marka', key: 'brand', width: 15 },
          { header: 'Model', key: 'model', width: 20 },
          { header: 'Seri No', key: 'serial_number', width: 20 },
          { header: 'Lokasyon', key: 'location', width: 15 },
          { header: 'Durum', key: 'status', width: 15 },
          { header: 'Satın Alma', key: 'purchase_date', width: 15 },
          { header: 'Garanti Süresi', key: 'warranty_period', width: 15 },
          { header: 'Garanti Bitiş', key: 'warranty_end_date', width: 15 },
          { header: 'Oluşturan', key: 'created_by_name', width: 20 },
          { header: 'Oluşturulma', key: 'created', width: 15 },
        ]
        sheetName = 'Envanter'
        fileName = 'envanter'
        break

      case 'projects':
        const projectsResult = await pool.query(`
          SELECT 
            p.id,
            p.name,
            p.description,
            p.status,
            p.priority,
            p.start_date,
            p.end_date,
            u.name as assigned_to_name,
            p.budget,
            p.created_at::date as created
          FROM projects p
          LEFT JOIN users u ON p.assigned_to = u.id
          ORDER BY p.created_at DESC
        `)
        data = projectsResult.rows
        columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Proje Adı', key: 'name', width: 30 },
          { header: 'Açıklama', key: 'description', width: 40 },
          { header: 'Durum', key: 'status', width: 15 },
          { header: 'Öncelik', key: 'priority', width: 15 },
          { header: 'Başlangıç', key: 'start_date', width: 15 },
          { header: 'Bitiş', key: 'end_date', width: 15 },
          { header: 'Sorumlu', key: 'assigned_to_name', width: 20 },
          { header: 'Bütçe', key: 'budget', width: 15 },
          { header: 'Oluşturulma', key: 'created', width: 15 },
        ]
        sheetName = 'Projeler'
        fileName = 'projeler'
        break

      case 'logs':
        const logsResult = await pool.query(`
          SELECT 
            id,
            log_level,
            source,
            message,
            ip_address,
            details,
            created_at
          FROM system_logs
          ORDER BY created_at DESC
          LIMIT 1000
        `)
        data = logsResult.rows
        columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Seviye', key: 'log_level', width: 15 },
          { header: 'Kaynak', key: 'source', width: 20 },
          { header: 'Mesaj', key: 'message', width: 50 },
          { header: 'IP Adresi', key: 'ip_address', width: 20 },
          { header: 'Detaylar', key: 'details', width: 40 },
          { header: 'Zaman', key: 'created_at', width: 20 },
        ]
        sheetName = 'Sistem Logları'
        fileName = 'sistem_loglari'
        break

      case 'calendar_events':
        const calendarResult = await pool.query(`
          SELECT 
            ce.id,
            ce.title,
            ce.description,
            ce.event_type,
            ce.event_date,
            ce.start_time,
            ce.end_time,
            u.name as assigned_to_name,
            ce.created_at::date as created
          FROM calendar_events ce
          LEFT JOIN users u ON ce.assigned_to = u.id
          ORDER BY ce.event_date DESC
        `)
        data = calendarResult.rows
        columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Başlık', key: 'title', width: 30 },
          { header: 'Açıklama', key: 'description', width: 40 },
          { header: 'Tür', key: 'event_type', width: 15 },
          { header: 'Tarih', key: 'event_date', width: 15 },
          { header: 'Başlangıç', key: 'start_time', width: 12 },
          { header: 'Bitiş', key: 'end_time', width: 12 },
          { header: 'Sorumlu', key: 'assigned_to_name', width: 20 },
          { header: 'Oluşturulma', key: 'created', width: 15 },
        ]
        sheetName = 'Takvim Etkinlikleri'
        fileName = 'takvim_etkinlikleri'
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