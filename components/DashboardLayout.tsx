'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ThemeToggle from '@/components/SafeThemeToggle'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname()
  
  // Login sayfasında sidebar gösterme
  if (pathname === '/') {
    return <>{children}</>
  }

  // Sayfa başlığını otomatik belirle
  const getPageTitle = () => {
    if (title) return title
    
    switch (pathname) {
      case '/dashboard': return 'Dashboard'
      case '/tickets': return 'Destek Talepleri'
      case '/monitoring': return 'Sistem İzleme'
      case '/users': return 'Kullanıcı Yönetimi'
      case '/settings': return 'Ayarlar'
      default: return 'IT Management'
    }
  }

  return (
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
              <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
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
  )
}