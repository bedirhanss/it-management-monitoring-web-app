'use client'

import { PlusIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import Modal, { ModalBody, ModalFooter } from '@/components/Modal'
import SubHeader from '@/components/SubHeader'
import { useToastContext } from '@/components/ToastProvider'

export default function Calendar() {
  const toast = useToastContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewingDate, setViewingDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'Bakım',
    startTime: '',
    endTime: '',
    assignedTo: ''
  })

  useEffect(() => {
    fetchEvents()
    fetchUsers()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/calendar')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      } else {
        toast.error('Hata', 'Etkinlikler yüklenirken bir hata oluştu')
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
      if (response.ok) {
        const data = await response.json()
        setAllUsers(data.users || [])
      }
    } catch (error) {
      console.error('Users fetch error:', error)
    }
  }

  const getMonthName = (date: Date) => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ]
    return months[date.getMonth()]
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Pazartesi = 0
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchValue.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || event.event_type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const filterOptions = [
    { value: 'Bakım', label: 'Bakım', count: events.filter(e => e.event_type === 'Bakım').length },
    { value: 'Güncelleme', label: 'Güncelleme', count: events.filter(e => e.event_type === 'Güncelleme').length },
    { value: 'Toplantı', label: 'Toplantı', count: events.filter(e => e.event_type === 'Toplantı').length },
    { value: 'Kontrol', label: 'Kontrol', count: events.filter(e => e.event_type === 'Kontrol').length },
    { value: 'Güvenlik', label: 'Güvenlik', count: events.filter(e => e.event_type === 'Güvenlik').length },
  ]

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return filteredEvents.filter(event => {
      if (!event.event_date) return false
      // Sadece tarih kısmını al, timezone dönüşümü yapma
      const eventDateStr = event.event_date.substring(0, 10)
      return eventDateStr === dateStr
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Bakım':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Güncelleme':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Toplantı':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'Kontrol':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Güvenlik':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    setViewingDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 1)
      } else {
        newDate.setDate(prev.getDate() + 1)
      }
      // Eğer yeni tarih farklı bir ayda ise, takvim ayını da güncelle
      if (newDate.getMonth() !== currentDate.getMonth() || newDate.getFullYear() !== currentDate.getFullYear()) {
        setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1))
      }
      return newDate
    })
  }

  const handleDateClick = (day: number, openModal: boolean = true) => {
    // Timezone sorununu çözmek için local tarih oluştur
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const clickedDate = new Date(year, month, day, 12, 0, 0) // Saat 12:00 olarak ayarla
    setViewingDate(clickedDate)
    if (openModal) {
      setSelectedDate(clickedDate)
      setIsModalOpen(true)
    }
  }

  const handleCreateEvent = async () => {
    if (!selectedDate) return
    
    try {
      // Timezone sorununu çözmek için local tarih kullanıyoruz
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const localDate = `${year}-${month}-${day}`
      
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          eventType: newEvent.type,
          eventDate: localDate,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
          assignedTo: newEvent.assignedTo || null
        })
      })
      
      if (response.ok) {
        await fetchEvents()
        setIsModalOpen(false)
        setNewEvent({ title: '', description: '', type: 'Bakım', startTime: '', endTime: '', assignedTo: '' })
        setSelectedDate(null)
        toast.success('Başarılı', 'Etkinlik başarıyla oluşturuldu')
      } else {
        toast.error('Hata', 'Etkinlik oluşturulurken bir hata oluştu')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    }
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Boş günler (önceki aydan)
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 dark:bg-gray-900"></div>)
    }

    // Ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day)
      const isSelected = viewingDate.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
      
      days.push(
        <div 
          key={day} 
          className={`h-32 border border-gray-200 dark:border-gray-700 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
            isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
          }`}
          onClick={(e) => {
            if (e.detail === 1) {
              handleDateClick(day, false)
            } else if (e.detail === 2) {
              handleDateClick(day, true)
            }
          }}
        >
          <div className={`text-sm font-medium mb-1 ${
            isSelected ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-900 dark:text-white'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id} 
                className={`text-xs px-2 py-1 rounded truncate ${getEventTypeColor(event.event_type)}`}
                title={`${event.title} - ${event.start_time}-${event.end_time}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                +{dayEvents.length - 2} daha
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const selectedDayEvents = filteredEvents.filter(event => {
    const year = viewingDate.getFullYear()
    const month = String(viewingDate.getMonth() + 1).padStart(2, '0')
    const day = String(viewingDate.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    if (!event.event_date) return false
    const eventDateStr = event.event_date.substring(0, 10)
    return eventDateStr === dateStr
  })

  const isViewingToday = viewingDate.toDateString() === new Date().toDateString()

  return (
    <>
      <SubHeader
        title="Takvim"
        description="Bakım planları ve etkinlikleri"
        searchPlaceholder="Etkinlik ara..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        actionButton={{
          label: 'Yeni Etkinlik',
          icon: PlusIcon,
          onClick: () => setIsModalOpen(true)
        }}
        exportButton={{
          table: 'calendar_events',
          fileName: 'takvim_etkinlikleri'
        }}
      />

      <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Önceki ay"
                >
                  ←
                </button>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white min-w-[150px] text-center">
                  {getMonthName(currentDate)} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Sonraki ay"
                >
                  →
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigateDay('prev')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Önceki gün"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    const today = new Date()
                    setViewingDate(today)
                    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
                  }}
                  className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40"
                >
                  {viewingDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                </button>
                <button
                  onClick={() => navigateDay('next')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Sonraki gün"
                >
                  →
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Days of week */}
              <div className="grid grid-cols-7 gap-0 mb-2">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-0 border border-gray-200 dark:border-gray-700">
                {renderCalendar()}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Day Events */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isViewingToday ? 'Bugünün Etkinlikleri' : viewingDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
              </h3>
              {!isViewingToday && (
                <button
                  onClick={() => setViewingDate(new Date())}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Bugüne dön
                </button>
              )}
            </div>
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map(event => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {event.start_time}-{event.end_time}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <UserIcon className="h-3 w-3 mr-1" />
                      {event.assigned_to_name || 'Atanmamış'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {isViewingToday ? 'Bugün için etkinlik yok' : 'Bu gün için etkinlik yok'}
              </p>
            )}
          </div>

          {/* Event Types Legend */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Etkinlik Türleri</h3>
            <div className="space-y-2">
              {['Bakım', 'Güncelleme', 'Toplantı', 'Kontrol', 'Güvenlik'].map(type => (
                <div key={type} className="flex items-center">
                  <div className={`w-3 h-3 rounded mr-2 ${getEventTypeColor(type).split(' ')[0]}`}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Event Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDate(null)
        }} 
        title={`Yeni Etkinlik ${selectedDate ? `- ${selectedDate.toLocaleDateString('tr-TR')}` : ''}`}
      >
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Etkinlik Başlığı</label>
              <input 
                type="text" 
                value={newEvent.title} 
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Etkinlik başlığı" 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Açıklama</label>
              <textarea 
                value={newEvent.description} 
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} 
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Etkinlik açıklaması" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tür</label>
              <select 
                value={newEvent.type} 
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bakım">Bakım</option>
                <option value="Güncelleme">Güncelleme</option>
                <option value="Toplantı">Toplantı</option>
                <option value="Kontrol">Kontrol</option>
                <option value="Güvenlik">Güvenlik</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sorumlu</label>
              <select 
                value={newEvent.assignedTo} 
                onChange={(e) => setNewEvent({...newEvent, assignedTo: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sorumlu seçin</option>
                {allUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Başlangıç Saati</label>
              <input 
                type="time" 
                value={newEvent.startTime} 
                onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bitiş Saati</label>
              <input 
                type="time" 
                value={newEvent.endTime} 
                onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <button 
            onClick={handleCreateEvent} 
            disabled={!newEvent.title.trim()} 
            className="w-full sm:w-auto inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3"
          >
            Etkinlik Oluştur
          </button>
          <button 
            onClick={() => {
              setIsModalOpen(false)
              setSelectedDate(null)
            }} 
            className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            İptal
          </button>
        </ModalFooter>
      </Modal>
      </div>
    </>
  )
}