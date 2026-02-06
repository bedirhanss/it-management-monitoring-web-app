'use client'

import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CalendarEvent {
  id: number
  title: string
  event_type: string
  event_date: string
  start_time: string
  end_time: string
  assigned_to_name: string
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/calendar')
        const data = await res.json()
        
        // Bugün ve gelecek etkinlikleri al, son 5 tanesi
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const upcomingEvents = data.events
          ?.filter((event: CalendarEvent) => {
            const eventDate = new Date(event.event_date)
            return eventDate >= today
          })
          .sort((a: CalendarEvent, b: CalendarEvent) => {
            const dateA = new Date(a.event_date + ' ' + a.start_time)
            const dateB = new Date(b.event_date + ' ' + b.start_time)
            return dateA.getTime() - dateB.getTime()
          })
          .slice(0, 5) || []
        
        setEvents(upcomingEvents)
      } catch (error) {
        console.error('Events fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const eventTypeConfig = {
    'Toplantı': { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
    'Eğitim': { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
    'Bakım': { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
    'Diğer': { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-800' },
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    today.setHours(0, 0, 0, 0)
    tomorrow.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    
    if (date.getTime() === today.getTime()) return 'Bugün'
    if (date.getTime() === tomorrow.getTime()) return 'Yarın'
    
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    return time.substring(0, 5) // HH:MM
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Yaklaşan etkinlik yok</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const config = eventTypeConfig[event.event_type as keyof typeof eventTypeConfig] || eventTypeConfig['Diğer']
        
        return (
          <Link
            key={event.id}
            href="/panel/calendar"
            className={`block relative overflow-hidden rounded-xl border ${config.border} bg-white dark:bg-gray-800 p-4 transition-all hover:shadow cursor-pointer group`}
          >
            <div className="flex items-start gap-3">
              {/* Tarih Kutusu */}
              <div className={`flex-shrink-0 w-14 h-14 rounded-lg ${config.bg} border ${config.border} flex flex-col items-center justify-center`}>
                <span className={`text-xs font-medium ${config.color}`}>
                  {formatDate(event.event_date)}
                </span>
                <span className={`text-lg font-bold ${config.color}`}>
                  {new Date(event.event_date).getDate()}
                </span>
              </div>
              
              {/* İçerik */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </h4>
                  <span className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
                    {event.event_type}
                  </span>
                </div>
                
                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                  </div>
                  {event.assigned_to_name && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        <span>{event.assigned_to_name}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
      
      <Link
        href="/panel/calendar"
        className="block text-center py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Tüm etkinlikleri görüntüle →
      </Link>
    </div>
  )
}
