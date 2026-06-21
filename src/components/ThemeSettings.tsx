import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Settings, X, Palette, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const ThemeSettings = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, font, cursorStyle, setTheme, setFont, setCursorStyle } = useAppStore()

  const themes = ['premium-eco', 'modern-eco', 'bamboo', 'luxury-eco'] as const
  const fonts = ['Poppins', 'Inter', 'Montserrat', 'Nunito', 'Lora', 'Playfair Display'] as const
  const cursors = ['context', 'premium', 'eco', 'default'] as const

  const formatName = (name: string) => {
    return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50 transition-all duration-300", isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100")}>
        <Button size="icon" className="h-14 w-14 rounded-full shadow-2xl" onClick={() => setIsOpen(true)}>
          <Settings className="h-6 w-6" />
        </Button>
      </div>

      <div className={cn("fixed bottom-6 right-6 z-50 w-80 bg-background/80 backdrop-blur-xl border rounded-2xl shadow-2xl p-6 transition-all duration-500 transform origin-bottom-right", isOpen ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none")}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg flex items-center gap-2"><Palette className="w-5 h-5 text-primary" /> Appearance</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-3 h-3" /> Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border text-left transition-all",
                    theme === t ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
                  )}
                >
                  {formatName(t)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Type className="w-3 h-3" /> Typography
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fonts.map(f => (
                <button
                  key={f}
                  onClick={() => setFont(f)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border text-left transition-all",
                    font === f ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
                  )}
                >
                  {formatName(f)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-current" /> Cursor
            </label>
            <div className="grid grid-cols-2 gap-2">
              {cursors.map(c => (
                <button
                  key={c}
                  onClick={() => setCursorStyle(c)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border text-left transition-all",
                    cursorStyle === c ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
                  )}
                >
                  {formatName(c)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
