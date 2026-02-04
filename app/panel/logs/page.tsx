'use client'

import { MagnifyingGlassIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import SubHeader from '@/components/SubHeader'
import ViewModal from '@/components/ViewModal'
import { usePagination } from '@/lib/usePagination'
import { SkeletonTable, SkeletonStats } from '@/components/Skeleton'

export default function Logs() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [allLogs, setAllLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [viewingLog, setViewingLog] = useState<any>(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      const response = await fetch('/api/logs')
      const data = await response.json()
      if (response.ok) {
        setAllLogs(data.logs)
      } else {
        alert(data.error || 'Loglar yüklenemedi')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
      if (isRefresh) setRefreshing(false)
    }
  }
  
  const filteredLogs = allLogs.filter(log => {
    const matchesSearch = log.message?.toLowerCase().includes(searchValue.toLowerCase()) || 
                         log.source?.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || log.log_level === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const filterOptions = [
    { value: 'ERROR', label: 'Hata', count: allLogs.filter(l => l.log_level === 'ERROR').length },
    { value: 'WARNING', label: 'Uyarı', count: allLogs.filter(l => l.log_level === 'WARNING').length },
    { value: 'INFO', label: 'Bilgi', count: allLogs.filter(l => l.log_level === 'INFO').length },
    { value: 'SUCCESS', label: 'Başarılı', count: allLogs.filter(l => l.log_level === 'SUCCESS').length },
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

  const handleViewLog = (log: any) => {
    setViewingLog(log)
    setIsDetailModalOpen(true)
  }

  if (loading) {
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
          refreshButton={{ onClick: () => fetchLogs(true), loading: refreshing }}
          exportButton={{ table: 'logs' }}
          printButton={{ targetId: 'logs-content', fileName: 'sistem_loglari_raporu' }}
        />
        <SkeletonStats count={4} />
        <SkeletonTable rows={5} columns={7} />
      </>
    )
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
        refreshButton={{ onClick: () => fetchLogs(true), loading: refreshing }}
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
                    {allLogs.filter(l => l.log_level === 'ERROR').length}
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
                    {allLogs.filter(l => l.log_level === 'WARNING').length}
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
                    {allLogs.filter(l => l.log_level === 'INFO').length}
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
                    {allLogs.filter(l => l.log_level === 'SUCCESS').length}
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Görüntüle</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {logs.map((log) => {
                    const IconComponent = getLogIcon(log.log_level)
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {log.created_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <IconComponent className={`h-4 w-4 mr-2 ${getLogColor(log.log_level)}`} />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(log.log_level)}`}>
                              {log.log_level}
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
                          {log.ip_address}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={log.details}>
                            {log.details}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewLog(log)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                          >
                            Görüntüle
                          </button>
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

      <ViewModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Log Detayı - ${viewingLog?.log_level}`}
        data={viewingLog || {}}
        fields={[
          { key: 'id', label: 'ID' },
          { key: 'log_level', label: 'Seviye' },
          { key: 'source', label: 'Kaynak' },
          { key: 'message', label: 'Mesaj' },
          { key: 'ip_address', label: 'IP Adresi' },
          { key: 'details', label: 'Detaylar' },
          { key: 'created_at', label: 'Tarih' },
        ]}
      />
    </>
  )
}