import { Hero3D } from '@/components/Hero3D'
import { ProductCard } from '@/components/ProductCard'
import { SEO } from '@/components/SEO'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { products } from '@/config/products'
import { cn } from '@/lib/utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Heart, Leaf as LeafIcon, ShieldCheck } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

export const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Hero Animations
    const tl = gsap.timeline()
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 })
      .from('.hero-title span', { y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: "power4.out" }, "-=0.6")
      .from('.hero-subtitle', { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
      .from('.hero-buttons', { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")

    // Features Section
    gsap.from('.feature-card', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%'
      }
    })

    // Products Section
    gsap.from('.product-card-wrapper', {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.products-section',
        start: 'top 75%'
      }
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <SEO />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-24 pb-12 bg-background">
        {/* 3D Background layer limited to Hero */}
        <Hero3D />
        
        {/* Radial Gradient to ensure text legibility while keeping 3D visible */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-background/40 via-background/10 to-transparent z-0 pointer-events-none" />

        <div className="container relative z-10 text-center flex flex-col items-center justify-center pointer-events-none">
          <Badge variant="outline" className="hero-badge mb-10 px-6 py-2.5 border-primary/30 bg-background/50 backdrop-blur-md text-primary text-sm font-semibold tracking-widest uppercase shadow-sm">
            Sustainable Living
          </Badge>
          <h1 className="hero-title text-7xl md:text-[8rem] lg:text-[11rem] font-bold tracking-tighter mb-8 max-w-[100vw] mx-auto text-foreground leading-[0.85] overflow-hidden">
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 pb-2">Nature's</span>
            <span className="block text-primary pb-4">Masterpiece.</span>
          </h1>
          <p className="hero-subtitle text-2xl md:text-4xl text-muted-foreground font-light max-w-4xl mx-auto mb-16 leading-tight">
            Discover our premium, export-quality eco-friendly products crafted for a greener tomorrow.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl pointer-events-auto">
            <Link to="/products" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto text-2xl px-12 py-8 rounded-full shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all duration-500 h-auto bg-foreground text-background dark:bg-primary dark:text-primary-foreground")}>
              Discover Products <ArrowRight className="ml-4 h-8 w-8" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section py-16 md:py-32 bg-secondary/10 relative z-10 border-y border-border/50">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="feature-card space-y-6 flex flex-col items-center p-8 rounded-3xl hover:bg-background transition-colors duration-500">
              <div className="h-24 w-24 rounded-[2rem] bg-background shadow-xl flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-110 hover:-rotate-6 pointer-events-auto">
                <LeafIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-semibold tracking-tight">biodegradable</h3>
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
            {products.slice(0, 4).map(product => (
              <div key={product.id} className="product-card-wrapper">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <Link to="/products" className={cn(buttonVariants({ variant: "outline" }), "w-full mt-12 md:hidden text-center justify-center text-lg py-6 rounded-full")}>
            View All Products
          </Link>
        </div>
      </section>
    </div>
  )
}
