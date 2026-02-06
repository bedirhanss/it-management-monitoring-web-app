'use client'

import { ServerIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface Server {
  id: number
  name: string
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  status: string
}

export default function ServerStatus() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await fetch('/api/servers')
        const data = await res.json()
        
        // Son 4 sunucuyu göster
        setServers(data.servers?.slice(0, 4) || [])
      } catch (error) {
        console.error('Servers fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServers()
  }, [])

  const statusConfig = {
    online: { 
      icon: CheckCircleIcon, 
      label: 'Çevrimiçi',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      dot: 'bg-green-500'
    },
    warning: { 
      icon: ExclamationTriangleIcon, 
      label: 'Uyarı',
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      dot: 'bg-yellow-500'
    },
    offline: { 
      icon: XCircleIcon, 
      label: 'Çevrimdışı',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      dot: 'bg-red-500'
    },
    critical: { 
      icon: XCircleIcon, 
      label: 'Kritik',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      dot: 'bg-red-500'
    },
  }

  const getUsageColor = (value: number) => {
    if (value >= 80) return 'bg-red-500 dark:bg-red-400'
    if (value >= 60) return 'bg-yellow-500 dark:bg-yellow-400'
    return 'bg-green-500 dark:bg-green-400'
  }

  const getUsageTextColor = (value: number) => {
    if (value >= 80) return 'text-red-600 dark:text-red-400'
    if (value >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (servers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <ServerIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Henüz sunucu eklenmemiş</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {servers.map((server) => {
        const config = statusConfig[server.status as keyof typeof statusConfig] || statusConfig.online
        return (
          <div key={server.id} className={`relative overflow-hidden rounded-xl border ${config.border} bg-white dark:bg-gray-800 p-5 transition-all hover:shadow cursor-pointer`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
                  <ServerIcon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{server.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
                    <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">CPU</span>
                  <span className={`text-xs font-bold ${getUsageTextColor(server.cpu_usage)}`}>{server.cpu_usage}%</span>
                </div>
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${getUsageColor(server.cpu_usage)}`}
                    style={{ width: `${server.cpu_usage}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">RAM</span>
                  <span className={`text-xs font-bold ${getUsageTextColor(server.memory_usage)}`}>{server.memory_usage}%</span>
                </div>
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${getUsageColor(server.memory_usage)}`}
                    style={{ width: `${server.memory_usage}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Disk</span>
                  <span className={`text-xs font-bold ${getUsageTextColor(server.disk_usage)}`}>{server.disk_usage}%</span>
                </div>
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${getUsageColor(server.disk_usage)}`}
                    style={{ width: `${server.disk_usage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
