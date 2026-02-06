'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setThemeMode: (mode: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('auto')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Önce appearance settings'den kontrol et
    const appearanceSettings = localStorage.getItem('appearanceSettings')
    if (appearanceSettings) {
      const settings = JSON.parse(appearanceSettings)
      setTheme(settings.theme || 'auto')
    } else {
      // Yoksa eski theme ayarını kontrol et
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme) {
        setTheme(savedTheme)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    let actualTheme: 'light' | 'dark' = 'light'
    
    if (theme === 'auto') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      actualTheme = theme as 'light' | 'dark'
    }
    
    if (actualTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    updateAppearanceSettings(newTheme)
  }

  const setThemeMode = (mode: Theme) => {
    setTheme(mode)
    updateAppearanceSettings(mode)
  }

  const updateAppearanceSettings = (newTheme: Theme) => {
    const saved = localStorage.getItem('appearanceSettings')
    if (saved) {
      const settings = JSON.parse(saved)
      settings.theme = newTheme
      localStorage.setItem('appearanceSettings', JSON.stringify(settings))
    }
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}