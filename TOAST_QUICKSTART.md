# Toast Notification - Hızlı Başlangıç

## 5 Dakikada Toast Entegrasyonu

### Adım 1: Import Ekle
```tsx
import { useToastContext } from '@/components/ToastProvider'
```

### Adım 2: Hook'u Kullan
```tsx
export default function MyPage() {
  const toast = useToastContext()
  
  // ... diğer kodlar
}
```

### Adım 3: Toast Göster
```tsx
// Başarı mesajı
toast.success('Başarılı', 'İşlem tamamlandı')

// Hata mesajı
toast.error('Hata', 'Bir sorun oluştu')

// Uyarı mesajı
toast.warning('Uyarı', 'Dikkat gerekli')

// Bilgi mesajı
toast.info('Bilgi', 'Bilgilendirme')

// Onay mesajı ⭐ YENİ
toast.confirm('Emin misiniz?', 'Bu işlem geri alınamaz', () => {
  // Evet butonuna basıldığında
  console.log('Onaylandı')
})
```

## Gerçek Dünya Örneği

### Form Gönderimi
```tsx
'use client'

import { useState } from 'react'
import { useToastContext } from '@/components/ToastProvider'

export default function CreateUserForm() {
  const toast = useToastContext()
  const [formData, setFormData] = useState({ name: '', email: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasyon
    if (!formData.name || !formData.email) {
      toast.warning('Eksik Bilgi', 'Tüm alanları doldurun')
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Başarılı', 'Kullanıcı oluşturuldu')
        setFormData({ name: '', email: '' })
      } else {
        const data = await response.json()
        toast.error('Hata', data.error || 'İşlem başarısız')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Ad Soyad"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <button type="submit">Oluştur</button>
    </form>
  )
}
```

## API İşlemleri İçin Şablon

### CRUD İşlemleri
```tsx
const toast = useToastContext()

// CREATE
const handleCreate = async (data: any) => {
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (response.ok) {
      toast.success('Başarılı', 'Kayıt oluşturuldu')
      // Başarılı işlem sonrası yapılacaklar
    } else {
      toast.error('Hata', 'Kayıt oluşturulamadı')
    }
  } catch (error) {
    toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
  }
}

// READ
const handleFetch = async () => {
  try {
    const response = await fetch('/api/endpoint')
    
    if (response.ok) {
      const data = await response.json()
      // Veriyi kullan
    } else {
      toast.error('Hata', 'Veriler yüklenemedi')
    }
  } catch (error) {
    toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
  }
}

// UPDATE
const handleUpdate = async (id: number, data: any) => {
  try {
    const response = await fetch(`/api/endpoint/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (response.ok) {
      toast.success('Başarılı', 'Kayıt güncellendi')
    } else {
      toast.error('Hata', 'Kayıt güncellenemedi')
    }
  } catch (error) {
    toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
  }
}

// DELETE
const handleDelete = async (id: number) => {
  if (!confirm('Silmek istediğinizden emin misiniz?')) return
  
  try {
    const response = await fetch(`/api/endpoint/${id}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      toast.success('Başarılı', 'Kayıt silindi')
    } else {
      toast.error('Hata', 'Kayıt silinemedi')
    }
  } catch (error) {
    toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
  }
}
```

## Özel Durumlar

### Uzun Süre
```tsx
// 10 saniye göster
toast.info('Yükleniyor', 'Bu işlem biraz zaman alabilir', 10000)
```

### Kısa Süre
```tsx
// 2 saniye göster
toast.success('Kaydedildi', undefined, 2000)
```

### Sadece Başlık
```tsx
toast.success('Başarılı!')
toast.error('Hata!')
```

## Yaygın Kullanım Senaryoları

### 1. Login İşlemi
```tsx
const handleLogin = async (credentials: any) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    
    if (response.ok) {
      toast.success('Hoş Geldiniz', 'Giriş başarılı')
      router.push('/dashboard')
    } else {
      toast.error('Giriş Başarısız', 'Email veya şifre hatalı')
    }
  } catch (error) {
    toast.error('Bağlantı Hatası', 'Lütfen tekrar deneyin')
  }
}
```

### 2. Dosya Yükleme
```tsx
const handleFileUpload = async (file: File) => {
  toast.info('Yükleniyor', 'Dosya yükleme başladı', 3000)
  
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      toast.success('Tamamlandı', 'Dosya başarıyla yüklendi')
    } else {
      toast.error('Hata', 'Dosya yüklenemedi')
    }
  } catch (error) {
    toast.error('Yükleme Hatası', 'Lütfen tekrar deneyin')
  }
}
```

### 3. Form Validasyonu
```tsx
const validateForm = (data: any) => {
  if (!data.email) {
    toast.warning('Eksik Bilgi', 'Email adresi gerekli')
    return false
  }
  
  if (!data.email.includes('@')) {
    toast.error('Geçersiz Email', 'Lütfen geçerli bir email girin')
    return false
  }
  
  if (data.password.length < 6) {
    toast.warning('Zayıf Şifre', 'Şifre en az 6 karakter olmalı')
    return false
  }
  
  return true
}
```

### 4. Toplu İşlem
```tsx
const handleBulkDelete = async (ids: number[]) => {
  toast.info('İşleniyor', `${ids.length} kayıt siliniyor...`)
  
  try {
    const response = await fetch('/api/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    })
    
    if (response.ok) {
      toast.success('Tamamlandı', `${ids.length} kayıt silindi`)
    } else {
      toast.error('Hata', 'Bazı kayıtlar silinemedi')
    }
  } catch (error) {
    toast.error('İşlem Hatası', 'Lütfen tekrar deneyin')
  }
}
```

### 5. Silme Onayı ⭐ YENİ
```tsx
const handleDelete = (id: number) => {
  toast.confirm(
    'Silme Onayı',
    'Bu kaydı silmek istediğinizden emin misiniz?',
    async () => {
      // Evet - Silme işlemini yap
      try {
        const response = await fetch(`/api/items/${id}`, { method: 'DELETE' })
        if (response.ok) {
          toast.success('Başarılı', 'Kayıt silindi')
        } else {
          toast.error('Hata', 'Silme başarısız')
        }
      } catch (error) {
        toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
      }
    },
    () => {
      // Hayır - İptal edildi (opsiyonel)
      console.log('İptal edildi')
    }
  )
}
```

## Hata Ayıklama

### Toast Görünmüyor?
```tsx
// 1. Provider kontrolü (app/layout.tsx)
<ToastProvider>
  {children}
</ToastProvider>

// 2. Import kontrolü
import { useToastContext } from '@/components/ToastProvider'

// 3. 'use client' direktifi
'use client'
```

### Toast Çok Hızlı Kapanıyor?
```tsx
// Süreyi artır
toast.success('Başlık', 'Mesaj', 10000) // 10 saniye
```

## Kopyala-Yapıştır Şablonlar

### Temel Şablon
```tsx
'use client'

import { useToastContext } from '@/components/ToastProvider'

export default function MyComponent() {
  const toast = useToastContext()
  
  const handleAction = async () => {
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      if (response.ok) {
        toast.success('Başarılı', 'İşlem tamamlandı')
      } else {
        toast.error('Hata', 'İşlem başarısız')
      }
    } catch (error) {
      toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
    }
  }
  
  return (
    <button onClick={handleAction}>
      İşlemi Başlat
    </button>
  )
}
```

## Sonraki Adımlar

1. ✅ Bu şablonu kopyala
2. ✅ Kendi sayfana yapıştır
3. ✅ API endpoint'lerini güncelle
4. ✅ Mesajları özelleştir
5. ✅ Test et!

## Daha Fazla Bilgi

- Detaylı kullanım: `TOAST_USAGE.md`
- Entegrasyon özeti: `TOAST_INTEGRATION_SUMMARY.md`
- Örnek implementasyonlar: `app/panel/tickets/page.tsx`, `app/panel/users/page.tsx`
