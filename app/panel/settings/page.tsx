'use client'

import { useState, useEffect } from 'react'
import { UserIcon, CogIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, BellIcon, PaintBrushIcon, CircleStackIcon } from '@heroicons/react/24/outline'
import { useToastContext } from '@/components/ToastProvider'
import { SkeletonCard } from '@/components/Skeleton'

export default function Settings() {
  const toast = useToastContext()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [passwordMode, setPasswordMode] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [notifications, setNotifications] = useState({
    enabled: true
  })

  useEffect(() => {
    fetchUserData()
    loadNotificationSettings()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFormData({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role
        })
      }
    } catch (error) {
      console.error('User fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadNotificationSettings = () => {
    const saved = localStorage.getItem('notificationSettings')
    if (saved) {
      setNotifications(JSON.parse(saved))
    } else {
      const defaults = { enabled: true }
      setNotifications(defaults)
      localStorage.setItem('notificationSettings', JSON.stringify(defaults))
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        await fetchUserData()
        setEditMode(false)
        toast.success('Başarılı', 'Profil bilgileri güncellendi')
      } else {
        toast.error('Hata', 'Profil güncellenirken bir hata oluştu')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    }
  }

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Hata', 'Yeni şifreler eşleşmiyor')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Hata', 'Şifre en az 6 karakter olmalıdır')
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })
      
      if (response.ok) {
        setPasswordMode(false)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        toast.success('Başarılı', 'Şifre başarıyla güncellendi')
      } else {
        const data = await response.json()
        toast.error('Hata', data.error || 'Şifre güncellenirken bir hata oluştu')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserIcon },
    { id: 'notifications', name: 'Bildirimler', icon: BellIcon },
    { id: 'appearance', name: 'Görünüm', icon: PaintBrushIcon },
    { id: 'data', name: 'Veri Yönetimi', icon: CircleStackIcon },
    { id: 'system', name: 'Sistem', icon: CogIcon },
  ]

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex space-x-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-shimmer"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-shimmer"></div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-shimmer"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && user && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profil Bilgileri</h3>
                {user.email !== 'demo@company.com' && (
                  <button
                    onClick={() => editMode ? handleUpdateProfile() : setEditMode(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {editMode ? 'Kaydet' : 'Düzenle'}
                  </button>
                )}
              </div>
              
              {user.email === 'demo@company.com' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <LockClosedIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Demo hesabı düzenlenemez.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!editMode}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!editMode}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rol
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Durum
                  </label>
                  <input
                    type="text"
                    value={user?.status === 'active' ? 'Aktif' : user?.status === 'inactive' ? 'Pasif' : 'Aktif'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white opacity-50"
                  />
                </div>
              </div>

              {/* Şifre Güncelleme */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Şifre Güncelleme</h4>
                  {!passwordMode && user.email !== 'demo@company.com' && (
                    <button
                      onClick={() => setPasswordMode(true)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Şifreyi Değiştir
                    </button>
                  )}
                </div>

                {user.email === 'demo@company.com' ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center">
                      <LockClosedIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Demo hesabı için şifre değiştirme devre dışıdır.
                      </p>
                    </div>
                  </div>
                ) : passwordMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mevcut Şifre
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.current ? (
                            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Yeni Şifre
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.new ? (
                            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Yeni Şifre (Tekrar)
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.confirm ? (
                            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdatePassword}
                        disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Şifreyi Güncelle
                      </button>
                      <button
                        onClick={() => {
                          setPasswordMode(false)
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                        }}
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Bildirim Tercihleri</h3>
              
              {/* Master Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg gap-3">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">Tüm Bildirimler</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Tüm bildirimleri aç veya kapat</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.enabled}
                    onChange={(e) => {
                      const enabled = e.target.checked
                      const updated = { enabled }
                      setNotifications(updated)
                      localStorage.setItem('notificationSettings', JSON.stringify(updated))
                      toast.success(enabled ? 'Açıldı' : 'Kapatıldı', `Tüm bildirimler ${enabled ? 'açıldı' : 'kapatıldı'}`)
                    }}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Görünüm Ayarları</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dil
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tarih Formatı
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Saat Formatı
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="24">24 Saat</option>
                    <option value="12">12 Saat (AM/PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sayfa Başına Kayıt Sayısı
                  </label>
                  <select className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tema
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="theme" value="light" className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Açık</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="theme" value="dark" className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Koyu</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="theme" value="auto" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Otomatik</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Veri Yönetimi</h3>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Verileri Dışa Aktar</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-4">
                  Tüm verilerinizi Excel formatında dışa aktarabilirsiniz.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      window.location.href = '/api/export?table=tickets'
                      toast.success('İndiriliyor', 'Ticketlar dışa aktarılıyor')
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                  >
                    Ticketları İndir
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = '/api/export?table=servers'
                      toast.success('İndiriliyor', 'Sunucular dışa aktarılıyor')
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                  >
                    Sunucuları İndir
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = '/api/export?table=inventory'
                      toast.success('İndiriliyor', 'Envanter dışa aktarılıyor')
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                  >
                    Envanteri İndir
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = '/api/export?table=projects'
                      toast.success('İndiriliyor', 'Projeler dışa aktarılıyor')
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                  >
                    Projeleri İndir
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = '/api/export?table=logs'
                      toast.success('İndiriliyor', 'Loglar dışa aktarılıyor')
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                  >
                    Logları İndir
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sistem Bilgileri</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">Sürüm:</span>
                  <span className="text-gray-900 dark:text-white font-medium">v1.0.0</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">Veritabanı:</span>
                  <span className="text-gray-900 dark:text-white font-medium">PostgreSQL</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">Framework:</span>
                  <span className="text-gray-900 dark:text-white font-medium">Next.js 15</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">Durum:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Çevrimiçi</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
