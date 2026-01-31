'use client'

import Link from 'next/link'
import { ChartBarIcon, TicketIcon, ComputerDesktopIcon, UsersIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import SubHeader from '@/components/SubHeader'
import { useToastContext } from '@/components/ToastProvider'

export default function Dashboard() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const toast = useToastContext()
  
  const allActivities = [
    { id: 1, message: 'Server-01 yeniden başlatıldı', time: '2 saat önce', type: 'success' },
    { id: 2, message: 'Yeni ticket oluşturuldu: #1234', time: '4 saat önce', type: 'warning' },
    { id: 3, message: 'Database bağlantı hatası', time: '6 saat önce', type: 'error' },
    { id: 4, message: 'Yeni kullanıcı eklendi: John Doe', time: '8 saat önce', type: 'info' },
  ]
  
  // Filtreleme ve arama
  const filteredActivities = allActivities.filter(activity => {
    const matchesSearch = activity.message.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || activity.type === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const filterOptions = [
    { value: 'success', label: 'Başarılı', count: allActivities.filter(a => a.type === 'success').length },
    { value: 'warning', label: 'Uyarı', count: allActivities.filter(a => a.type === 'warning').length },
    { value: 'error', label: 'Hata', count: allActivities.filter(a => a.type === 'error').length },
    { value: 'info', label: 'Bilgi', count: allActivities.filter(a => a.type === 'info').length },
  ]

  const handleTestToasts = () => {
    toast.success('İşlem Başarılı', 'Veriler başarıyla güncellendi')
    setTimeout(() => toast.info('Bilgi', 'Sistem durumu kontrol ediliyor'), 1000)
    setTimeout(() => toast.warning('Uyarı', 'Disk alanı %85 dolu'), 2000)
    setTimeout(() => toast.error('Hata', 'Sunucu bağlantısı kesildi'), 3000)
  }
  return (
    <>
      <SubHeader
        title="Dashboard"
        description="Sistem durumu ve performans istatistikleri"
        searchPlaceholder="Aktivite ara..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktif Sunucular</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">12/15</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Açık Ticketlar</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">8</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Sistem Durumu</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">%98.5</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktif Kullanıcılar</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">24</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/panel/tickets" className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TicketIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Tickets</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">Destek Talepleri</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/panel/monitoring" className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ComputerDesktopIcon className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Monitoring</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">Sistem İzleme</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/panel/users" className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Users</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">Kullanıcı Yönetimi</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-white/80 truncate">Raporlar</dt>
                  <dd className="text-lg font-medium text-white">Analiz ve Raporlar</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Son Aktiviteler</h3>
          <button
            onClick={handleTestToasts}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Toast Testi
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-400' :
                  activity.type === 'warning' ? 'bg-yellow-400' :
                  activity.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                }`}></div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{activity.message}</p>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}