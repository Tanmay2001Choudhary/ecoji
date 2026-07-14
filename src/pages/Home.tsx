import { Hero } from '@/components/Hero'
import { ProductCard } from '@/components/ProductCard'
import { SEO } from '@/components/SEO'
import { buttonVariants } from '@/components/ui/button'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Heart, Leaf as LeafIcon, ShieldCheck } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

export const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await api.public.getProducts()
        const mappedData = data.map((p: any) => ({
          ...p,
          shortDescription: p.short_description,
          category: p.categories?.name,
          images: p.product_images?.map((img: any) => img.url) || []
        }))
        setProducts(mappedData.slice(0, 4)) // Take top 4 for featured
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useGSAP(() => {
    if (isLoading) return

    // Features Section
    gsap.utils.toArray('.feature-card').forEach((card: any) => {
      gsap.fromTo(card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          clearProps: 'all',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      )
    })

    // Products Section
    if (products.length > 0) {
      gsap.utils.toArray('.product-card-wrapper').forEach((card: any) => {
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: 'all',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        )
      })
    }
  }, { scope: containerRef, dependencies: [isLoading, products] })

  return (
    <div ref={containerRef}>
      <SEO />

      {/* Handcrafted Premium 2D Hero */}
      <Hero />

      {/* Features */}
      <section className="features-section py-16 md:py-32 bg-secondary/10 relative z-10 border-y border-border/50">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="feature-card space-y-6 flex flex-col items-center p-8 rounded-3xl hover:bg-background transition-colors duration-500">
              <div className="h-24 w-24 rounded-[2rem] bg-background shadow-xl flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110 hover:-rotate-6 pointer-events-auto">
                <LeafIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-semibold tracking-tight">Biodegradable</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">Every product is crafted from nature and returns to nature without leaving a trace.</p>
            </div>
            <div className="feature-card space-y-6 flex flex-col items-center p-8 rounded-3xl hover:bg-background transition-colors duration-500">
              <div className="h-24 w-24 rounded-[2rem] bg-background shadow-xl flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110 hover:rotate-6 pointer-events-auto">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-semibold tracking-tight">Export Quality</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">Premium craftsmanship that meets global standards for durability and performance.</p>
            </div>
            <div className="feature-card space-y-6 flex flex-col items-center p-8 rounded-3xl hover:bg-background transition-colors duration-500">
              <div className="h-24 w-24 rounded-[2rem] bg-background shadow-xl flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110 hover:-rotate-6 pointer-events-auto">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-semibold tracking-tight">Cruelty Free</h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">We love animals. None of our products or materials are ever tested on animals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section py-16 md:py-32 bg-background relative z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-5xl font-bold mb-6 tracking-tight">Featured Essentials</h2>
              <p className="text-2xl font-light text-muted-foreground">The perfect starting point for your zero-waste journey.</p>
            </div>
            <Link to="/products" className={cn(buttonVariants({ variant: "ghost" }), "hidden md:flex text-lg hover:bg-secondary/50 rounded-full px-6 py-6")}>
              View All Products <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {isLoading ? (
              <div className="col-span-full text-center py-10 text-muted-foreground">Loading featured products...</div>
            ) : (
              products.map(product => (
                <div key={product.id} className="product-card-wrapper">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
          <Link to="/products" className={cn(buttonVariants({ variant: "outline" }), "w-full mt-12 md:hidden text-center justify-center text-lg py-6 rounded-full")}>
            View All Products
          </Link>
        </div>
      </section>
    </div>
  )
}
