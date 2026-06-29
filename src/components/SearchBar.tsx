import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Debounced search
  useEffect(() => {
    const fetchProducts = async () => {
      if (!query.trim()) {
        setProducts([])
        return
      }
      try {
        setIsLoading(true)
        const data = await api.public.searchProducts(query)
        const mappedData = data.map((p: any) => ({
          ...p,
          category: p.categories?.name,
          images: p.product_images?.map((img: any) => img.url) || []
        }))
        setProducts(mappedData)
      } catch (err) {
        console.error('Failed to load products for search', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    const timeoutId = setTimeout(() => {
      fetchProducts()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const results = products

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
          {isLoading ? (
            <div className="p-4 text-center flex justify-center">
              <Loader2 className="animate-spin text-primary h-5 w-5" />
            </div>
          ) : results.length > 0 ? (
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

      {isMobileOpen && createPortal(
        <div className="fixed inset-0 z-[1000] bg-background/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
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
            {isLoading && query.length > 0 && (
               <div className="flex justify-center mt-10">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
               </div>
            )}
            {!isLoading && query.length > 0 && results.length > 0 && (
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
            {!isLoading && query.length > 0 && results.length === 0 && (
              <div className="text-center mt-10 text-muted-foreground">
                No products found for "{query}"
              </div>
            )}
          </div>
        </div>,
        document.body
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
