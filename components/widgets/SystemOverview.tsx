'use client'

import { ComputerDesktopIcon, TicketIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface Stats {
  activeServers: number
  totalServers: number
  openTickets: number
  activeUsers: number
  uptime: number
}

export default function SystemOverview() {
  const [stats, setStats] = useState<Stats>({
    activeServers: 0,
    totalServers: 0,
    openTickets: 0,
    activeUsers: 0,
    uptime: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [serversRes, ticketsRes, usersRes] = await Promise.all([
          fetch('/api/servers'),
          fetch('/api/tickets'),
          fetch('/api/users')
        ])

        const [serversData, ticketsData, usersData] = await Promise.all([
          serversRes.json(),
          ticketsRes.json(),
          usersRes.json()
        ])

        const activeServers = serversData.servers?.filter((s: any) => s.status === 'online').length || 0
        const totalServers = serversData.servers?.length || 0
        const openTickets = ticketsData.tickets?.filter((t: any) => t.status === 'open').length || 0
        const activeUsers = usersData.users?.filter((u: any) => u.status === 'active').length || 0
        
        // Uptime hesaplama (aktif sunucu oranı)
        const uptime = totalServers > 0 ? (activeServers / totalServers) * 100 : 0

        setStats({
          activeServers,
          totalServers,
          openTickets,
          activeUsers,
          uptime: Math.round(uptime * 10) / 10
        })
      } catch (error) {
        console.error('Stats fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsData = [
    { label: 'Aktif Sunucular', value: stats.activeServers.toString(), total: stats.totalServers.toString(), icon: ComputerDesktopIcon, color: 'green' },
    { label: 'Açık Ticketlar', value: stats.openTickets.toString(), icon: TicketIcon, color: 'yellow' },
    { label: 'Aktif Kullanıcılar', value: stats.activeUsers.toString(), icon: UsersIcon, color: 'purple' },
    { label: 'Sistem Uptime', value: stats.uptime.toString(), unit: '%', icon: ChartBarIcon, color: 'blue' },
  ]

  const colorClasses = {
    green: {
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800'
    },
    yellow: {
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800'
    },
    purple: {
      icon: 'text-purple-600 dark:text-purple-400',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800'
    },
    blue: {
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800'
    },
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {statsData.map((stat) => {
        const colors = colorClasses[stat.color as keyof typeof colorClasses]
        return (
          <div key={stat.label} className={`relative overflow-hidden rounded-xl border ${colors.border} bg-white dark:bg-gray-800 p-5 transition-all hover:shadow cursor-pointer`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  {stat.total && (
                    <span className="text-lg text-gray-500 dark:text-gray-400">/ {stat.total}</span>
                  )}
                  {stat.unit && (
                    <span className="text-lg text-gray-500 dark:text-gray-400">{stat.unit}</span>
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-xl border ${colors.border}`}>
                <stat.icon className={`h-6 w-6 ${colors.icon}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
