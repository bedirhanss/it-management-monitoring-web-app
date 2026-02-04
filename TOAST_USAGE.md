# Toast Notification Kullanım Kılavuzu

## Genel Bakış

Projede dinamik toast notification sistemi kullanıma hazır hale getirilmiştir. Bu sistem, kullanıcıya başarı, hata, uyarı ve bilgi mesajları göstermek için kullanılır.

## Kurulum

Toast sistemi zaten projeye entegre edilmiştir:
- `components/Toast.tsx` - Toast bileşeni
- `components/ToastProvider.tsx` - Toast context provider
- `lib/useToast.ts` - Toast hook'u

## Kullanım

### 1. Toast Context'i Import Edin

```tsx
import { useToastContext } from '@/components/ToastProvider'
```

### 2. Component İçinde Kullanın

```tsx
export default function MyComponent() {
  const toast = useToastContext()
  
  // Kullanım örnekleri
  const handleSuccess = () => {
    toast.success('Başarılı', 'İşlem başarıyla tamamlandı')
  }
  
  const handleError = () => {
    toast.error('Hata', 'Bir hata oluştu')
  }
  
  const handleWarning = () => {
    toast.warning('Uyarı', 'Dikkat edilmesi gereken bir durum')
  }
  
  const handleInfo = () => {
    toast.info('Bilgi', 'Bilgilendirme mesajı')
  }
  
  return (
    // Component JSX
  )
}
```

## Toast Tipleri

### 1. Success (Başarı)
```tsx
toast.success('Başlık', 'Mesaj', 5000) // 5000ms = 5 saniye (opsiyonel)
```
- **Renk**: Yeşil
- **İkon**: CheckCircle
- **Kullanım**: Başarılı işlemler (kaydetme, güncelleme, silme)

### 2. Error (Hata)
```tsx
toast.error('Başlık', 'Mesaj', 5000)
```
- **Renk**: Kırmızı
- **İkon**: XCircle
- **Kullanım**: Hata durumları, başarısız işlemler

### 3. Warning (Uyarı)
```tsx
toast.warning('Başlık', 'Mesaj', 5000)
```
- **Renk**: Sarı
- **İkon**: ExclamationTriangle
- **Kullanım**: Uyarı mesajları, dikkat gerektiren durumlar

### 4. Info (Bilgi)
```tsx
toast.info('Başlık', 'Mesaj', 5000)
```
- **Renk**: Mavi
- **İkon**: InformationCircle
- **Kullanım**: Bilgilendirme mesajları

### 5. Confirm (Onay) ⭐ YENİ
```tsx
toast.confirm(
  'Başlık',
  'Mesaj',
  () => {
    // Evet butonuna basıldığında çalışacak kod
    console.log('Onaylandı')
  },
  () => {
    // Hayır butonuna basıldığında çalışacak kod (opsiyonel)
    // NOT: X butonuna basıldığında da bu callback çalışır
    console.log('İptal edildi')
  }
)
```
- **Renk**: Sarı
- **İkon**: ExclamationTriangle
- **Kullanım**: Silme işlemleri, geri alınamaz işlemler
- **Özellik**: Otomatik kapanmaz, kullanıcı Evet veya Hayır butonuna basana kadar ekranda kalır
- **Kapatma**: Evet, Hayır veya X (sağ üst) butonları ile kapatılabilir
- **NOT**: X butonu ve Hayır butonu aynı işlevi görür (onCancel callback'ini çağırır)

## Parametreler

| Parametre | Tip | Zorunlu | Varsayılan | Açıklama |
|-----------|-----|---------|------------|----------|
| title | string | Evet | - | Toast başlığı |
| message | string | Hayır | - | Toast mesajı (detay) |
| duration | number | Hayır | 5000 | Toast görünme süresi (ms) |

## Gerçek Kullanım Örnekleri

### API İşlemleri

```tsx
const handleCreateTicket = async () => {
  try {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (response.ok) {
      toast.success('Başarılı', 'Ticket başarıyla oluşturuldu')
      // Diğer işlemler...
    } else {
      toast.error('Hata', 'Ticket oluşturulurken bir hata oluştu')
    }
  } catch (error) {
    toast.error('Bağlantı Hatası', 'Sunucuya bağlanılamadı')
  }
}
```

### Form Validasyonu

```tsx
const handleSubmit = () => {
  if (!formData.email) {
    toast.warning('Eksik Bilgi', 'Email adresi zorunludur')
    return
  }
  
  if (!isValidEmail(formData.email)) {
    toast.error('Geçersiz Email', 'Lütfen geçerli bir email adresi girin')
    return
  }
  
  // Form gönderimi...
  toast.success('Başarılı', 'Form başarıyla gönderildi')
}
```

### Bilgilendirme Mesajları

```tsx
const handleFileUpload = () => {
  toast.info('Yükleniyor', 'Dosya yükleme işlemi başlatıldı', 3000)
  
  // Upload işlemi...
  
  toast.success('Tamamlandı', 'Dosya başarıyla yüklendi')
}
```

## Özelleştirme

### Süre Ayarlama

```tsx
// Kısa süre (3 saniye)
toast.success('Başarılı', 'İşlem tamamlandı', 3000)

// Uzun süre (10 saniye)
toast.error('Kritik Hata', 'Detaylı hata mesajı', 10000)

// Varsayılan süre (5 saniye)
toast.info('Bilgi', 'Standart bilgilendirme')
```

### Sadece Başlık

```tsx
toast.success('Kaydedildi')
toast.error('Hata oluştu')
```

### Başlık ve Mesaj

```tsx
toast.success('Başarılı', 'Kullanıcı başarıyla oluşturuldu')
toast.error('Hata', 'Veritabanı bağlantısı kurulamadı')
```

## Dark Mode Desteği

Toast bileşenleri otomatik olarak dark mode'u destekler. Tailwind CSS dark: sınıfları kullanılarak tema değişikliklerine uyum sağlar.

## Animasyonlar

- **Giriş**: Sağdan sola kayarak girer (slide-in)
- **Çıkış**: Sağa doğru kayarak çıkar (slide-out)
- **Süre**: 300ms transition

## Pozisyon

Toast'lar ekranın sağ alt köşesinde görünür:
- **Konum**: `bottom-4 right-4`
- **Z-index**: `50`
- **Yığılma**: Dikey olarak üst üste

## Best Practices

1. **Kısa ve Öz Mesajlar**: Kullanıcı deneyimi için mesajları kısa tutun
2. **Doğru Tip Seçimi**: İşlem türüne uygun toast tipi kullanın
3. **Süre Ayarı**: Mesaj uzunluğuna göre süreyi ayarlayın
4. **Çoklu Toast**: Aynı anda çok fazla toast göstermekten kaçının
5. **Hata Detayları**: Hata mesajlarında kullanıcıya yardımcı olacak bilgiler verin

## Örnek Senaryolar

### Başarılı CRUD İşlemleri
```tsx
// Create
toast.success('Oluşturuldu', 'Yeni kayıt başarıyla eklendi')

// Update
toast.success('Güncellendi', 'Değişiklikler kaydedildi')

// Delete
toast.success('Silindi', 'Kayıt başarıyla silindi')
```

### Hata Yönetimi
```tsx
// Validation hatası
toast.error('Geçersiz Veri', 'Lütfen tüm alanları doldurun')

// Network hatası
toast.error('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edin')

// Server hatası
toast.error('Sunucu Hatası', 'Lütfen daha sonra tekrar deneyin')
```

### Kullanıcı Bilgilendirme
```tsx
// İşlem başlatma
toast.info('İşlem Başladı', 'Veriler işleniyor...')

// Uyarı
toast.warning('Dikkat', 'Bu işlem geri alınamaz')

// Bilgilendirme
toast.info('Güncelleme', 'Yeni özellikler eklendi')
```

### Silme Onayı ⭐ YENİ
```tsx
const handleDelete = (id: number) => {
  toast.confirm(
    'Silme Onayı',
    'Bu kaydı silmek istediğinizden emin misiniz?',
    async () => {
      // Evet butonuna basıldığında
      try {
        const response = await fetch(`/api/items/${id}`, { method: 'DELETE' })
        if (response.ok) {
          toast.success('Başarılı', 'Kayıt silindi')
        }
      } catch (error) {
        toast.error('Hata', 'Silme işlemi başarısız')
      }
    },
    () => {
      // Hayır butonuna basıldığında (opsiyonel)
      toast.info('Bilgi', 'Silme işlemi iptal edildi')
    }
  )
}
```

## Entegre Edilmiş Sayfalar

Aşağıdaki sayfalarda toast sistemi aktif olarak kullanılmaktadır:

- ✅ `/panel/tickets` - Ticket yönetimi
- ✅ `/panel/users` - Kullanıcı yönetimi

Diğer sayfalara da aynı şekilde entegre edilebilir.

## Sorun Giderme

### Toast Görünmüyor
1. ToastProvider'ın root layout'ta olduğundan emin olun
2. useToastContext hook'unun doğru import edildiğini kontrol edin
3. Component'in 'use client' direktifi ile işaretlendiğinden emin olun

### Toast Çok Hızlı Kapanıyor
Duration parametresini artırın:
```tsx
toast.success('Başlık', 'Mesaj', 10000) // 10 saniye
```

### Çoklu Toast Sorunu
Toast'lar otomatik olarak yığılır, ancak çok fazla toast göstermekten kaçının.
