'use client'

import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface Log {
  id: number
  level: string
  category: string
  message: string
  created_at: string
  ip_address?: string
}

export default function RecentActivity() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs')
        const data = await res.json()
        
        // Son 6 log'u al
        setLogs(data.logs?.slice(0, 6) || [])
      } catch (error) {
        console.error('Logs fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const levelConfig = {
    SUCCESS: {
      icon: CheckCircleIcon,
      label: 'Başarılı',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-900/30'
    },
    WARNING: {
      icon: ExclamationTriangleIcon,
      label: 'Uyarı',
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    ERROR: {
      icon: XCircleIcon,
      label: 'Hata',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      iconBg: 'bg-red-100 dark:bg-red-900/30'
    },
    INFO: {
      icon: InformationCircleIcon,
      label: 'Bilgi',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30'
    }
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const created = new Date(date)
    const diffMs = now.getTime() - created.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays} gün önce`
    if (diffHours > 0) return `${diffHours} saat önce`
    if (diffMinutes > 0) return `${diffMinutes} dakika önce`
    return 'Az önce'
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <ClockIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Henüz aktivite kaydı yok</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const config = levelConfig[log.level as keyof typeof levelConfig] || levelConfig.INFO
        const Icon = config.icon
        
        return (
          <div 
            key={log.id} 
            className={`relative overflow-hidden rounded-xl border ${config.border} bg-white dark:bg-gray-800 p-4 transition-all hover:shadow cursor-pointer group`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center border ${config.border}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {log.message}
                  </p>
                  <span className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
                    {log.category}
                  </span>
                </div>
                
                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{getTimeAgo(log.created_at)}</span>
                  </div>
                  {log.ip_address && (
                    <>
                      <span>•</span>
                      <span className="font-mono">{log.ip_address}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className={`font-medium ${config.color}`}>{config.label}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
