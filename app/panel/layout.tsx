'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ThemeToggle from '@/components/SafeThemeToggle'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth'
import { useToastContext } from '@/components/ToastProvider'
import { useEffect } from 'react'

interface PanelLayoutProps {
  children: React.ReactNode
}

export default function PanelLayout({ children }: PanelLayoutProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const toast = useToastContext()

  useEffect(() => {
    const welcomeShown = sessionStorage.getItem('welcomeShown')
    if (!welcomeShown) {
      const timer = setTimeout(() => {
        const fetchUser = async () => {
          try {
            const response = await fetch('/api/auth/me')
            if (response.ok) {
              const data = await response.json()
              toast.notification(`Hoşgeldin ${data.user.name}`, 'Panele başarıyla giriş yaptınız')
              sessionStorage.setItem('welcomeShown', 'true')
            }
          } catch (error) {
            console.error('User fetch error:', error)
          }
        }
        fetchUser()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Sayfa başlığını otomatik belirle
  const getPageTitle = () => {
    switch (pathname) {
      case '/panel/dashboard': return 'Dashboard'
      case '/panel/tickets': return 'Destek Talepleri'
      case '/panel/monitoring': return 'Sistem İzleme'
      case '/panel/users': return 'Kullanıcı Yönetimi'
      case '/panel/settings': return 'Ayarlar'
      case '/panel/inventory': return 'Envanter Yönetimi'
      case '/panel/logs': return 'Sistem Logları'
      case '/panel/projects': return 'Proje Yönetimi'
      case '/panel/calendar': return 'Takvim'
      default: return 'IT Management'
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Top bar */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="lg:hidden"></div> {/* Spacer for mobile */}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{getPageTitle()}</h2>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <button 
                  onClick={logout}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}