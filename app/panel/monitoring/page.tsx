'use client'

import { ComputerDesktopIcon, ServerIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import SubHeader from '@/components/SubHeader'

export default function Monitoring() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  const allServers = [
    { name: 'Web Server 01', status: 'online', cpu: 45, memory: 67, disk: 23 },
    { name: 'Database Server', status: 'online', cpu: 78, memory: 89, disk: 45 },
    { name: 'Mail Server', status: 'offline', cpu: 0, memory: 0, disk: 67 },
    { name: 'File Server', status: 'online', cpu: 23, memory: 34, disk: 89 },
  ]
  
  // Filtreleme ve arama
  const filteredServers = allServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || server.status === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const filterOptions = [
    { value: 'online', label: 'Çevrimiçi', count: allServers.filter(s => s.status === 'online').length },
    { value: 'offline', label: 'Çevrimdışı', count: allServers.filter(s => s.status === 'offline').length },
  ]

  return (
    <>
      <SubHeader
        title="Sistem İzleme"
        description="Sunucu performansını izleyin"
        searchPlaceholder="Sunucu ara..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Servers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredServers.map((server, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <ServerIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{server.name}</h3>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  server.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {server.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">CPU</span>
                    <span className="text-gray-900 dark:text-white">{server.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${server.cpu > 80 ? 'bg-red-600' : server.cpu > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                      style={{ width: `${server.cpu}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Bellek</span>
                    <span className="text-gray-900 dark:text-white">{server.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${server.memory > 80 ? 'bg-red-600' : server.memory > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                      style={{ width: `${server.memory}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Disk</span>
                    <span className="text-gray-900 dark:text-white">{server.disk}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${server.disk > 80 ? 'bg-red-600' : server.disk > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                      style={{ width: `${server.disk}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}