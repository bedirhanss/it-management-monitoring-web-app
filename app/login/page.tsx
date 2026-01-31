'use client'

import { LockClosedIcon, ComputerDesktopIcon, ServerIcon, ShieldCheckIcon, ChartBarIcon, CogIcon, WifiIcon, CloudIcon, PhoneIcon, EnvelopeIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import ThemeToggle from '@/components/SafeThemeToggle'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Geçerli bir email adresi giriniz')
      setLoading(false)
      return
    }
    
    // Password length validation
    if (password.length < 3) {
      setError('Şifre en az 3 karakter olmalıdır')
      setLoading(false)
      return
    }
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (response.ok) {
        const data = await response.json()
        setTimeout(() => {
          location.replace('/panel/dashboard')
        }, 100)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Giriş başarısız')
      }
    } catch (error) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e as any)
    }
  }
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Left side - Background Image (2/3) */}
      <div className="hidden lg:block relative w-2/3">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/images/login-background-image.jpg"
          alt="IT Management Background"
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">IT Management System</h1>
            <p className="text-xl opacity-90 mb-8">Profesyonel IT destek ve izleme çözümü</p>
            
            {/* IT Icons Grid */}
            <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-white bg-opacity-20 dark:bg-white dark:bg-opacity-10 rounded-full flex items-center justify-center">
                  <ServerIcon className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm opacity-80">Sunucular</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-white bg-opacity-20 dark:bg-white dark:bg-opacity-10 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm opacity-80">Güvenlik</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-white bg-opacity-20 dark:bg-white dark:bg-opacity-10 rounded-full flex items-center justify-center">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm opacity-80">Analitik</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-white bg-opacity-20 dark:bg-white dark:bg-opacity-10 rounded-full flex items-center justify-center">
                  <CogIcon className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm opacity-80">Ayarlar</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-white bg-opacity-20 dark:bg-white dark:bg-opacity-10 rounded-full flex items-center justify-center">
                  <WifiIcon className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm opacity-80">Ağ</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-white bg-opacity-20 dark:bg-white dark:bg-opacity-10 rounded-full flex items-center justify-center">
                  <CloudIcon className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm opacity-80">Bulut</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form (1/3) */}
      <div className="w-full lg:w-1/3 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <ComputerDesktopIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Hesabınıza giriş yapın
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              IT yönetim paneline erişim
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded text-sm">
                {error}
              </div>
            )}
            
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email adresi
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email adresi"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Şifre"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Şifremi unuttum
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-md"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-white/30 rounded animate-pulse"></div>
                      <span className="animate-pulse">Giriş yapılıyor...</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockClosedIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                    </span>
                    Giriş Yap
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Demo: admin@company.com / demo123
              </p>
            </div>
            
            {/* Support Panel */}
            {showForgotPassword && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Destek İletişim
                  </h4>
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Giriş bilgilerinizi hatırlamıyorsanız:
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">+90 (212) 555-0123</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">support@company.com</span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 mt-2">
                    Çalışma: Pazartesi-Cuma 09:00-18:00
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}