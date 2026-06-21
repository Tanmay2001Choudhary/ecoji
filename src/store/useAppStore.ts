import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeName, FontName } from '@/types/theme'

interface AppState {
  theme: ThemeName
  font: FontName
  cursorStyle: 'default' | 'premium' | 'eco' | 'context'
  setTheme: (theme: ThemeName) => void
  setFont: (font: FontName) => void
  setCursorStyle: (style: 'default' | 'premium' | 'eco' | 'context') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'premium-eco',
      font: 'Poppins',
      cursorStyle: 'context',
      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
      setCursorStyle: (cursorStyle) => set({ cursorStyle }),
    }),
    {
      name: 'ecoji-storage',
    }
  )
)
