'use client'

import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import ThemeToggle from '@/components/SafeThemeToggle'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 opacity-20">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Sayfa Bulunamadı
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Lütfen URL'yi kontrol edin veya ana sayfaya dönün.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Geri Dön
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Ana Sayfa
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 IT Management System
          </p>
        </div>
      </footer>
    </div>
  )
}