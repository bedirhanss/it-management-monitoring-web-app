'use client'

import Link from 'next/link'
import { 
  TicketIcon, 
  ComputerDesktopIcon, 
  UsersIcon, 
  CubeIcon, 
  FolderIcon, 
  CalendarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function QuickAccess() {
  const shortcuts = [
    {
      title: 'Tickets',
      description: 'Destek talepleri yönetimi',
      icon: TicketIcon,
      href: '/panel/tickets',
      color: 'green',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Monitoring',
      description: 'Sunucu izleme ve performans',
      icon: ComputerDesktopIcon,
      href: '/panel/monitoring',
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Users',
      description: 'Kullanıcı yönetimi',
      icon: UsersIcon,
      href: '/panel/users',
      color: 'orange',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      title: 'Inventory',
      description: 'Envanter ve stok takibi',
      icon: CubeIcon,
      href: '/panel/inventory',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Projects',
      description: 'Proje yönetimi',
      icon: FolderIcon,
      href: '/panel/projects',
      color: 'pink',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      title: 'Calendar',
      description: 'Takvim ve etkinlikler',
      icon: CalendarIcon,
      href: '/panel/calendar',
      color: 'teal',
      gradient: 'from-teal-500 to-green-600'
    },
  ]

  const colorClasses = {
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-600 dark:text-green-400',
      hover: 'group-hover:border-green-300 dark:group-hover:border-green-700'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-600 dark:text-purple-400',
      hover: 'group-hover:border-purple-300 dark:group-hover:border-purple-700'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-600 dark:text-orange-400',
      hover: 'group-hover:border-orange-300 dark:group-hover:border-orange-700'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'group-hover:border-blue-300 dark:group-hover:border-blue-700'
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      border: 'border-pink-200 dark:border-pink-800',
      text: 'text-pink-600 dark:text-pink-400',
      hover: 'group-hover:border-pink-300 dark:group-hover:border-pink-700'
    },
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      border: 'border-teal-200 dark:border-teal-800',
      text: 'text-teal-600 dark:text-teal-400',
      hover: 'group-hover:border-teal-300 dark:group-hover:border-teal-700'
    },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {shortcuts.map((shortcut) => {
        const colors = colorClasses[shortcut.color as keyof typeof colorClasses]
        const Icon = shortcut.icon
        
        return (
          <Link
            key={shortcut.title}
            href={shortcut.href}
            className={`group relative overflow-hidden rounded-xl border ${colors.border} ${colors.hover} bg-white dark:bg-gray-800 p-5 transition-all hover:shadow cursor-pointer`}
          >
            {/* Gradient Background */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${shortcut.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`}></div>
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <ArrowRightIcon className={`h-5 w-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
              
              <h3 className={`text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:${colors.text} transition-colors`}>
                {shortcut.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {shortcut.description}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
