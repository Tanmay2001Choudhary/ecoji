import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, font } = useAppStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('theme-premium-eco', 'theme-modern-eco', 'theme-bamboo', 'theme-luxury-eco')
    root.classList.add(`theme-${theme}`)
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    root.style.setProperty('--font-sans', `'${font}', sans-serif`)
    
    // Check if the font stylesheet already exists
    const fontId = `font-${font.replace(/ /g, '-')}`
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link')
      link.id = fontId
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
  }, [font])

  return <>{children}</>
}
