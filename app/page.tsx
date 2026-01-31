'use client'

import { ComputerDesktopIcon, ServerIcon, ShieldCheckIcon, ChartBarIcon, CogIcon, WifiIcon, CloudIcon, UserGroupIcon, TicketIcon, EyeIcon, Bars3Icon, XMarkIcon, ClockIcon, CurrencyDollarIcon, BoltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ThemeToggle from '@/components/SafeThemeToggle'
import { useState } from 'react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId.replace('#', ''))
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    setMobileMenuOpen(false)
  }

  const navigation = [
    { name: 'Ana Sayfa', href: '#home' },
    { name: 'Özellikler', href: '#features' },
    { name: 'Teknolojiler', href: '#technologies' },
    { name: 'Faydalar', href: '#benefits' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <ComputerDesktopIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">IT Management</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login?demo=true"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 text-sm font-medium transition-colors border border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-600 dark:hover:border-blue-400"
              >
                Demo
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Giriş Yap
              </Link>
            </div>

            {/* Mobile buttons */}
            <div className="md:hidden flex items-center space-x-2 mr-12">
              <Link
                href="/login?demo=true"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 text-sm font-medium transition-colors border border-gray-300 dark:border-gray-600 rounded-md"
              >
                Demo
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Giriş Yap
              </Link>
            </div>
          </div>


        </div>
      </header>

      {/* Theme Toggle - Fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div id="home" className="relative bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center py-12 sm:py-16 lg:py-20">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                <span className="block">IT Management</span>
                <span className="block text-blue-600 dark:text-blue-400">System</span>
              </h1>
              <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0">
                Profesyonel IT destek ve izleme çözümü. Sunucularınızı izleyin, destek taleplerini yönetin ve IT altyapınızı kontrol altında tutun.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  Sisteme Giriş
                </Link>
                <a
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, '#features')}
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                >
                  Özellikler
                </a>
              </div>
            </div>
            
            {/* Image */}
            <div className="mt-12 lg:mt-0">
              <div className="relative">
                <img
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-xl"
                  src="/assets/images/login-background-image.jpg"
                  alt="IT Management Dashboard"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Özellikler</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Kapsamlı IT Yönetimi
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400 mx-auto">
              Modern IT altyapınızı yönetmek için ihtiyacınız olan tüm araçlar tek platformda.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                  <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dashboard</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sistem durumu ve performans istatistiklerini tek bakışta görün.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                  <TicketIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ticket System</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Destek taleplerini organize edin ve takip edin.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                  <EyeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sunucularınızı 7/24 izleyin ve performansı takip edin.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
                  <UserGroupIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">User Management</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Kullanıcı hesaplarını ve yetkilerini yönetin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div id="technologies" className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Teknolojiler</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Modern Teknoloji Yığını
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              <div className="col-span-1 flex justify-center items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <ComputerDesktopIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Next.js</span>
                </div>
              </div>
              
              <div className="col-span-1 flex justify-center items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <CogIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">TypeScript</span>
                </div>
              </div>
              
              <div className="col-span-1 flex justify-center items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <ChartBarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tailwind</span>
                </div>
              </div>
              
              <div className="col-span-1 flex justify-center items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <ServerIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">PostgreSQL</span>
                </div>
              </div>
              
              <div className="col-span-1 flex justify-center items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <EyeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Heroicons</span>
                </div>
              </div>
              
              <div className="col-span-1 flex justify-center items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">React</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Faydalar</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Neden IT Management?
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400 mx-auto">
              İşletmeniz için sağladığımız değer ve avantajlar.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Zaman Tasarrufu</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manuel süreçleri otomatikleştirerek %70'e varan zaman tasarrufu sağlayın.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CurrencyDollarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Maliyet Azaltma</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Proaktif izleme ile sistem arızalarını önleyerek operasyonel maliyetleri düşürün.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BoltIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Performans Artışı</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sistem performansını sürekli izleyerek %98.5 uptime garantisi sağlayın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-500 dark:text-gray-400">
              © 2026 IT Management System. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}