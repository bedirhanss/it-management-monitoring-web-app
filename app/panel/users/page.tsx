'use client'

import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import SubHeader from '@/components/SubHeader'
import { usePagination } from '@/lib/usePagination'

export default function Users() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  const allUsers = [
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@company.com', role: 'Admin', status: 'Aktif' },
    { id: 2, name: 'Ayşe Demir', email: 'ayse@company.com', role: 'Teknisyen', status: 'Aktif' },
    { id: 3, name: 'Mehmet Kaya', email: 'mehmet@company.com', role: 'Kullanıcı', status: 'Pasif' },
    { id: 4, name: 'Fatma Özkan', email: 'fatma@company.com', role: 'Teknisyen', status: 'Aktif' },
    { id: 5, name: 'Ali Veli', email: 'ali@company.com', role: 'Kullanıcı', status: 'Aktif' },
    { id: 6, name: 'Zeynep Ak', email: 'zeynep@company.com', role: 'Admin', status: 'Aktif' },
    { id: 7, name: 'Murat Çelik', email: 'murat@company.com', role: 'Teknisyen', status: 'Pasif' },
    { id: 8, name: 'Elif Yıldız', email: 'elif@company.com', role: 'Kullanıcı', status: 'Aktif' },
    { id: 9, name: 'Burak Kara', email: 'burak@company.com', role: 'Teknisyen', status: 'Aktif' },
    { id: 10, name: 'Seda Gül', email: 'seda@company.com', role: 'Kullanıcı', status: 'Pasif' },
    { id: 11, name: 'Can Demir', email: 'can@company.com', role: 'Kullanıcı', status: 'Aktif' },
    { id: 12, name: 'Deniz Aydın', email: 'deniz@company.com', role: 'Admin', status: 'Aktif' },
    { id: 13, name: 'Ece Kaya', email: 'ece@company.com', role: 'Teknisyen', status: 'Pasif' },
    { id: 14, name: 'Furkan Yılmaz', email: 'furkan@company.com', role: 'Kullanıcı', status: 'Aktif' },
    { id: 15, name: 'Gül Özkan', email: 'gul@company.com', role: 'Teknisyen', status: 'Aktif' },
  ]
  
  // Filtreleme ve arama
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || user.role === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const filterOptions = [
    { value: 'Admin', label: 'Admin', count: allUsers.filter(u => u.role === 'Admin').length },
    { value: 'Teknisyen', label: 'Teknisyen', count: allUsers.filter(u => u.role === 'Teknisyen').length },
    { value: 'Kullanıcı', label: 'Kullanıcı', count: allUsers.filter(u => u.role === 'Kullanıcı').length },
  ]
  
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    handlePageChange
  } = usePagination({ totalItems: filteredUsers.length })
  
  const users = filteredUsers.slice(startIndex, endIndex)

  return (
    <>
      <SubHeader
        title="Kullanıcı Yönetimi"
        description="Sistem kullanıcılarını yönetin"
        searchPlaceholder="Kullanıcı ara..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        actionButton={{
          label: 'Yeni Kullanıcı',
          icon: PlusIcon,
          onClick: () => console.log('Yeni kullanıcı oluştur')
        }}
      />

      {/* Users table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <UsersIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'Aktif' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4">Düzenle</button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}