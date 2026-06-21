import { SEO } from '@/components/SEO'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Leaf, Recycle, Trees, Droplets, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export const SustainabilityPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from('.sus-header', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' })
      
      gsap.from('.sus-card', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.sus-grid',
          start: 'top 80%',
        }
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="pb-32 overflow-hidden relative">
      <SEO title="Sustainability | Ecoji" description="Discover how our eco-friendly materials and sustainable practices are reducing plastic waste." />
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      
      <div className="container max-w-6xl mx-auto pt-32">
        <div className="sus-header max-w-3xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-widest uppercase">The Ecoji Promise</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-foreground">A cleaner <span className="text-primary italic">Earth.</span></h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
            Every product we make is a deliberate step towards reversing the plastic crisis. Here is how we build a greener tomorrow.
          </p>
        </div>

        <div className="sus-grid grid md:grid-cols-2 gap-8">
          <div className="sus-card group p-10 bg-background rounded-[2.5rem] border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <Trees className="w-40 h-40" />
            </div>
            <div className="h-16 w-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
              <Trees className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Regenerative Materials</h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              We use fast-growing, highly renewable resources like Moso bamboo, neem wood, and natural gourd. These require minimal water and zero pesticides.
            </p>
            <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform cursor-pointer">
              Learn about our farms <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>

          <div className="sus-card group p-10 bg-background rounded-[2.5rem] border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <Droplets className="w-40 h-40" />
            </div>
            <div className="h-16 w-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
              <Droplets className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Zero Microplastics</h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              By replacing daily essentials, you directly prevent microplastics from entering oceans. Our products biodegrade naturally without releasing toxins.
            </p>
            <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform cursor-pointer">
              View our lifecycle <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>

          <div className="sus-card group p-10 bg-background rounded-[2.5rem] border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <Recycle className="w-40 h-40" />
            </div>
            <div className="h-16 w-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
              <Recycle className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Plastic-Free Supply Chain</h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Our commitment doesn't stop at the product. We ensure that our entire logistics network, from packaging to shipping, is 100% plastic-free.
            </p>
            <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform cursor-pointer">
              Read our packaging policy <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>

          <div className="sus-card group p-10 bg-primary/5 rounded-[2.5rem] border border-primary/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <Leaf className="w-40 h-40" />
            </div>
            <div className="h-16 w-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
              <Leaf className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Ethical Sourcing</h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              We partner directly with local farmers and artisans. We pay fair wages and ensure our sourcing leaves the local ecosystem thriving and undisturbed.
            </p>
            <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform cursor-pointer">
              Meet our artisans <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
