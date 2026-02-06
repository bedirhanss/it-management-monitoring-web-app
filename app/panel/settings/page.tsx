'use client'

import { useState, useEffect } from 'react'
import { UserIcon, CogIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useToastContext } from '@/components/ToastProvider'

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

  useEffect(() => {
    fetchUserData()
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
    { id: 'system', name: 'Sistem', icon: CogIcon },
  ]

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && user && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profil Bilgileri</h3>
                <button
                  onClick={() => editMode ? handleUpdateProfile() : setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {editMode ? 'Kaydet' : 'Düzenle'}
                </button>
              </div>
              
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
