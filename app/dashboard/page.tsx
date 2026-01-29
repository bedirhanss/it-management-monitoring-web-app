import Link from 'next/link'
import { ChartBarIcon, TicketIcon, ComputerDesktopIcon, UsersIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">IT Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Hoşgeldin, Admin</span>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Sistem durumu ve hızlı erişim</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            <Link href="/dashboard" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Dashboard</dt>
                      <dd className="text-lg font-medium text-gray-900">Sistem Durumu</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/tickets" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TicketIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Tickets</dt>
                      <dd className="text-lg font-medium text-gray-900">Destek Talepleri</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/monitoring" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ComputerDesktopIcon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Monitoring</dt>
                      <dd className="text-lg font-medium text-gray-900">Sistem İzleme</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/users" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Users</dt>
                      <dd className="text-lg font-medium text-gray-900">Kullanıcı Yönetimi</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500">Aktif Sunucular</dt>
                      <dd className="text-2xl font-bold text-gray-900">12/15</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500">Açık Ticketlar</dt>
                      <dd className="text-2xl font-bold text-gray-900">8</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500">Sistem Durumu</dt>
                      <dd className="text-2xl font-bold text-gray-900">%98.5</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Son Aktiviteler</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-600">Server-01 yeniden başlatıldı</p>
                  <span className="text-xs text-gray-400">2 saat önce</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <p className="text-sm text-gray-600">Yeni ticket oluşturuldu: #1234</p>
                  <span className="text-xs text-gray-400">4 saat önce</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full"></div>
                  <p className="text-sm text-gray-600">Database bağlantı hatası</p>
                  <span className="text-xs text-gray-400">6 saat önce</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}