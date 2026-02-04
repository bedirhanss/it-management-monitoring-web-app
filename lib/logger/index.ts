import pool from '@/lib/db'

export async function createLog(
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR',
  source: string,
  message: string,
  ipAddress?: string,
  details?: string,
  serverId?: number
) {
  try {
    const client = await pool.connect()
    await client.query(
      'INSERT INTO system_logs (log_level, source, message, ip_address, details, server_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [level, source, message, ipAddress, details, serverId]
    )
    client.release()
  } catch (error) {
    console.error('Log creation error:', error)
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIp || 'unknown'
}
