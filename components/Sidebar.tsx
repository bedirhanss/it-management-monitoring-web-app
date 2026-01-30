'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChartBarIcon, 
  TicketIcon, 
  ComputerDesktopIcon, 
  UsersIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import ThemeToggle from '@/components/SafeThemeToggle'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Tickets', href: '/tickets', icon: TicketIcon },
  { name: 'Monitoring', href: '/monitoring', icon: ComputerDesktopIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Ayarlar', href: '/settings', icon: CogIcon },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg"
        >
          <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">IT Management</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tema</span>
            <ThemeToggle />
          </div>
          
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </>
  )
}