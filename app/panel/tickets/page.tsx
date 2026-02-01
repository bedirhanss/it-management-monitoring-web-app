'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import SubHeader from '@/components/SubHeader'
import Modal, { ModalBody, ModalFooter } from '@/components/Modal'
import { usePagination } from '@/lib/usePagination'

export default function Tickets() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<any>(null)
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Orta'
  })
  
  const allTickets = [
    { id: 1, title: 'Printer sorunu', description: 'Ofis yazıcısı çalışmıyor, kağıt sıkışması var', status: 'Açık', priority: 'Yüksek', assignedTo: 'Ahmet Yılmaz', created: '2024-01-15' },
    { id: 2, title: 'Email erişim problemi', description: 'Outlook bağlantı hatası, mail gönderilemiyor', status: 'İşlemde', priority: 'Orta', assignedTo: 'Ayşe Demir', created: '2024-01-14' },
    { id: 3, title: 'Yazılım güncelleme', description: 'Antivirus güncellemesi gerekli, lisans süresi dolmuş', status: 'Kapalı', priority: 'Düşük', assignedTo: 'Mehmet Kaya', created: '2024-01-13' },
    { id: 4, title: 'Ağ bağlantı sorunu', description: 'İnternet bağlantısı kesilip duruyor', status: 'Açık', priority: 'Yüksek', assignedTo: null, created: '2024-01-12' },
    { id: 5, title: 'Sunucu performansı', description: 'Web sitesi yavaş açılıyor, performans sorunu', status: 'İşlemde', priority: 'Yüksek', assignedTo: 'Fatma Özkan', created: '2024-01-11' },
    { id: 6, title: 'Kullanıcı hesabı sorunu', description: 'Şifre sıfırlama işlemi çalışmıyor', status: 'Açık', priority: 'Orta', assignedTo: 'Ali Veli', created: '2024-01-10' },
    { id: 7, title: 'Backup hatası', description: 'Otomatik yedekleme sistemi hata veriyor', status: 'Kapalı', priority: 'Yüksek', assignedTo: 'Zeynep Ak', created: '2024-01-09' },
    { id: 8, title: 'VPN bağlantısı', description: 'Uzaktan erişim VPN bağlantısı kurulamıyor', status: 'İşlemde', priority: 'Orta', assignedTo: 'Murat Çelik', created: '2024-01-08' },
    { id: 9, title: 'Lisans yenileme', description: 'Office lisansı süresi dolacak, yenilenmesi gerekiyor', status: 'Açık', priority: 'Düşük', assignedTo: null, created: '2024-01-07' },
    { id: 10, title: 'Güvenlik güncelleme', description: 'Windows güvenlik yamaları yüklenmeli', status: 'Kapalı', priority: 'Yüksek', assignedTo: 'Elif Yıldız', created: '2024-01-06' },
    { id: 11, title: 'Mobil uygulama hatası', description: 'Android uygulaması çöküyor, hata raporu var', status: 'Açık', priority: 'Orta', assignedTo: 'Burak Kara', created: '2024-01-05' },
    { id: 12, title: 'Veritabanı optimizasyonu', description: 'Sorgu performansı düşük, indeksleme gerekli', status: 'İşlemde', priority: 'Düşük', assignedTo: null, created: '2024-01-04' },
  ]
  
  // Filtreleme ve arama
  const filteredTickets = allTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || ticket.status === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const filterOptions = [
    { value: 'Açık', label: 'Açık', count: allTickets.filter(t => t.status === 'Açık').length },
    { value: 'İşlemde', label: 'İşlemde', count: allTickets.filter(t => t.status === 'İşlemde').length },
    { value: 'Kapalı', label: 'Kapalı', count: allTickets.filter(t => t.status === 'Kapalı').length },
  ]
  
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    handlePageChange
  } = usePagination({ totalItems: filteredTickets.length })
  
  const tickets = filteredTickets.slice(startIndex, endIndex)

  const handleCreateTicket = () => {
    // Ticket oluşturma işlemi burada yapılacak
    console.log('Yeni ticket:', newTicket)
    setIsModalOpen(false)
    setNewTicket({ title: '', description: '', priority: 'Orta' })
  }

  const handleEditTicket = (ticket: any) => {
    setEditingTicket({...ticket})
    setIsEditModalOpen(true)
  }

  const handleUpdateTicket = () => {
    console.log('Güncellenen ticket:', editingTicket)
    setIsEditModalOpen(false)
    setEditingTicket(null)
  }

  const handleDeleteTicket = (ticketId: number) => {
    if (confirm('Bu ticketi silmek istediğinizden emin misiniz?')) {
      console.log('Silinen ticket ID:', ticketId)
    }
  }

  return (
    <>
      <SubHeader
        title="Destek Talepleri"
        description="Tüm destek taleplerini yönetin"
        searchPlaceholder="Ticket ara..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        actionButton={{
          label: 'Yeni Ticket',
          icon: PlusIcon,
          onClick: () => setIsModalOpen(true)
        }}
        printButton={{
          targetId: 'tickets-content',
          fileName: 'destek_talepleri_raporu'
        }}
        exportButton={{
          table: 'tickets'
        }}
      />

      <div id="tickets-content">

      {/* Tickets table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Öncelik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Atanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Oluşturulma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          #{ticket.id} - {ticket.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate" title={ticket.description}>
                          {ticket.description}
                        </div>
                        <button 
                          onClick={() => handleEditTicket(ticket)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs underline flex-shrink-0"
                        >
                          daha fazla
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.status === 'Açık' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        ticket.status === 'İşlemde' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.priority === 'Yüksek' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        ticket.priority === 'Orta' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.assignedTo ? (
                        <span className="text-sm text-gray-900 dark:text-white">
                          {ticket.assignedTo}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                          Atanmamış
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {ticket.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEditTicket(ticket)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                      >
                        Düzenle
                      </button>
                      <button 
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Sil
                      </button>
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
          totalItems={filteredTickets.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      </div>
      
      {/* New Ticket Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yeni Ticket Oluştur"
      >
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={newTicket.title}
                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ticket başlığını girin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açıklama
              </label>
              <textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ticket açıklamasını girin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Öncelik
              </label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Düşük">Düşük</option>
                <option value="Orta">Orta</option>
                <option value="Yüksek">Yüksek</option>
              </select>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <button
            onClick={handleCreateTicket}
            disabled={!newTicket.title.trim()}
            className="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3"
          >
            Ticket Oluştur
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            İptal
          </button>
        </ModalFooter>
      </Modal>
      
      {/* Edit Ticket Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Ticket Düzenle"
      >
        <ModalBody>
          {editingTicket && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={editingTicket.title}
                  onChange={(e) => setEditingTicket({...editingTicket, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={editingTicket.description || ''}
                  onChange={(e) => setEditingTicket({...editingTicket, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ticket açıklamasını girin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durum
                </label>
                <select
                  value={editingTicket.status}
                  onChange={(e) => setEditingTicket({...editingTicket, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Açık">Açık</option>
                  <option value="İşlemde">İşlemde</option>
                  <option value="Kapalı">Kapalı</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Öncelik
                </label>
                <select
                  value={editingTicket.priority}
                  onChange={(e) => setEditingTicket({...editingTicket, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Düşük">Düşük</option>
                  <option value="Orta">Orta</option>
                  <option value="Yüksek">Yüksek</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Atanan Kişi
                </label>
                <select
                  value={editingTicket.assignedTo || ''}
                  onChange={(e) => setEditingTicket({...editingTicket, assignedTo: e.target.value || null})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Atanmamış</option>
                  <option value="Ahmet Yılmaz">Ahmet Yılmaz</option>
                  <option value="Ayşe Demir">Ayşe Demir</option>
                  <option value="Mehmet Kaya">Mehmet Kaya</option>
                  <option value="Fatma Özkan">Fatma Özkan</option>
                  <option value="Ali Veli">Ali Veli</option>
                  <option value="Zeynep Ak">Zeynep Ak</option>
                </select>
              </div>
            </div>
          )}
        </ModalBody>
        
        <ModalFooter>
          <button
            onClick={handleUpdateTicket}
            disabled={!editingTicket?.title?.trim()}
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