'use client'

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface ExportButtonProps {
  table: string // tickets, users, servers
  fileName?: string
  title?: string
}

export default function ExportButton({ table, fileName, title = 'Dışa Aktar' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToExcel = async () => {
    setIsExporting(true)
    
    try {
      const response = await fetch(`/api/export?table=${table}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      // Dosyayı indir
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Dosya adını response header'dan al veya default kullan
      const contentDisposition = response.headers.get('content-disposition')
      const defaultFileName = fileName || `${table}_export.xlsx`
      const actualFileName = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') 
        : defaultFileName
      
      link.download = actualFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Export error:', error)
      alert('Dışa aktarma sırasında hata oluştu')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={exportToExcel}
      disabled={isExporting}
      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
      {isExporting ? 'Excel Oluşturuluyor...' : title}
    </button>
  )
}