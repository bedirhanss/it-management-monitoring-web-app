# IT Management System

IT Helpdesk ve Monitoring servisi için Next.js tabanlı web uygulaması.

## Özellikler

- **Landing Page**: Ana sayfa tanıtım sayfası
- **Dashboard**: Sistem durumu ve istatistikler
- **Ticket System**: Destek talepleri yönetimi
- **Monitoring**: Sunucu izleme ve performans takibi
- **User Management**: Kullanıcı yönetimi
- **Toast Notifications**: Dinamik bildirim sistemi

## Teknolojiler

- Next.js 14
- TypeScript
- Tailwind CSS
- PostgreSQL
- Heroicons

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Çevre değişkenlerini ayarlayın:
```bash
cp .env.example .env.local
```

3. PostgreSQL veritabanını oluşturun ve şemayı yükleyin:
```bash
psql -U username -d it_management -f database/schema.sql
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Proje Yapısı

```
├── app/                 # Next.js App Router
│   ├── login/           # Giriş sayfası
│   ├── dashboard/       # Dashboard sayfası
│   ├── tickets/         # Ticket yönetimi
│   ├── monitoring/      # Sistem izleme
│   ├── users/          # Kullanıcı yönetimi
│   └── api/            # API routes
├── components/         # Yeniden kullanılabilir bileşenler
│   ├── Toast.tsx       # Toast notification bileşeni
│   └── ToastProvider.tsx # Toast context provider
├── lib/               # Yardımcı fonksiyonlar
│   └── useToast.ts    # Toast hook
├── database/          # Veritabanı şeması
└── public/           # Statik dosyalar
```

## Geliştirme Notları

Bu proje portfolyo ve iş başvurusu amacıyla geliştirilmiştir. Temel IT helpdesk ve monitoring işlevlerini içerir.

### Son Güncellemeler
- Veritabanı entegrasyonu tamamlandı
- Auth sistemi PostgreSQL ile çalışıyor
- Panel yapısı (/panel/*) oluşturuldu
- Production-ready hale getirildi
- Dinamik toast notification sistemi eklendi

### Toast Notification Kullanımı

Detaylı kullanım kılavuzu için [TOAST_USAGE.md](./TOAST_USAGE.md) dosyasına bakın.

Hızlı kullanım:
```tsx
import { useToastContext } from '@/components/ToastProvider'

const toast = useToastContext()

// Başarı mesajı
toast.success('Başarılı', 'İşlem tamamlandı')

// Hata mesajı
toast.error('Hata', 'Bir sorun oluştu')

// Uyarı mesajı
toast.warning('Uyarı', 'Dikkat edilmesi gereken durum')

// Bilgi mesajı
toast.info('Bilgi', 'Bilgilendirme mesajı')

// Onay mesajı (silme işlemleri için)
toast.confirm('Emin misiniz?', 'Bu işlem geri alınamaz', () => {
  // Evet butonuna basıldığında çalışacak kod
})
```