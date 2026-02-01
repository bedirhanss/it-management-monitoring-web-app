'use client'

import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import SubHeader from '@/components/SubHeader'
import Modal, { ModalBody, ModalFooter } from '@/components/Modal'
import { usePagination } from '@/lib/usePagination'

export default function Users() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Kullanıcı',
    status: 'Aktif'
  })
  
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

  const handleCreateUser = () => {
    // Kullanıcı oluşturma işlemi burada yapılacak
    console.log('Yeni kullanıcı:', newUser)
    setIsModalOpen(false)
    setNewUser({ name: '', email: '', role: 'Kullanıcı', status: 'Aktif' })
  }

  const handleEditUser = (user) => {
    setEditingUser({...user})
    setIsEditModalOpen(true)
  }

  const handleUpdateUser = () => {
    // Kullanıcı güncelleme işlemi burada yapılacak
    console.log('Güncellenen kullanıcı:', editingUser)
    setIsEditModalOpen(false)
    setEditingUser(null)
  }

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
          onClick: () => setIsModalOpen(true)
        }}
        exportButton={{
          table: 'users'
        }}
        printButton={{
          targetId: 'users-content',
          fileName: 'kullanici_listesi_raporu'
        }}
      />

      <div id="users-content">

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
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                      >
                        Düzenle
                      </button>
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
      </div>
      
      {/* New User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yeni Kullanıcı Oluştur"
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kullanıcının adını girin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Adresi
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="kullanici@company.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rol
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Kullanıcı">Kullanıcı</option>
                <option value="Teknisyen">Teknisyen</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durum
              </label>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Aktif">Aktif</option>
                <option value="Pasif">Pasif</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Geçici Şifre
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kullanıcı için geçici şifre belirleyin"
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Not:</strong> Kullanıcıya email ile giriş bilgileri gönderilecek ve ilk girişte şifre değiştirmesi istenecektir.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <button
            onClick={handleCreateUser}
            disabled={!newUser.name.trim() || !newUser.email.trim()}
            className="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3"
          >
            Kullanıcı Oluştur
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            İptal
          </button>
        </ModalFooter>
      </Modal>
      
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Kullanıcı Düzenle"
      >
        <ModalBody>
          {editingUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Adresi
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Kullanıcı">Kullanıcı</option>
                  <option value="Teknisyen">Teknisyen</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durum
                </label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Pasif">Pasif</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>Dikkat:</strong> Kullanıcı bilgilerini değiştirdiğinizde, kullanıcıya email ile bilgilendirme gönderilecektir.
                  </p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        
        <ModalFooter>
          <button
            onClick={handleUpdateUser}
            disabled={!editingUser?.name?.trim() || !editingUser?.email?.trim()}
            className="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3"
          >
            Değişiklikleri Kaydet
          </button>
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            İptal
          </button>
        </ModalFooter>
      </Modal>
    </>
  )
}