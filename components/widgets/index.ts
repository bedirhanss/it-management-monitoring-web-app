import SystemOverview from './SystemOverview'
import PendingTickets from './PendingTickets'
import ServerStatus from './ServerStatus'
import RecentActivity from './RecentActivity'
import QuickAccess from './QuickAccess'
import ProjectStatus from './ProjectStatus'
import InventorySummary from './InventorySummary'
import UpcomingEvents from './UpcomingEvents'
import PerformanceChart from './PerformanceChart'

export interface WidgetConfig {
  id: string
  title: string
  description: string
  component: React.ComponentType
  isDefault: boolean
  gridSize: 'small' | 'medium' | 'large' // small: 1 col, medium: 1 col, large: 2 col
}

export const widgetRegistry: WidgetConfig[] = [
  {
    id: 'system-overview',
    title: 'Sistem Özeti',
    description: 'Aktif sunucu, ticket, kullanıcı ve uptime istatistikleri',
    component: SystemOverview,
    isDefault: true,
    gridSize: 'large',
  },
  {
    id: 'pending-tickets',
    title: 'Bekleyen Ticketlar',
    description: 'Yüksek öncelikli açık destek talepleri',
    component: PendingTickets,
    isDefault: true,
    gridSize: 'medium',
  },
  {
    id: 'server-status',
    title: 'Sunucu Durumu',
    description: 'Kritik sunucu kaynak kullanımı ve durum bilgisi',
    component: ServerStatus,
    isDefault: true,
    gridSize: 'medium',
  },
  {
    id: 'recent-activity',
    title: 'Son Aktiviteler',
    description: 'Sistemdeki son işlemler ve log kayıtları',
    component: RecentActivity,
    isDefault: false,
    gridSize: 'medium',
  },
  {
    id: 'quick-access',
    title: 'Hızlı Erişim',
    description: 'Sık kullanılan sayfalara hızlı erişim kısayolları',
    component: QuickAccess,
    isDefault: false,
    gridSize: 'large',
  },
  {
    id: 'project-status',
    title: 'Proje Durumu',
    description: 'Aktif projelerin ilerleme durumu ve detayları',
    component: ProjectStatus,
    isDefault: false,
    gridSize: 'medium',
  },
  {
    id: 'inventory-summary',
    title: 'Envanter Özeti',
    description: 'Cihaz sayıları, kategori dağılımı ve garanti uyarıları',
    component: InventorySummary,
    isDefault: false,
    gridSize: 'medium',
  },
  {
    id: 'upcoming-events',
    title: 'Yakında Etkinlikler',
    description: 'Bugün ve gelecek günlerdeki takvim etkinlikleri',
    component: UpcomingEvents,
    isDefault: false,
    gridSize: 'medium',
  },
  {
    id: 'performance-chart',
    title: 'Sistem Performans Grafiği',
    description: 'Son 7 günün CPU, RAM ve Disk kullanım trendi',
    component: PerformanceChart,
    isDefault: false,
    gridSize: 'large',
  },
]
