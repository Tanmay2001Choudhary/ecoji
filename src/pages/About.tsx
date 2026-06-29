import { SEO } from '@/components/SEO'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Heart, Globe, Zap } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Hero Animation
    gsap.from('.about-title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
    gsap.from('.about-subtitle', { y: 30, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })

    // Sections reveal
    gsap.utils.toArray('.reveal-section').forEach((section: any) => {
      gsap.fromTo(section,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="pb-24">
      <SEO title="About Us | Ecoji" description="Learn about our brand story, vision, and mission towards a sustainable future." />
      
      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col justify-center items-center text-center px-4 bg-secondary/10 border-b border-border/50">
        <h1 className="about-title text-6xl md:text-8xl font-bold mb-6 text-foreground tracking-tighter">Our <span className="text-primary italic">Story</span></h1>
        <p className="about-subtitle text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed">
          Proving that premium quality and absolute sustainability can, and must, exist together.
        </p>
      </section>

      <div className="container max-w-5xl mx-auto pt-24 space-y-32">
        {/* Brand Story */}
        <section className="reveal-section grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square bg-muted rounded-[3rem] overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" alt="Nature" className="object-cover w-full h-full hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight">Born from a simple realization</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everyday products were leaving a permanent scar on our planet. We set out to create a brand that proves sustainability and premium quality can go hand-in-hand. 
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We traveled, researched, and partnered with artisans to bring you everyday essentials that are biodegradable, ethically sourced, and beautifully designed.
            </p>
          </div>
        </section>

        {/* Mission & Vision Grid */}
        <section className="reveal-section grid md:grid-cols-2 gap-8">
          <div className="bg-secondary/20 p-12 rounded-[3rem] border border-border/50 hover:border-primary/50 transition-colors">
            <Globe className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Our Vision</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We envision a world where zero-waste living is not a compromise, but a standard. A world where every product in your home is crafted from nature and returns to nature seamlessly.
            </p>
          </div>
          <div className="bg-secondary/20 p-12 rounded-[3rem] border border-border/50 hover:border-primary/50 transition-colors">
            <Zap className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Our Mission</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To provide accessible, high-quality, and eco-friendly alternatives to everyday plastic products, empowering individuals to make conscious choices for massive collective impact.
            </p>
          </div>
        </section>

        {/* Goals & Philosophy */}
        <section className="reveal-section text-center max-w-3xl mx-auto space-y-16">
          <div>
            <Heart className="w-16 h-16 text-primary mx-auto mb-8" />
            <h2 className="text-4xl font-bold tracking-tight mb-6">Manufacturing Philosophy</h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              We believe in radical transparency. Our processes prioritize ethical labor, minimalistic processing, and maximum utilization of raw materials. We craft solutions with care and responsibility.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
