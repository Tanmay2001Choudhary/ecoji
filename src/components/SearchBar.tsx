import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { products } from '@/config/products'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const results = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  )

  const handleSelect = (slug: string) => {
    setIsOpen(false)
    setQuery('')
    setIsMobileOpen(false)
    navigate(`/products/${slug}`)
  }

  // Desktop Component
  const DesktopSearch = (
    <div ref={containerRef} className="relative hidden md:block w-64">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          className="w-full pl-9 bg-secondary/20 border-transparent focus:bg-background focus:border-primary transition-all rounded-full h-10"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      
      {isOpen && query.length > 0 && (
        <div className="absolute top-full mt-2 w-full max-w-sm right-0 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-[100]">
          {results.length > 0 ? (
            <div className="py-2 max-h-96 overflow-y-auto">
              {results.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product.slug)}
                  className="w-full text-left px-4 py-3 hover:bg-secondary/50 flex items-center gap-3 transition-colors"
                >
                  <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                  <div>
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.category}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-center text-muted-foreground">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  )

  // Mobile Component (Full Screen Overlay)
  const MobileSearch = (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => {
        setIsMobileOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }}>
        <Search className="h-5 w-5" />
      </Button>

      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center gap-2 p-4 border-b">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input 
              ref={inputRef}
              className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg px-0 shadow-none"
              placeholder="Search products, tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="ghost" size="icon" onClick={() => {
              setIsMobileOpen(false)
              setQuery('')
            }}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {query.length > 0 && results.length > 0 && (
              <div className="space-y-2">
                {results.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product.slug)}
                    className="w-full text-left p-3 rounded-xl hover:bg-secondary/50 flex items-center gap-4 transition-colors"
                  >
                    <img src={product.images[0]} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div>
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {query.length > 0 && results.length === 0 && (
              <div className="text-center mt-10 text-muted-foreground">
                No products found for "{query}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {DesktopSearch}
      {MobileSearch}
    </>
  )
}
