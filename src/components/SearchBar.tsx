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

  // Desktop Component - Option 1: Apple / Modern Glass Shimmer
  const DesktopSearch = (
    <div ref={containerRef} className="relative hidden md:block w-56 lg:w-64 focus-within:w-72 lg:focus-within:w-80 transition-all duration-300 ease-out">
      <div className="relative group rounded-full transition-all duration-300 hover:shadow-[0_2px_14px_rgba(34,197,94,0.12)] focus-within:shadow-[0_4px_20px_rgba(34,197,94,0.2)]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-focus-within:text-primary group-focus-within:scale-105" />
        <Input 
          className="w-full pl-10 pr-4 bg-secondary/30 hover:bg-secondary/40 backdrop-blur-md border border-border/40 hover:border-primary/20 focus:bg-background focus:border-primary/40 transition-all duration-300 rounded-full h-10 text-sm"
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
        <div className="absolute top-full mt-2 w-full max-w-sm right-0 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
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
                  className="w-full text-left px-4 py-3 hover:bg-primary/10 flex items-center gap-3 transition-all duration-150 active:scale-98 group/item"
                >
                  <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover transition-transform duration-200 group-hover/item:scale-105" />
                  <div>
                    <div className="font-medium text-sm group-hover/item:text-primary transition-colors">{product.name}</div>
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
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full transition-all duration-200 hover:bg-primary/10 hover:text-primary active:scale-90"
        onClick={() => {
          setIsMobileOpen(true)
          setTimeout(() => inputRef.current?.focus(), 100)
        }}
      >
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
