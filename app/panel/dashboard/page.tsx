'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/Modal'
import SubHeader from '@/components/SubHeader'
import { useToastContext } from '@/components/ToastProvider'
import { widgetRegistry, type WidgetConfig } from '@/components/widgets'

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [previewWidget, setPreviewWidget] = useState<WidgetConfig | null>(null)
  const [activeWidgets, setActiveWidgets] = useState<string[]>([])
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const toast = useToastContext()

  // LocalStorage'dan widget tercihlerini yükle
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboard-widgets')
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets)
        setActiveWidgets(parsed)
      } catch (error) {
        // Hata varsa default widget'ları kullan
        const defaultWidgets = widgetRegistry.filter(w => w.isDefault).map(w => w.id)
        setActiveWidgets(defaultWidgets)
      }
    } else {
      // İlk kez açılıyorsa default widget'ları kullan
      const defaultWidgets = widgetRegistry.filter(w => w.isDefault).map(w => w.id)
      setActiveWidgets(defaultWidgets)
    }
  }, [])

  // Filtreleme
  const filteredWidgets = activeWidgets.filter(widgetId => {
    const widget = widgetRegistry.find(w => w.id === widgetId)
    if (!widget) return false
    
    const matchesSearch = widget.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || widget.id === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  const filterOptions = activeWidgets.map(widgetId => {
    const widget = widgetRegistry.find(w => w.id === widgetId)
    return widget ? { value: widget.id, label: widget.title, count: 1 } : null
  }).filter(Boolean) as { value: string; label: string; count: number }[]

  const handleWidgetToggle = (widgetId: string) => {
    setSelectedWidgets(prev =>
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    )
  }

  const handleSaveWidgets = () => {
    setActiveWidgets(selectedWidgets)
    // LocalStorage'a kaydet
    localStorage.setItem('dashboard-widgets', JSON.stringify(selectedWidgets))
    setIsModalOpen(false)
    toast.success('Başarılı', 'Widget ayarları kaydedildi')
  }

  const handleOpenModal = () => {
    setSelectedWidgets(activeWidgets)
    setIsModalOpen(true)
  }

  const handlePreview = (widget: WidgetConfig) => {
    setPreviewWidget(widget)
  }

  const handleClosePreview = () => {
    setPreviewWidget(null)
  }

  const handleRemoveWidget = (widgetId: string) => {
    const updatedWidgets = activeWidgets.filter(id => id !== widgetId)
    setActiveWidgets(updatedWidgets)
    localStorage.setItem('dashboard-widgets', JSON.stringify(updatedWidgets))
    toast.info('Kaldırıldı', 'Widget dashboard\'dan kaldırıldı')
  }

  return (
    <>
      <SubHeader
        title="Dashboard"
        description="Sistem durumu ve performans istatistikleri"
        searchPlaceholder="Widget ara..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        actionButton={{
          label: 'Widget Ekle',
          icon: PlusIcon,
          onClick: handleOpenModal
        }}
      />

      {/* Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWidgets.map(widgetId => {
          const widget = widgetRegistry.find(w => w.id === widgetId)
          if (!widget) return null

          const WidgetComponent = widget.component
          const colSpan = widget.gridSize === 'large' ? 'lg:col-span-2' : 'lg:col-span-1'

          return (
            <div key={widget.id} className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${colSpan} relative group`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {widget.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    Canlı
                  </span>
                  <button
                    onClick={() => handleRemoveWidget(widget.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Widget'ı kaldır"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <WidgetComponent />
            </div>
          )
        })}
      </div>

      {filteredWidgets.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">Widget bulunamadı</p>
          <p className="text-sm mt-1">Arama veya filtre kriterlerinizi değiştirin</p>
        </div>
      )}

      {/* Widget Seçim Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Widget Yönetimi"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dashboard'unuzda görüntülemek istediğiniz widget'ları seçin
          </p>

          <div className="space-y-2">
            {widgetRegistry.map(widget => (
              <div
                key={widget.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedWidgets.includes(widget.id)}
                  onChange={() => handleWidgetToggle(widget.id)}
                  className="mt-1 h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {widget.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {widget.description}
                  </div>
                </div>
                <button
                  onClick={() => handlePreview(widget)}
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Önizle"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSaveWidgets}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Kaydet
            </button>
          </div>
        </div>
      </Modal>

      {/* Widget Önizleme Modal */}
      {previewWidget && (
        <Modal
          isOpen={true}
          onClose={handleClosePreview}
          title={`Önizleme: ${previewWidget.title}`}
          size="lg"
        >
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <previewWidget.component />
          </div>
        </Modal>
      )}
    </>
  )
}