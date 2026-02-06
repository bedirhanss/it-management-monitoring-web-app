'use client'

import { ChartBarIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface PerformanceData {
  day: string
  cpu: number
  ram: number
  disk: number
}

export default function PerformanceChart() {
  const [data, setData] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await fetch('/api/servers')
        const serversData = await res.json()
        
        // Son 7 günün simüle edilmiş verisi (gerçek projede API'den gelecek)
        const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
        const servers = serversData.servers || []
        
        // Ortalama değerleri hesapla
        const avgCpu = servers.length > 0 
          ? Math.round(servers.reduce((sum: number, s: any) => sum + s.cpu_usage, 0) / servers.length)
          : 0
        const avgRam = servers.length > 0
          ? Math.round(servers.reduce((sum: number, s: any) => sum + s.memory_usage, 0) / servers.length)
          : 0
        const avgDisk = servers.length > 0
          ? Math.round(servers.reduce((sum: number, s: any) => sum + s.disk_usage, 0) / servers.length)
          : 0
        
        // Son 7 gün için veri oluştur (gerçek projede API'den gelecek)
        const performanceData = days.map((day, index) => ({
          day,
          cpu: Math.max(0, avgCpu + Math.floor(Math.random() * 20 - 10)),
          ram: Math.max(0, avgRam + Math.floor(Math.random() * 20 - 10)),
          disk: Math.max(0, avgDisk + Math.floor(Math.random() * 15 - 7)),
        }))
        
        setData(performanceData)
      } catch (error) {
        console.error('Performance fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
  }, [])

  const maxValue = 100

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 animate-pulse">
              <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
        <div className="h-48 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <ChartBarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Performans verisi yok</p>
      </div>
    )
  }

  const avgCpu = Math.round(data.reduce((sum, d) => sum + d.cpu, 0) / data.length)
  const avgRam = Math.round(data.reduce((sum, d) => sum + d.ram, 0) / data.length)
  const avgDisk = Math.round(data.reduce((sum, d) => sum + d.disk, 0) / data.length)

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            CPU <span className="text-gray-900 dark:text-white font-bold">{avgCpu}%</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            RAM <span className="text-gray-900 dark:text-white font-bold">{avgRam}%</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Disk <span className="text-gray-900 dark:text-white font-bold">{avgDisk}%</span>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        {/* Grid Lines */}
        <div className="absolute inset-4 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((value) => (
            <div key={value} className="flex items-center">
              <span className="text-[10px] text-gray-400 dark:text-gray-600 w-8">{value}%</span>
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700 border-dashed"></div>
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-4 pl-10 flex items-end justify-between gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              {/* Bars Container */}
              <div className="w-full flex items-end justify-center gap-0.5 h-full">
                {/* CPU Bar */}
                <div className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600 cursor-pointer relative group"
                     style={{ height: `${(item.cpu / maxValue) * 100}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.cpu}%
                  </div>
                </div>
                {/* RAM Bar */}
                <div className="flex-1 bg-purple-500 rounded-t transition-all hover:bg-purple-600 cursor-pointer relative group"
                     style={{ height: `${(item.ram / maxValue) * 100}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.ram}%
                  </div>
                </div>
                {/* Disk Bar */}
                <div className="flex-1 bg-green-500 rounded-t transition-all hover:bg-green-600 cursor-pointer relative group"
                     style={{ height: `${(item.disk / maxValue) * 100}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.disk}%
                  </div>
                </div>
              </div>
              {/* Day Label */}
              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 mt-1">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Son 7 günün ortalama sistem performansı
      </p>
    </div>
  )
}
