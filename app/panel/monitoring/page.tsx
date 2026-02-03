'use client'

import { ComputerDesktopIcon, ServerIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import SubHeader from '@/components/SubHeader'
import Modal, { ModalBody, ModalFooter } from '@/components/Modal'
import ViewModal from '@/components/ViewModal'

export default function Monitoring() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingServer, setEditingServer] = useState<any>(null)
  const [viewingServer, setViewingServer] = useState<any>(null)
  const [newServer, setNewServer] = useState({
    name: '',
    ipAddress: ''
  })
  const [allServers, setAllServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServers()
  }, [])

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers')
      if (response.ok) {
        const data = await response.json()
        setAllServers(data.servers)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filteredServers = allServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || server.status === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const filterOptions = [
    { value: 'online', label: 'Çevrimiçi', count: allServers.filter(s => s.status === 'online').length },
    { value: 'offline', label: 'Çevrimdışı', count: allServers.filter(s => s.status === 'offline').length },
  ]

  const handleCreateServer = async () => {
    try {
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newServer)
      })
      if (response.ok) {
        await fetchServers()
        setIsModalOpen(false)
        setNewServer({ name: '', ipAddress: '' })
      }
    } catch (error) {
      console.error('Create error:', error)
    }
  }

  const handleEditServer = (server: any) => {
    setEditingServer({...server})
    setIsEditModalOpen(true)
  }

  const handleUpdateServer = async () => {
    try {
      const response = await fetch(`/api/servers/${editingServer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingServer.name,
          ipAddress: editingServer.ip_address,
          status: editingServer.status
        })
      })
      if (response.ok) {
        await fetchServers()
        setIsEditModalOpen(false)
        setEditingServer(null)
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleDeleteServer = async (serverId: number) => {
    if (confirm('Bu sunucuyu silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/servers/${serverId}`, { method: 'DELETE' })
        if (response.ok) {
          await fetchServers()
          setIsDetailModalOpen(false)
        }
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
  }

  const handleViewServer = (server: any) => {
    setViewingServer(server)
    setIsDetailModalOpen(true)
  }

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
        actionButton={{
          label: 'Sistem Ekle',
          icon: PlusIcon,
          onClick: () => setIsModalOpen(true)
        }}
        exportButton={{
          table: 'servers'
        }}
        printButton={{
          targetId: 'monitoring-content',
          fileName: 'sistem_izleme_raporu'
        }}
      />

      <div id="monitoring-content">

      {loading ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
        </div>
      ) : (
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sunucu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    IP Adresi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    CPU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bellek
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Disk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Detay
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredServers.map((server) => (
                  <tr key={server.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ServerIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {server.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {server.ip_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        server.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {server.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${server.cpu_usage > 80 ? 'bg-red-600' : server.cpu_usage > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                            style={{ width: `${server.cpu_usage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{server.cpu_usage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${server.memory_usage > 80 ? 'bg-red-600' : server.memory_usage > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                            style={{ width: `${server.memory_usage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{server.memory_usage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${server.disk_usage > 80 ? 'bg-red-600' : server.disk_usage > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                            style={{ width: `${server.disk_usage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{server.disk_usage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEditServer(server)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                      >
                        Düzenle
                      </button>
                      <button 
                        onClick={() => handleDeleteServer(server.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Sil
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewServer(server)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Görüntüle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
      </div>
      
      {/* New Server Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yeni Sistem Ekle"
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sistem Adı
              </label>
              <input
                type="text"
                value={newServer.name}
                onChange={(e) => setNewServer({...newServer, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="örn: Web Server 02"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                IP Adresi
              </label>
              <input
                type="text"
                value={newServer.ipAddress}
                onChange={(e) => setNewServer({...newServer, ipAddress: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="192.168.1.100"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sunucu Tipi
              </label>
              <select
                value={newServer.serverType}
                onChange={(e) => setNewServer({...newServer, serverType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Web Server">Web Server</option>
                <option value="Database Server">Database Server</option>
                <option value="Mail Server">Mail Server</option>
                <option value="File Server">File Server</option>
                <option value="Application Server">Application Server</option>
                <option value="Backup Server">Backup Server</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açıklama
              </label>
              <textarea
                value={newServer.description}
                onChange={(e) => setNewServer({...newServer, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sunucu hakkında kısa açıklama (opsiyonel)"
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Bilgi:</strong> Sistem eklendikten sonra otomatik olarak izlemeye başlanacak ve performans metrikleri toplanmaya başlayacaktır.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <button
            onClick={handleCreateServer}
            disabled={!newServer.name.trim() || !newServer.ipAddress.trim()}
            className="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3"
          >
            Sistem Ekle
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            İptal
          </button>
        </ModalFooter>
      </Modal>
      
      {/* Edit Server Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Sunucu Düzenle"
      >
        <ModalBody>
          {editingServer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sistem Adı
                </label>
                <input
                  type="text"
                  value={editingServer.name}
                  onChange={(e) => setEditingServer({...editingServer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  IP Adresi
                </label>
                <input
                  type="text"
                  value={editingServer.ip_address}
                  onChange={(e) => setEditingServer({...editingServer, ip_address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durum
                </label>
                <select
                  value={editingServer.status}
                  onChange={(e) => setEditingServer({...editingServer, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="online">Çevrimiçi</option>
                  <option value="offline">Çevrimdışı</option>
                </select>
              </div>
            </div>
          )}
        </ModalBody>
        
        <ModalFooter>
          <button
            onClick={handleUpdateServer}
            disabled={!editingServer?.name?.trim() || !editingServer?.ip_address?.trim()}
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
      
      {/* View Modal */}
      <ViewModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Sunucu Detayı - ${viewingServer?.name}`}
        data={viewingServer || {}}
        fields={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Sunucu Adı' },
          { key: 'ip_address', label: 'IP Adresi' },
          { key: 'status', label: 'Durum' },
          { key: 'cpu_usage', label: 'CPU Kullanımı (%)' },
          { key: 'memory_usage', label: 'Bellek Kullanımı (%)' },
          { key: 'disk_usage', label: 'Disk Kullanımı (%)' },
        ]}
        onEdit={() => {
          setEditingServer(viewingServer)
          setIsEditModalOpen(true)
        }}
        onDelete={() => handleDeleteServer(viewingServer?.id)}
      />
    </>
  )
}