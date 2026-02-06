'use client'

import { PlusIcon, ComputerDesktopIcon, PrinterIcon, ServerIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import SubHeader from '@/components/SubHeader'
import Modal, { ModalBody, ModalFooter } from '@/components/Modal'
import ViewModal from '@/components/ViewModal'
import { usePagination } from '@/lib/usePagination'
import { SkeletonTable } from '@/components/Skeleton'
import { useToastContext } from '@/components/ToastProvider'
import { formatDate } from '@/lib/formatters'

export default function Inventory() {
  const toast = useToastContext()
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [viewingItem, setViewingItem] = useState<any>(null)
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'Bilgisayar',
    brand: '',
    model: '',
    serialNumber: '',
    location: '',
    status: 'Aktif',
    purchaseDate: '',
    warrantyPeriod: '1'
  })
  const [allItems, setAllItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory')
      const data = await response.json()
      if (response.ok) {
        setAllItems(data.inventory)
      } else {
        toast.error('Hata', data.error || 'Envanter yüklenemedi')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    } finally {
      setLoading(false)
    }
  }
  
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                         item.serial_number?.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const filterOptions = [
    { value: 'Bilgisayar', label: 'Bilgisayar', count: allItems.filter(i => i.type === 'Bilgisayar').length },
    { value: 'Laptop', label: 'Laptop', count: allItems.filter(i => i.type === 'Laptop').length },
    { value: 'Yazıcı', label: 'Yazıcı', count: allItems.filter(i => i.type === 'Yazıcı').length },
    { value: 'Network', label: 'Network', count: allItems.filter(i => i.type === 'Network').length },
    { value: 'Monitör', label: 'Monitör', count: allItems.filter(i => i.type === 'Monitör').length },
  ]
  
  const { currentPage, totalPages, itemsPerPage, startIndex, endIndex, handlePageChange } = usePagination({ totalItems: filteredItems.length })
  const items = filteredItems.slice(startIndex, endIndex)

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'Bilgisayar':
      case 'Laptop':
        return ComputerDesktopIcon
      case 'Yazıcı':
        return PrinterIcon
      case 'Network':
        return ServerIcon
      default:
        return ComputerDesktopIcon
    }
  }

  const calculateWarrantyEndDate = (purchaseDate: string, warrantyPeriod: string) => {
    if (!purchaseDate || !warrantyPeriod) return ''
    const purchase = new Date(purchaseDate)
    const years = parseInt(warrantyPeriod)
    const warrantyEnd = new Date(purchase)
    warrantyEnd.setFullYear(purchase.getFullYear() + years)
    return warrantyEnd.toISOString().split('T')[0]
  }

  const handleCreateItem = async () => {
    const warrantyEndDate = calculateWarrantyEndDate(newItem.purchaseDate, newItem.warrantyPeriod)
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, warrantyEndDate })
      })
      const data = await response.json()
      if (response.ok) {
        toast.success('Başarılı', 'Envanter başarıyla eklendi')
        setIsModalOpen(false)
        setNewItem({ name: '', type: 'Bilgisayar', brand: '', model: '', serialNumber: '', location: '', status: 'Aktif', purchaseDate: '', warrantyPeriod: '1' })
        fetchInventory()
      } else {
        toast.error('Hata', data.error || 'Envanter eklenemedi')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    }
  }

  const handleEditItem = (item: any) => {
    setEditingItem({...item})
    setIsEditModalOpen(true)
  }

  const handleUpdateItem = async () => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      })
      const data = await response.json()
      if (response.ok) {
        toast.success('Başarılı', 'Envanter başarıyla güncellendi')
        setIsEditModalOpen(false)
        setEditingItem(null)
        fetchInventory()
      } else {
        toast.error('Hata', data.error || 'Envanter güncellenemedi')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    toast.confirm(
      'Silme Onayı',
      'Bu envanteri silmek istediğinizden emin misiniz?',
      async () => {
        try {
          const response = await fetch(`/api/inventory?id=${itemId}`, { method: 'DELETE' })
          const data = await response.json()
          if (response.ok) {
            toast.success('Başarılı', 'Envanter başarıyla silindi')
            fetchInventory()
          } else {
            toast.error('Hata', data.error || 'Envanter silinemedi')
          }
        } catch (error) {
          toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
        }
      }
    )
  }

  const handleViewItem = (item: any) => {
    setViewingItem(item)
    setIsDetailModalOpen(true)
  }

  if (loading) {
    return (
      <>
        <SubHeader
          title="Envanter Yönetimi"
          description="IT varlıklarını takip edin"
          searchPlaceholder="Envanter ara..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterOptions={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          actionButton={{
            label: 'Yeni Envanter',
            icon: PlusIcon,
            onClick: () => setIsModalOpen(true)
          }}
          exportButton={{ table: 'inventory' }}
          printButton={{ targetId: 'inventory-content', fileName: 'envanter_raporu' }}
        />
        <SkeletonTable rows={5} columns={8} />
      </>
    )
  }

  return (
    <>
      <SubHeader
        title="Envanter Yönetimi"
        description="IT varlıklarını takip edin"
        searchPlaceholder="Envanter ara..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        actionButton={{
          label: 'Yeni Envanter',
          icon: PlusIcon,
          onClick: () => setIsModalOpen(true)
        }}
        exportButton={{ table: 'inventory' }}
        printButton={{ targetId: 'inventory-content', fileName: 'envanter_raporu' }}
      />

      <div id="inventory-content">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cihaz</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Marka/Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Seri No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lokasyon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Garanti</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşlemler</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detay</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item) => {
                    const IconComponent = getItemIcon(item.type)
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <IconComponent className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{item.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{item.brand}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.model}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.serial_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'Aktif' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            item.status === 'Bakımda' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(item.warranty_end_date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleEditItem(item)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4">Düzenle</button>
                          <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Sil</button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button onClick={() => handleViewItem(item)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">Görüntüle</button>
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
            totalItems={filteredItems.length} 
            itemsPerPage={itemsPerPage} 
            onPageChange={handlePageChange} 
          />
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Envanter Ekle">
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cihaz Adı</label>
              <input type="text" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cihaz adını girin" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tip</label>
              <select value={newItem.type} onChange={(e) => setNewItem({...newItem, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Bilgisayar">Bilgisayar</option>
                <option value="Laptop">Laptop</option>
                <option value="Yazıcı">Yazıcı</option>
                <option value="Network">Network</option>
                <option value="Monitör">Monitör</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marka</label>
              <input type="text" value={newItem.brand} onChange={(e) => setNewItem({...newItem, brand: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Marka adı" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
              <input type="text" value={newItem.model} onChange={(e) => setNewItem({...newItem, model: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Model adı" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seri Numarası</label>
              <input type="text" value={newItem.serialNumber} onChange={(e) => setNewItem({...newItem, serialNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Seri numarası" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lokasyon</label>
              <input type="text" value={newItem.location} onChange={(e) => setNewItem({...newItem, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Bulunduğu yer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durum</label>
              <select value={newItem.status} onChange={(e) => setNewItem({...newItem, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Aktif">Aktif</option>
                <option value="Bakımda">Bakımda</option>
                <option value="Arızalı">Arızalı</option>
                <option value="Devre Dışı">Devre Dışı</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Satın Alma Tarihi</label>
              <input type="date" value={newItem.purchaseDate} onChange={(e) => setNewItem({...newItem, purchaseDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Garanti Süresi</label>
              <select value={newItem.warrantyPeriod} onChange={(e) => setNewItem({...newItem, warrantyPeriod: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="0.5">6 Ay</option>
                <option value="1">1 Yıl</option>
                <option value="2">2 Yıl</option>
                <option value="3">3 Yıl</option>
                <option value="4">4 Yıl</option>
                <option value="5">5 Yıl</option>
              </select>
            </div>
            {newItem.purchaseDate && newItem.warrantyPeriod && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Garanti Bitiş Tarihi</label>
                <input 
                  type="text" 
                  value={calculateWarrantyEndDate(newItem.purchaseDate, newItem.warrantyPeriod)} 
                  readOnly 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed" 
                />
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <button onClick={handleCreateItem} disabled={!newItem.name.trim()} className="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3">Envanter Ekle</button>
          <button onClick={() => setIsModalOpen(false)} className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">İptal</button>
        </ModalFooter>
      </Modal>

      {/* Edit Item Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Envanter Düzenle">
        <ModalBody>
          {editingItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cihaz Adı</label>
                <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tip</label>
                <select value={editingItem.type} onChange={(e) => setEditingItem({...editingItem, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Bilgisayar">Bilgisayar</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Yazıcı">Yazıcı</option>
                  <option value="Network">Network</option>
                  <option value="Monitör">Monitör</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marka</label>
                <input type="text" value={editingItem.brand} onChange={(e) => setEditingItem({...editingItem, brand: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
                <input type="text" value={editingItem.model} onChange={(e) => setEditingItem({...editingItem, model: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seri Numarası</label>
                <input type="text" value={editingItem.serial_number} onChange={(e) => setEditingItem({...editingItem, serial_number: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lokasyon</label>
                <input type="text" value={editingItem.location} onChange={(e) => setEditingItem({...editingItem, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durum</label>
                <select value={editingItem.status} onChange={(e) => setEditingItem({...editingItem, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Aktif">Aktif</option>
                  <option value="Bakımda">Bakımda</option>
                  <option value="Arızalı">Arızalı</option>
                  <option value="Devre Dışı">Devre Dışı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Satın Alma Tarihi</label>
                <input type="date" value={editingItem.purchase_date} onChange={(e) => setEditingItem({...editingItem, purchase_date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button onClick={handleUpdateItem} disabled={!editingItem?.name?.trim()} className="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3">Değişiklikleri Kaydet</button>
          <button onClick={() => setIsEditModalOpen(false)} className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">İptal</button>
        </ModalFooter>
      </Modal>

      <ViewModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Envanter Detayı - ${viewingItem?.name}`}
        data={viewingItem || {}}
        fields={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Cihaz Adı' },
          { key: 'type', label: 'Tip' },
          { key: 'brand', label: 'Marka' },
          { key: 'model', label: 'Model' },
          { key: 'serial_number', label: 'Seri No' },
          { key: 'location', label: 'Lokasyon' },
          { key: 'status', label: 'Durum' },
          { key: 'purchase_date', label: 'Satın Alma' },
          { key: 'warranty_end_date', label: 'Garanti' },
        ]}
        onEdit={() => {
          setEditingItem(viewingItem)
          setIsEditModalOpen(true)
        }}
        onDelete={() => handleDeleteItem(viewingItem?.id)}
      />
    </>
  )
}