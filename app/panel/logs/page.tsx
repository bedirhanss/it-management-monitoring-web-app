'use client'

import { MagnifyingGlassIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import SubHeader from '@/components/SubHeader'
import { usePagination } from '@/lib/usePagination'

export default function Logs() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  const allLogs = [
    { id: 1, timestamp: '2024-01-15 14:30:25', level: 'ERROR', source: 'Authentication', message: 'Failed login attempt for user: admin@company.com', ip: '192.168.1.100', details: 'Invalid password provided' },
    { id: 2, timestamp: '2024-01-15 14:28:15', level: 'INFO', source: 'System', message: 'User logged in successfully', ip: '192.168.1.101', details: 'User: john.doe@company.com' },
    { id: 3, timestamp: '2024-01-15 14:25:10', level: 'WARNING', source: 'Database', message: 'Connection pool reaching maximum capacity', ip: 'localhost', details: 'Current connections: 95/100' },
    { id: 4, timestamp: '2024-01-15 14:20:05', level: 'ERROR', source: 'API', message: 'External service timeout', ip: '192.168.1.50', details: 'Service: backup-service, Timeout: 30s' },
    { id: 5, timestamp: '2024-01-15 14:15:30', level: 'INFO', source: 'Ticket', message: 'New ticket created', ip: '192.168.1.102', details: 'Ticket #1234: Printer issue' },
    { id: 6, timestamp: '2024-01-15 14:10:45', level: 'SUCCESS', source: 'Backup', message: 'Daily backup completed successfully', ip: 'localhost', details: 'Size: 2.5GB, Duration: 15min' },
    { id: 7, timestamp: '2024-01-15 14:05:20', level: 'WARNING', source: 'Security', message: 'Multiple failed login attempts detected', ip: '192.168.1.200', details: 'IP blocked for 30 minutes' },
    { id: 8, timestamp: '2024-01-15 14:00:15', level: 'INFO', source: 'System', message: 'Server maintenance completed', ip: 'localhost', details: 'Downtime: 5 minutes' },
    { id: 9, timestamp: '2024-01-15 13:55:10', level: 'ERROR', source: 'Email', message: 'SMTP server connection failed', ip: 'localhost', details: 'Unable to send notification emails' },
    { id: 10, timestamp: '2024-01-15 13:50:05', level: 'INFO', source: 'Monitoring', message: 'Server health check passed', ip: 'localhost', details: 'All services running normally' },
  ]
  
  const filteredLogs = allLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchValue.toLowerCase()) || 
                         log.source.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || log.level === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const filterOptions = [
    { value: 'ERROR', label: 'Hata', count: allLogs.filter(l => l.level === 'ERROR').length },
    { value: 'WARNING', label: 'Uyarı', count: allLogs.filter(l => l.level === 'WARNING').length },
    { value: 'INFO', label: 'Bilgi', count: allLogs.filter(l => l.level === 'INFO').length },
    { value: 'SUCCESS', label: 'Başarılı', count: allLogs.filter(l => l.level === 'SUCCESS').length },
  ]
  
  const { currentPage, totalPages, itemsPerPage, startIndex, endIndex, handlePageChange } = usePagination({ totalItems: filteredLogs.length })
  const logs = filteredLogs.slice(startIndex, endIndex)

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return XCircleIcon
      case 'WARNING':
        return ExclamationTriangleIcon
      case 'INFO':
        return InformationCircleIcon
      case 'SUCCESS':
        return CheckCircleIcon
      default:
        return InformationCircleIcon
    }
  }

  const getLogColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-500 dark:text-red-400'
      case 'WARNING':
        return 'text-yellow-500 dark:text-yellow-400'
      case 'INFO':
        return 'text-blue-500 dark:text-blue-400'
      case 'SUCCESS':
        return 'text-green-500 dark:text-green-400'
      default:
        return 'text-gray-500 dark:text-gray-400'
    }
  }

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'INFO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <>
      <SubHeader
        title="Sistem Logları"
        description="Sistem aktivitelerini ve hatalarını izleyin"
        searchPlaceholder="Log ara..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        exportButton={{ table: 'logs' }}
        printButton={{ targetId: 'logs-content', fileName: 'sistem_loglari_raporu' }}
      />

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Hatalar</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {allLogs.filter(l => l.level === 'ERROR').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Uyarılar</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {allLogs.filter(l => l.level === 'WARNING').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Bilgi</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {allLogs.filter(l => l.level === 'INFO').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Başarılı</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {allLogs.filter(l => l.level === 'SUCCESS').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="logs-content">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Zaman</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Seviye</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kaynak</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mesaj</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detaylar</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {logs.map((log) => {
                    const IconComponent = getLogIcon(log.level)
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <IconComponent className={`h-4 w-4 mr-2 ${getLogColor(log.level)}`} />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(log.level)}`}>
                              {log.level}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{log.source}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white max-w-md truncate" title={log.message}>
                            {log.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {log.ip}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={log.details}>
                            {log.details}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            totalItems={filteredLogs.length} 
            itemsPerPage={itemsPerPage} 
            onPageChange={handlePageChange} 
          />
        </div>
      </div>
    </>
  )
}