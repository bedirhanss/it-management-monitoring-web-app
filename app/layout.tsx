import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/lib/theme'
import { AuthProvider } from '@/lib/auth'
import DashboardLayout from '@/components/DashboardLayout'
import ToastProvider from '@/components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'IT Management System',
  description: 'IT Helpdesk and Monitoring Service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <DashboardLayout>
                {children}
              </DashboardLayout>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}