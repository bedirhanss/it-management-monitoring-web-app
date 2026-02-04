'use client'

import { PlusIcon, FolderIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import SubHeader from '@/components/SubHeader'
import Modal, { ModalBody, ModalFooter } from '@/components/Modal'
import ViewModal from '@/components/ViewModal'
import { usePagination } from '@/lib/usePagination'
import { SkeletonTable } from '@/components/Skeleton'
import { useToastContext } from '@/components/ToastProvider'

export default function Projects() {
  const toast = useToastContext()
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [viewingProject, setViewingProject] = useState<any>(null)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'Planlama',
    priority: 'Orta',
    startDate: '',
    endDate: '',
    assignedTo: '',
    budget: ''
  })
  const [allProjects, setAllProjects] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
    fetchUsers()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      if (response.ok) {
        setAllProjects(data.projects)
      } else {
        toast.error('Hata', data.error || 'Projeler yüklenemedi')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (response.ok) {
        setAllUsers(data.users)
      }
    } catch (error) {
      console.error('Users fetch error:', error)
    }
  }
  
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchValue.toLowerCase()) || 
                         project.description?.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const filterOptions = [
    { value: 'Planlama', label: 'Planlama', count: allProjects.filter(p => p.status === 'Planlama').length },
    { value: 'Devam Ediyor', label: 'Devam Ediyor', count: allProjects.filter(p => p.status === 'Devam Ediyor').length },
    { value: 'Beklemede', label: 'Beklemede', count: allProjects.filter(p => p.status === 'Beklemede').length },
    { value: 'Tamamlandı', label: 'Tamamlandı', count: allProjects.filter(p => p.status === 'Tamamlandı').length },
  ]
  
  const { currentPage, totalPages, itemsPerPage, startIndex, endIndex, handlePageChange } = usePagination({ totalItems: filteredProjects.length })
  const projects = filteredProjects.slice(startIndex, endIndex)

  const handleCreateProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      })
      const data = await response.json()
      if (response.ok) {
        toast.success('Başarılı', 'Proje başarıyla oluşturuldu')
        setIsModalOpen(false)
        setNewProject({ name: '', description: '', status: 'Planlama', priority: 'Orta', startDate: '', endDate: '', assignedTo: '', budget: '' })
        fetchProjects()
      } else {
        toast.error('Hata', data.error || 'Proje oluşturulamadı')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    }
  }

  const handleEditProject = (project: any) => {
    setEditingProject({...project})
    setIsEditModalOpen(true)
  }

  const handleUpdateProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject)
      })
      const data = await response.json()
      if (response.ok) {
        toast.success('Başarılı', 'Proje başarıyla güncellendi')
        setIsEditModalOpen(false)
        setEditingProject(null)
        fetchProjects()
      } else {
        toast.error('Hata', data.error || 'Proje güncellenemedi')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    toast.confirm(
      'Silme Onayı',
      'Bu projeyi silmek istediğinizden emin misiniz?',
      async () => {
        try {
          const response = await fetch(`/api/projects?id=${projectId}`, { method: 'DELETE' })
          const data = await response.json()
          if (response.ok) {
            toast.success('Başarılı', 'Proje başarıyla silindi')
            fetchProjects()
          } else {
            toast.error('Hata', data.error || 'Proje silinemedi')
          }
        } catch (error) {
          toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
        }
      }
    )
  }

  const handleViewProject = (project: any) => {
    setViewingProject(project)
    setIsDetailModalOpen(true)
  }

  if (loading) {
    return (
      <>
        <SubHeader
          title="Proje Yönetimi"
          description="IT projelerini takip edin"
          searchPlaceholder="Proje ara..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterOptions={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          actionButton={{
            label: 'Yeni Proje',
            icon: PlusIcon,
            onClick: () => setIsModalOpen(true)
          }}
          exportButton={{ table: 'projects' }}
          printButton={{ targetId: 'projects-content', fileName: 'proje_raporu' }}
        />
        <SkeletonTable rows={5} columns={7} />
      </>
    )
  }

  return (
    <>
      <SubHeader
        title="Proje Yönetimi"
        description="IT projelerini takip edin"
        searchPlaceholder="Proje ara..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        actionButton={{
          label: 'Yeni Proje',
          icon: PlusIcon,
          onClick: () => setIsModalOpen(true)
        }}
        exportButton={{ table: 'projects' }}
        printButton={{ targetId: 'projects-content', fileName: 'proje_raporu' }}
      />

      <div id="projects-content">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Proje</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Öncelik</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sorumlu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bütçe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşlemler</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detay</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FolderIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{project.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          {project.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{project.assigned_to_name || 'Atanmamış'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{project.budget}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEditProject(project)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4">Düzenle</button>
                        <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Sil</button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button onClick={() => handleViewProject(project)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">Görüntüle</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredProjects.length} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />
        </div>
      </div>

      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Proje Oluştur">
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proje Adı</label>
              <input type="text" value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Açıklama</label>
              <textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durum</label>
              <select value={newProject.status} onChange={(e) => setNewProject({...newProject, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Planlama">Planlama</option>
                <option value="Devam Ediyor">Devam Ediyor</option>
                <option value="Beklemede">Beklemede</option>
                <option value="Tamamlandı">Tamamlandı</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Öncelik</label>
              <select value={newProject.priority} onChange={(e) => setNewProject({...newProject, priority: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Düşük">Düşük</option>
                <option value="Orta">Orta</option>
                <option value="Yüksek">Yüksek</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Başlangıç Tarihi</label>
              <input type="date" value={newProject.startDate} onChange={(e) => setNewProject({...newProject, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bitiş Tarihi</label>
              <input type="date" value={newProject.endDate} onChange={(e) => setNewProject({...newProject, endDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sorumlu</label>
              <select value={newProject.assignedTo} onChange={(e) => setNewProject({...newProject, assignedTo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sorumlu seçin</option>
                {allUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bütçe</label>
              <input type="text" value={newProject.budget} onChange={(e) => setNewProject({...newProject, budget: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="₺100,000" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button onClick={handleCreateProject} disabled={!newProject.name.trim()} className="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3">Proje Oluştur</button>
          <button onClick={() => setIsModalOpen(false)} className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">İptal</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Proje Düzenle">
        <ModalBody>
          {editingProject && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proje Adı</label>
                <input type="text" value={editingProject.name} onChange={(e) => setEditingProject({...editingProject, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Açıklama</label>
                <textarea value={editingProject.description} onChange={(e) => setEditingProject({...editingProject, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durum</label>
                <select value={editingProject.status} onChange={(e) => setEditingProject({...editingProject, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Planlama">Planlama</option>
                  <option value="Devam Ediyor">Devam Ediyor</option>
                  <option value="Beklemede">Beklemede</option>
                  <option value="Tamamlandı">Tamamlandı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Öncelik</label>
                <select value={editingProject.priority} onChange={(e) => setEditingProject({...editingProject, priority: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Düşük">Düşük</option>
                  <option value="Orta">Orta</option>
                  <option value="Yüksek">Yüksek</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Başlangıç Tarihi</label>
                <input type="date" value={editingProject.start_date} onChange={(e) => setEditingProject({...editingProject, start_date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bitiş Tarihi</label>
                <input type="date" value={editingProject.end_date} onChange={(e) => setEditingProject({...editingProject, end_date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sorumlu</label>
                <select value={editingProject.assigned_to} onChange={(e) => setEditingProject({...editingProject, assigned_to: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sorumlu seçin</option>
                  {allUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bütçe</label>
                <input type="text" value={editingProject.budget} onChange={(e) => setEditingProject({...editingProject, budget: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button onClick={handleUpdateProject} disabled={!editingProject?.name?.trim()} className="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3">Değişiklikleri Kaydet</button>
          <button onClick={() => setIsEditModalOpen(false)} className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">İptal</button>
        </ModalFooter>
      </Modal>

      <ViewModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Proje Detayı - ${viewingProject?.name}`}
        data={viewingProject || {}}
        fields={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Proje Adı' },
          { key: 'description', label: 'Açıklama' },
          { key: 'status', label: 'Durum' },
          { key: 'priority', label: 'Öncelik' },
          { key: 'assigned_to_name', label: 'Sorumlu' },
          { key: 'start_date', label: 'Başlangıç' },
          { key: 'end_date', label: 'Bitiş' },
          { key: 'budget', label: 'Bütçe' },
        ]}
        onEdit={() => {
          setEditingProject(viewingProject)
          setIsEditModalOpen(true)
          setIsDetailModalOpen(false)
        }}
        onDelete={() => {
          setIsDetailModalOpen(false)
          handleDeleteProject(viewingProject?.id)
        }}
      />
    </>
  )
}
