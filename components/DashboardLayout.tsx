'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/lib/auth'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname()
  
  // Login ve ana sayfada sidebar gösterme
  if (pathname === '/' || pathname === '/login') {
    return <>{children}</>
  }

  // Panel sayfaları kendi layout'unu kullanır
  return <>{children}</>
}