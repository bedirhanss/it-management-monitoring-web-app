'use client'

import { ExclamationTriangleIcon, FireIcon, ClockIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Ticket {
  id: number
  title: string
  priority: string
  created_at: string
  created_by_name: string
}

export default function PendingTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/tickets')
        const data = await res.json()
        
        // Sadece açık ve yüksek/orta öncelikli ticketları al, son 4 tanesini göster
        const pendingTickets = data.tickets
          ?.filter((t: any) => t.status === 'open' && (t.priority === 'high' || t.priority === 'medium'))
          .slice(0, 4) || []
        
        setTickets(pendingTickets)
      } catch (error) {
        console.error('Tickets fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const priorityConfig = {
    high: { 
      icon: FireIcon, 
      label: 'Yüksek',
      color: 'text-red-600 dark:text-red-400', 
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    },
    medium: { 
      icon: ExclamationTriangleIcon, 
      label: 'Orta',
      color: 'text-yellow-600 dark:text-yellow-400', 
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
    },
    low: { 
      icon: ClockIcon, 
      label: 'Düşük',
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    },
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const created = new Date(date)
    const diffMs = now.getTime() - created.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays} gün önce`
    if (diffHours > 0) return `${diffHours} saat önce`
    return 'Az önce'
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
            <div className="flex items-start gap-4">
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

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <ClockIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Bekleyen yüksek öncelikli ticket yok</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const config = priorityConfig[ticket.priority as keyof typeof priorityConfig]
        return (
          <Link
            key={ticket.id}
            href={`/panel/tickets`}
            className={`group block relative overflow-hidden rounded-xl border ${config.border} bg-white dark:bg-gray-800 p-4 transition-all hover:shadow cursor-pointer`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center border ${config.border}`}>
                <config.icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {ticket.title}
                  </h4>
                  <span className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full ${config.badge}`}>
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">#{ticket.id}</span>
                  <span>•</span>
                  <span>{ticket.created_by_name || 'Bilinmeyen'}</span>
                  <span>•</span>
                  <span>{getTimeAgo(ticket.created_at)}</span>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
      <Link
        href="/panel/tickets"
        className="block text-center py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Tüm ticketları görüntüle →
      </Link>
    </div>
  )
}
