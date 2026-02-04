# Yükleme Animasyonu Sistemi

## Yapılan Değişiklikler

### 1. Skeleton Loader Bileşenleri (`components/Skeleton.tsx`)
Tüm sayfalarda tutarlı kullanım için yeniden kullanılabilir skeleton loader bileşenleri oluşturuldu:

- **SkeletonCard**: Kart/istatistik kutuları için
- **SkeletonTable**: Tablo verileri için
- **SkeletonStats**: İstatistik kartları grid'i için
- **SkeletonActivity**: Aktivite listesi için

### 2. Shimmer Animasyonu (`app/globals.css`)
Gri arka plan üzerinde yanıp sönen, ışıldayan efekt için özel CSS animasyonu eklendi:

```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(to right, #f3f4f6 0%, #e5e7eb 20%, #f3f4f6 40%, #f3f4f6 100%);
  background-size: 1000px 100%;
}
```

Dark mode için ayrı gradient tanımlandı.

### 3. Modal Animasyonları
Modal açılış/kapanış için smooth animasyonlar eklendi:

- **modalFadeIn**: Backdrop için fade-in efekti
- **modalSlideIn**: Modal içeriği için slide-in ve scale efekti

### 4. Güncellenen Sayfalar

#### Dashboard (`app/panel/dashboard/page.tsx`)
- Loading state eklendi
- SkeletonStats ve SkeletonActivity kullanıldı
- İstatistik kartları ve aktivite listesi için skeleton gösterimi

#### Tickets (`app/panel/tickets/page.tsx`)
- Basit "Yükleniyor..." metni yerine SkeletonTable kullanıldı
- 8 kolonlu tablo skeleton'ı

#### Monitoring (`app/panel/monitoring/page.tsx`)
- SkeletonTable ile 8 kolonlu tablo skeleton'ı

#### Users (`app/panel/users/page.tsx`)
- Loading state'de SubHeader ile birlikte SkeletonTable gösterimi
- 5 kolonlu tablo skeleton'ı

#### Inventory (`app/panel/inventory/page.tsx`)
- Loading state'de SubHeader ile birlikte SkeletonTable gösterimi
- 8 kolonlu tablo skeleton'ı

#### Projects (`app/panel/projects/page.tsx`)
- Loading state'de SubHeader ile birlikte SkeletonTable gösterimi
- 7 kolonlu tablo skeleton'ı

#### Logs (`app/panel/logs/page.tsx`)
- SkeletonStats (4 istatistik kartı) ve SkeletonTable kullanıldı
- 7 kolonlu tablo skeleton'ı

### 5. Modal Bileşeni (`components/Modal.tsx`)
- Backdrop için `modal-backdrop` class'ı eklendi
- Modal içeriği için `modal-content` class'ı eklendi
- CSS animasyonları otomatik olarak uygulanıyor

## Kullanım

### Skeleton Loader Kullanımı

```tsx
import { SkeletonTable, SkeletonStats, SkeletonCard, SkeletonActivity } from '@/components/Skeleton'

// Tablo için
{loading ? <SkeletonTable rows={5} columns={8} /> : <ActualTable />}

// İstatistikler için
{loading ? <SkeletonStats count={4} /> : <ActualStats />}

// Aktivite listesi için
{loading ? <SkeletonActivity count={4} /> : <ActualActivity />}
```

### Özelleştirme

Skeleton bileşenleri props ile özelleştirilebilir:
- `rows`: Tablo satır sayısı (varsayılan: 5)
- `columns`: Tablo kolon sayısı (varsayılan: 6)
- `count`: Kart/aktivite sayısı (varsayılan: 4)

## Avantajlar

1. **Tutarlılık**: Tüm sayfalarda aynı yükleme deneyimi
2. **Profesyonel Görünüm**: Modern shimmer efekti
3. **Kullanıcı Deneyimi**: İçeriğin ne zaman yükleneceği hakkında görsel ipucu
4. **Dark Mode Desteği**: Hem light hem dark tema için optimize edilmiş
5. **Performans**: CSS animasyonları GPU hızlandırmalı
6. **Yeniden Kullanılabilirlik**: Tek bir bileşen, birçok kullanım alanı

## Teknik Detaylar

- Animasyon süresi: 2 saniye (sonsuz döngü)
- Gradient genişliği: 1000px
- Modal animasyon süresi: 0.2-0.3 saniye
- Tüm animasyonlar `ease-out` timing function kullanıyor
