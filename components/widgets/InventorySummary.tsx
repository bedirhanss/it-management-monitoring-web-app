'use client'

import { CubeIcon, ComputerDesktopIcon, PrinterIcon, DevicePhoneMobileIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface InventoryItem {
  id: number
  name: string
  type: string
  status: string
  warranty_end_date: string
}

interface CategoryStats {
  type: string
  count: number
  icon: any
  color: string
}

export default function InventorySummary() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch('/api/inventory')
        const data = await res.json()
        
        setItems(data.inventory || [])
      } catch (error) {
        console.error('Inventory fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [])

  const getCategoryStats = (): CategoryStats[] => {
    const typeMap: { [key: string]: { icon: any; color: string } } = {
      'Laptop': { icon: ComputerDesktopIcon, color: 'blue' },
      'Desktop': { icon: ComputerDesktopIcon, color: 'purple' },
      'Yazıcı': { icon: PrinterIcon, color: 'green' },
      'Telefon': { icon: DevicePhoneMobileIcon, color: 'orange' },
    }

    const counts: { [key: string]: number } = {}
    items.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1
    })

    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      icon: typeMap[type]?.icon || CubeIcon,
      color: typeMap[type]?.color || 'gray'
    }))
  }

  const getWarningItems = () => {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    return items.filter(item => {
      if (!item.warranty_end_date) return false
      const warrantyEnd = new Date(item.warranty_end_date)
      return warrantyEnd <= thirtyDaysFromNow && warrantyEnd >= now
    })
  }

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-600 dark:text-purple-400',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-600 dark:text-green-400',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-600 dark:text-orange-400',
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
    },
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
              <div className="space-y-2">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <CubeIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Henüz envanter kaydı yok</p>
      </div>
    )
  }

  const categoryStats = getCategoryStats()
  const warningItems = getWarningItems()
  const activeItems = items.filter(item => item.status === 'Aktif').length
  const faultyItems = items.filter(item => item.status === 'Arızalı').length
  const maintenanceItems = items.filter(item => item.status === 'Bakımda').length
  const inactiveItems = items.filter(item => item.status === 'Devre Dışı').length

  return (
    <div className="space-y-4">
      {/* Toplam İstatistik */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Toplam Cihaz</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{items.length}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">{activeItems} aktif</span>
              {faultyItems > 0 && (
                <>
                  <span>•</span>
                  <span className="font-medium">{faultyItems} arızalı</span>
                </>
              )}
              {maintenanceItems > 0 && (
                <>
                  <span>•</span>
                  <span className="font-medium">{maintenanceItems} bakımda</span>
                </>
              )}
              {inactiveItems > 0 && (
                <>
                  <span>•</span>
                  <span className="font-medium">{inactiveItems} devre dışı</span>
                </>
              )}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CubeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Kategori Dağılımı */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {categoryStats.map((stat) => {
          const colors = colorClasses[stat.color as keyof typeof colorClasses]
          const Icon = stat.icon
          
          return (
            <div
              key={stat.type}
              className={`rounded-lg border ${colors.border} bg-white dark:bg-gray-800 p-4 transition-all hover:shadow cursor-pointer aspect-square flex flex-col justify-between`}
            >
              <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${colors.text}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.type}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Garanti Uyarısı */}
      {warningItems.length > 0 && (
        <div className="rounded-xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 flex items-center justify-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                Garanti Süresi Doluyor
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                {warningItems.length} cihazın garantisi 30 gün içinde dolacak
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detay Linki */}
      <Link
        href="/panel/inventory"
        className="block text-center py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Tüm envanteri görüntüle →
      </Link>
    </div>
  )
}
