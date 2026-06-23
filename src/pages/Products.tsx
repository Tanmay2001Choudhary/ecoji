import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { SEO } from '@/components/SEO'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

export const ProductsPage = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await api.public.getProducts()
        
        // Map data to expected format for ProductCard (temporary compatibility layer)
        const mappedData = data.map((p: any) => ({
          ...p,
          shortDescription: p.short_description,
          category: p.categories?.name,
          images: p.product_images?.map((img: any) => img.url) || []
        }))
        setProducts(mappedData)

        const uniqueCats = Array.from(new Set(mappedData.map((p: any) => p.category).filter(Boolean))) as string[]
        setCategories(['All', ...uniqueCats])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.shortDescription?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || p.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <SEO 
        title="Our Eco-Friendly Products" 
        description="Browse our collection of sustainable, biodegradable, and premium eco-friendly products." 
      />
      <div className="container py-32 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">Shop <span className="text-primary italic">Sustainable.</span></h1>
          <p className="text-xl text-muted-foreground font-light">Every product is a step towards a zero-waste lifestyle.</p>
        </div>
        
        {/* Search & Filters */}
        <div className="flex flex-col items-center gap-10 mb-20">
          <div className="relative w-full max-w-xl group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text"
              placeholder="Search products, materials, or benefits..." 
              className="w-full h-16 pl-16 pr-8 rounded-full bg-secondary/10 border-2 border-transparent focus:border-primary/30 focus:bg-background shadow-sm text-lg outline-none transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300 border border-border/50",
                  category === c 
                    ? "bg-foreground text-background shadow-lg scale-105" 
                    : "bg-background text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-secondary/5 rounded-[3rem] border border-border/50">
            <h3 className="text-3xl font-bold mb-4">No products found</h3>
            <p className="text-muted-foreground text-lg">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => { setSearch(''); setCategory('All') }}
              className="mt-8 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </>
  )
}
