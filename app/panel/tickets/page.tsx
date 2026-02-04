'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import SubHeader from '@/components/SubHeader'
import Modal, { ModalBody, ModalFooter } from '@/components/Modal'
import ViewModal from '@/components/ViewModal'
import { usePagination } from '@/lib/usePagination'
import { SkeletonTable } from '@/components/Skeleton'

export default function Tickets() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<any>(null)
  const [viewingTicket, setViewingTicket] = useState<any>(null)
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    assignedTo: ''
  })
  const [allTickets, setAllTickets] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
    fetchUsers()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) {
        const data = await response.json()
        setAllTickets(data.tickets)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setAllUsers(data.users || [])
      }
    } catch (error) {
      console.error('Fetch users error:', error)
    }
  }

  const statusMap: any = { 'open': 'Açık', 'in_progress': 'İşlemde', 'closed': 'Kapalı' }
  const priorityMap: any = { 'low': 'Düşük', 'medium': 'Orta', 'high': 'Yüksek' }
  const reverseStatusMap: any = { 'Açık': 'open', 'İşlemde': 'in_progress', 'Kapalı': 'closed' }
  const reversePriorityMap: any = { 'Düşük': 'low', 'Orta': 'medium', 'Yüksek': 'high' }

  const filteredTickets = allTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || statusMap[ticket.status] === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const filterOptions = [
    { value: 'Açık', label: 'Açık', count: allTickets.filter(t => t.status === 'open').length },
    { value: 'İşlemde', label: 'İşlemde', count: allTickets.filter(t => t.status === 'in_progress').length },
    { value: 'Kapalı', label: 'Kapalı', count: allTickets.filter(t => t.status === 'closed').length },
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

  const handleCreateTicket = async () => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTicket.title,
          description: newTicket.description,
          priority: newTicket.priority,
          status: newTicket.status,
          assignedTo: newTicket.assignedTo || null
        })
      })
      if (response.ok) {
        await fetchTickets()
        setIsModalOpen(false)
        setNewTicket({ title: '', description: '', priority: 'medium', status: 'open', assignedTo: '' })
      }
    } catch (error) {
      console.error('Create error:', error)
    }
  }

  const handleEditTicket = (ticket: any) => {
    setEditingTicket({
      ...ticket,
      status: statusMap[ticket.status] || ticket.status,
      priority: priorityMap[ticket.priority] || ticket.priority
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${editingTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingTicket.title,
          description: editingTicket.description,
          status: reverseStatusMap[editingTicket.status] || editingTicket.status,
          priority: reversePriorityMap[editingTicket.priority] || editingTicket.priority,
          assignedTo: editingTicket.assigned_to || null
        })
      })
      if (response.ok) {
        await fetchTickets()
        setIsEditModalOpen(false)
        setEditingTicket(null)
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleDeleteTicket = async (ticketId: number) => {
    if (confirm('Bu ticketi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/tickets/${ticketId}`, { method: 'DELETE' })
        if (response.ok) {
          await fetchTickets()
          setIsDetailModalOpen(false)
        }
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
  }

  const handleViewTicket = (ticket: any) => {
    setViewingTicket({
      ...ticket,
      status: statusMap[ticket.status],
      priority: priorityMap[ticket.priority],
      created: new Date(ticket.created_at).toLocaleDateString('tr-TR')
    })
    setIsDetailModalOpen(true)
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

      {loading ? (
        <SkeletonTable rows={5} columns={8} />
      ) : (
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Detay
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
                      <div className="text-sm text-gray-900 dark:text-white" title={ticket.description}>
                        {ticket.description?.length > 50 ? ticket.description.substring(0, 50) + '...' : ticket.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.status === 'open' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {statusMap[ticket.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {priorityMap[ticket.priority]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.assigned_to_name ? (
                        <span className="text-sm text-gray-900 dark:text-white">
                          {ticket.assigned_to_name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                          Atanmamış
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(ticket.created_at).toLocaleDateString('tr-TR')}
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewTicket(ticket)}
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
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTickets.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      )}
      </div>
      
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
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durum
              </label>
              <select
                value={newTicket.status}
                onChange={(e) => setNewTicket({...newTicket, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="open">Açık</option>
                <option value="in_progress">İşlemde</option>
                <option value="closed">Kapalı</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Atanan Kişi
              </label>
              <select
                value={newTicket.assignedTo}
                onChange={(e) => setNewTicket({...newTicket, assignedTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Atanmamış</option>
                {allUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
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
                  value={editingTicket.assigned_to || ''}
                  onChange={(e) => setEditingTicket({...editingTicket, assigned_to: e.target.value || null})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Atanmamış</option>
                  {allUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
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
      
      <ViewModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Ticket Detayı - #${viewingTicket?.id}`}
        data={viewingTicket || {}}
        fields={[
          { key: 'id', label: 'ID' },
          { key: 'title', label: 'Başlık' },
          { key: 'description', label: 'Açıklama' },
          { key: 'status', label: 'Durum' },
          { key: 'priority', label: 'Öncelik' },
          { key: 'assigned_to_name', label: 'Atanan Kişi' },
          { key: 'created', label: 'Oluşturulma Tarihi' },
        ]}
        onEdit={() => {
          setEditingTicket(viewingTicket)
          setIsEditModalOpen(true)
        }}
        onDelete={() => handleDeleteTicket(viewingTicket?.id)}
      />
    </>
  )
}
