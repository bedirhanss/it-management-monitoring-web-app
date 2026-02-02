'use client'

import { PlusIcon, FolderIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import SubHeader from '@/components/SubHeader'
import Modal, { ModalBody, ModalFooter } from '@/components/Modal'
import ViewModal from '@/components/ViewModal'
import { usePagination } from '@/lib/usePagination'

export default function Projects() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
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
  
  const allProjects = [
    { 
      id: 1, 
      name: 'Network Altyapı Yenileme', 
      description: 'Ofis network altyapısının tamamen yenilenmesi', 
      status: 'Devam Ediyor', 
      priority: 'Yüksek', 
      startDate: '2024-01-01', 
      endDate: '2024-03-31', 
      assignedTo: 'Ahmet Yılmaz', 
      budget: '₺150,000',
      team: ['Ahmet Yılmaz', 'Mehmet Kaya', 'Fatma Özkan']
    },
    { 
      id: 2, 
      name: 'ERP Sistemi Entegrasyonu', 
      description: 'Yeni ERP sisteminin mevcut altyapıya entegrasyonu', 
      status: 'Planlama', 
      priority: 'Yüksek', 
      startDate: '2024-02-15', 
      endDate: '2024-06-30', 
      assignedTo: 'Ayşe Demir', 
      budget: '₺300,000',
      team: ['Ayşe Demir', 'Ali Veli', 'Zeynep Ak']
    },
    { 
      id: 3, 
      name: 'Güvenlik Sistemi Güncelleme', 
      description: 'Firewall ve güvenlik yazılımlarının güncellenmesi', 
      status: 'Tamamlandı', 
      priority: 'Orta', 
      startDate: '2023-11-01', 
      endDate: '2023-12-31', 
      assignedTo: 'Murat Çelik', 
      budget: '₺75,000',
      team: ['Murat Çelik', 'Elif Yıldız']
    },
    { 
      id: 4, 
      name: 'Mobil Uygulama Geliştirme', 
      description: 'İç kullanım için mobil uygulama geliştirme projesi', 
      status: 'Devam Ediyor', 
      priority: 'Orta', 
      startDate: '2024-01-15', 
      endDate: '2024-05-15', 
      assignedTo: 'Burak Kara', 
      budget: '₺200,000',
      team: ['Burak Kara', 'Deniz Aydın', 'Ece Kaya']
    },
    { 
      id: 5, 
      name: 'Veri Merkezi Taşınması', 
      description: 'Sunucuların yeni veri merkezine taşınması', 
      status: 'Beklemede', 
      priority: 'Düşük', 
      startDate: '2024-04-01', 
      endDate: '2024-07-31', 
      assignedTo: 'Furkan Yılmaz', 
      budget: '₺500,000',
      team: ['Furkan Yılmaz', 'Gül Özkan']
    },
  ]
  
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchValue.toLowerCase())
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planlama':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Devam Ediyor':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Beklemede':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'Tamamlandı':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Yüksek':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'Orta':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Düşük':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const handleCreateProject = () => {
    console.log('Yeni proje:', newProject)
    setIsModalOpen(false)
    setNewProject({ name: '', description: '', status: 'Planlama', priority: 'Orta', startDate: '', endDate: '', assignedTo: '' })
  }

  const handleViewProject = (project: any) => {
    setViewingProject(project)
    setIsDetailModalOpen(true)
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

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam Proje</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">{allProjects.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Devam Eden</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {allProjects.filter(p => p.status === 'Devam Ediyor').length}
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
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tamamlanan</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {allProjects.filter(p => p.status === 'Tamamlandı').length}
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
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam Bütçe</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">₺1.2M</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bütçe</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detay</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FolderIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={project.description}>
                              {project.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                          <span className="text-sm text-gray-900 dark:text-white">{project.assignedTo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <div>{project.startDate}</div>
                            <div>{project.endDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                        {project.budget}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          onClick={() => handleViewProject(project)} 
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
            totalItems={filteredProjects.length} 
            itemsPerPage={itemsPerPage} 
            onPageChange={handlePageChange} 
          />
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Proje Oluştur">
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proje Adı</label>
              <input 
                type="text" 
                value={newProject.name} 
                onChange={(e) => setNewProject({...newProject, name: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Proje adını girin" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Açıklama</label>
              <textarea 
                value={newProject.description} 
                onChange={(e) => setNewProject({...newProject, description: e.target.value})} 
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Proje açıklaması" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durum</label>
              <select 
                value={newProject.status} 
                onChange={(e) => setNewProject({...newProject, status: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Planlama">Planlama</option>
                <option value="Devam Ediyor">Devam Ediyor</option>
                <option value="Beklemede">Beklemede</option>
                <option value="Tamamlandı">Tamamlandı</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Öncelik</label>
              <select 
                value={newProject.priority} 
                onChange={(e) => setNewProject({...newProject, priority: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Düşük">Düşük</option>
                <option value="Orta">Orta</option>
                <option value="Yüksek">Yüksek</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Başlangıç Tarihi</label>
              <input 
                type="date" 
                value={newProject.startDate} 
                onChange={(e) => setNewProject({...newProject, startDate: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bitiş Tarihi</label>
              <input 
                type="date" 
                value={newProject.endDate} 
                onChange={(e) => setNewProject({...newProject, endDate: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sorumlu</label>
              <select 
                value={newProject.assignedTo} 
                onChange={(e) => setNewProject({...newProject, assignedTo: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sorumlu seçin</option>
                <option value="Ahmet Yılmaz">Ahmet Yılmaz</option>
                <option value="Ayşe Demir">Ayşe Demir</option>
                <option value="Mehmet Kaya">Mehmet Kaya</option>
                <option value="Fatma Özkan">Fatma Özkan</option>
                <option value="Murat Çelik">Murat Çelik</option>
                <option value="Burak Kara">Burak Kara</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bütçe</label>
              <input 
                type="text" 
                value={newProject.budget} 
                onChange={(e) => setNewProject({...newProject, budget: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="₺100,000"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button 
            onClick={handleCreateProject} 
            disabled={!newProject.name.trim()} 
            className="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3"
          >
            Proje Oluştur
          </button>
          <button 
            onClick={() => setIsModalOpen(false)} 
            className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            İptal
          </button>
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
          { key: 'assignedTo', label: 'Sorumlu' },
          { key: 'startDate', label: 'Başlangıç' },
          { key: 'endDate', label: 'Bitiş' },
          { key: 'budget', label: 'Bütçe' },
        ]}
      />
    </>
  )
}