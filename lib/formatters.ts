export function formatDate(dateString: string | Date): string {
  if (!dateString) return ''
  
  const settings = localStorage.getItem('appearanceSettings')
  const format = settings ? JSON.parse(settings).dateFormat : 'dd/mm/yyyy'
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  switch (format) {
    case 'mm/dd/yyyy':
      return `${month}/${day}/${year}`
    case 'yyyy-mm-dd':
      return `${year}-${month}-${day}`
    case 'dd/mm/yyyy':
    default:
      return `${day}/${month}/${year}`
  }
}

export function formatTime(timeString: string): string {
  if (!timeString) return ''
  
  const settings = localStorage.getItem('appearanceSettings')
  const format = settings ? JSON.parse(settings).timeFormat : '24'
  
  if (format === '12') {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }
  
  return timeString
}

export function formatDateTime(dateString: string | Date): string {
  if (!dateString) return ''
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const datePart = formatDate(date)
  const timePart = formatTime(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`)
  
  return `${datePart} ${timePart}`
}
