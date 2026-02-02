'use client'

import { PlusIcon, CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Modal, { ModalBody, ModalFooter } from '@/components/Modal'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'Bakım',
    startTime: '',
    endTime: '',
    assignedTo: ''
  })

  const events = [
    { id: 1, date: '2024-01-15', title: 'Server Bakımı', type: 'Bakım', time: '14:00-16:00', assignedTo: 'Ahmet Yılmaz', description: 'Web sunucusu rutin bakımı' },
    { id: 2, date: '2024-01-16', title: 'Network Güncelleme', type: 'Güncelleme', time: '09:00-11:00', assignedTo: 'Mehmet Kaya', description: 'Switch firmware güncelleme' },
    { id: 3, date: '2024-01-18', title: 'Proje Toplantısı', type: 'Toplantı', time: '10:00-12:00', assignedTo: 'Ayşe Demir', description: 'ERP projesi durum toplantısı' },
    { id: 4, date: '2024-01-20', title: 'Yedekleme Kontrolü', type: 'Kontrol', time: '15:00-17:00', assignedTo: 'Fatma Özkan', description: 'Haftalık yedekleme kontrolü' },
    { id: 5, date: '2024-01-22', title: 'Güvenlik Taraması', type: 'Güvenlik', time: '13:00-15:00', assignedTo: 'Murat Çelik', description: 'Sistem güvenlik taraması' },
  ]

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

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(event => event.date === dateStr)
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

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
    setIsModalOpen(true)
  }

  const handleCreateEvent = () => {
    console.log('Yeni etkinlik:', newEvent, 'Tarih:', selectedDate)
    setIsModalOpen(false)
    setNewEvent({ title: '', description: '', type: 'Bakım', startTime: '', endTime: '', assignedTo: '' })
    setSelectedDate(null)
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
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
      
      days.push(
        <div 
          key={day} 
          className={`h-32 border border-gray-200 dark:border-gray-700 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
            isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
          }`}
          onClick={() => handleDateClick(day)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id} 
                className={`text-xs px-2 py-1 rounded truncate ${getEventTypeColor(event.type)}`}
                title={`${event.title} - ${event.time}`}
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

  const todayEvents = events.filter(event => {
    const today = new Date().toISOString().split('T')[0]
    return event.date === today
  })

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return eventDate > today && eventDate <= nextWeek
  }).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Takvim</h1>
          <p className="text-gray-600 dark:text-gray-400">Bakım planları ve etkinlikleri</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Yeni Etkinlik
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getMonthName(currentDate)} {currentDate.getFullYear()}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40"
                >
                  Bugün
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
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
          {/* Today's Events */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bugünün Etkinlikleri</h3>
            {todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map(event => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {event.time}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <UserIcon className="h-3 w-3 mr-1" />
                      {event.assignedTo}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Bugün için etkinlik yok</p>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Yaklaşan Etkinlikler</h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border-l-4 border-gray-300 dark:border-gray-600 pl-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {event.date}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {event.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Yaklaşan etkinlik yok</p>
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
                <option value="Ahmet Yılmaz">Ahmet Yılmaz</option>
                <option value="Ayşe Demir">Ayşe Demir</option>
                <option value="Mehmet Kaya">Mehmet Kaya</option>
                <option value="Fatma Özkan">Fatma Özkan</option>
                <option value="Murat Çelik">Murat Çelik</option>
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
  )
}