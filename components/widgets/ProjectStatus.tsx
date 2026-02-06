'use client'

import { FolderIcon, ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface Project {
  id: number
  name: string
  status: string
  priority: string
  start_date: string
  end_date: string
  assigned_to_name: string
}

export default function ProjectStatus() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjects, setSelectedProjects] = useState<number[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        
        const activeProjects = data.projects?.filter((p: Project) => 
          p.status !== 'Tamamlandı' && p.status !== 'İptal'
        ) || []
        
        setProjects(activeProjects)
        
        // İlk 3 projeyi varsayılan olarak seç
        setSelectedProjects(activeProjects.slice(0, 3).map((p: Project) => p.id))
      } catch (error) {
        console.error('Projects fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const statusConfig = {
    'Planlama': { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', progress: 10 },
    'Devam Ediyor': { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', progress: 50 },
    'Test': { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', progress: 80 },
    'Tamamlandı': { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', progress: 100 },
  }

  const priorityConfig = {
    'Düşük': { color: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' },
    'Orta': { color: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
    'Yüksek': { color: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
    'Kritik': { color: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  }

  const toggleProject = (projectId: number) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const displayedProjects = projects.filter(p => selectedProjects.includes(p.id))

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <FolderIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Henüz aktif proje yok</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Proje Seçici */}
      <div className="relative">
        <button
          onClick={() => setIsSelecting(!isSelecting)}
          className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedProjects.length} proje seçili
          </span>
          <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isSelecting ? 'rotate-180' : ''}`} />
        </button>

        {isSelecting && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
            {projects.map((project) => (
              <label
                key={project.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.id)}
                  onChange={() => toggleProject(project.id)}
                  className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {project.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {project.status}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Seçili Projeler */}
      {displayedProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">Lütfen en az bir proje seçin</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedProjects.map((project) => {
            const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig['Planlama']
            const priority = priorityConfig[project.priority as keyof typeof priorityConfig] || priorityConfig['Orta']
            
            return (
              <div
                key={project.id}
                className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all hover:shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                      {project.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${priority.dot}`}></div>
                        <span className={priority.color}>{project.priority}</span>
                      </div>
                      {project.assigned_to_name && (
                        <>
                          <span>•</span>
                          <span>{project.assigned_to_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                    {project.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">İlerleme</span>
                    <span className={`font-bold ${status.color}`}>{status.progress}%</span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${status.bg}`}
                      style={{ width: `${status.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
