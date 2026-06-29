import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ArrowRight, Leaf, ShieldCheck, Heart, Sparkles, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Entrance Timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.hero-badge', { y: 25, opacity: 0, duration: 0.8 })
      .from('.hero-title-line', { y: 45, opacity: 0, duration: 1, stagger: 0.15 }, '-=0.5')
      .from('.hero-subtitle', { y: 25, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
      .from('.floating-card', { scale: 0.8, opacity: 0, duration: 1, stagger: 0.2, ease: 'back.out(1.5)' }, '-=0.6')
      .from('.hero-scroll-indicator', { opacity: 0, y: -15, duration: 0.8 }, '-=0.4')

    // Floating background organic glow animation
    gsap.to('.hero-glow-1', {
      x: 30,
      y: -20,
      scale: 1.1,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    gsap.to('.hero-glow-2', {
      x: -25,
      y: 25,
      scale: 0.95,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // Continuous floating bounce for floating statistic cards
    gsap.to(card1Ref.current, {
      y: -12,
      rotation: 1,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    gsap.to(card2Ref.current, {
      y: 14,
      rotation: -1.5,
      duration: 4.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5
    })

    gsap.to(card3Ref.current, {
      y: -10,
      rotation: 1.5,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1
    })

    // Scroll Down Indicator Pulse
    gsap.to('.scroll-arrow', {
      y: 6,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    // Mouse Parallax Micro-Interaction
    const xMove1 = gsap.quickTo(card1Ref.current, 'x', { duration: 0.6, ease: 'power3' })
    const yMove1 = gsap.quickTo(card1Ref.current, 'y', { duration: 0.6, ease: 'power3' })
    const xMove2 = gsap.quickTo(card2Ref.current, 'x', { duration: 0.6, ease: 'power3' })
    const yMove2 = gsap.quickTo(card2Ref.current, 'y', { duration: 0.6, ease: 'power3' })

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 30
      const y = (e.clientY / innerHeight - 0.5) * 30

      xMove1(x * -1.2)
      yMove1(y * -1.2)
      xMove2(x * 1.5)
      yMove2(y * 1.5)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, { scope: heroRef })

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16 bg-background border-b border-border/40"
    >
      {/* Subtle Background Gradients & Organic Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none hero-glow-1 -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-emerald-500/5 dark:bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none hero-glow-2 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] pointer-events-none -z-10" />

      {/* Floating Glassmorphic Stats Cards (Desktop / Tablet) */}
      <div 
        ref={card1Ref} 
        className="floating-card hidden lg:flex absolute top-36 left-[8%] bg-background/80 dark:bg-background/60 backdrop-blur-md border border-border/60 p-4 rounded-2xl shadow-xl shadow-primary/5 items-center gap-4 z-20 hover:border-primary/50 transition-colors cursor-default"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Global Standard</p>
          <p className="text-sm font-bold text-foreground">Export Quality Certified</p>
        </div>
      </div>

      <div 
        ref={card2Ref} 
        className="floating-card hidden lg:flex absolute bottom-28 right-[8%] bg-background/80 dark:bg-background/60 backdrop-blur-md border border-border/60 p-4 rounded-2xl shadow-xl shadow-primary/5 items-center gap-4 z-20 hover:border-primary/50 transition-colors cursor-default"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Leaf className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Impact Driven</p>
          <p className="text-sm font-bold text-foreground">50k+ Tons Plastic Prevented</p>
        </div>
      </div>

      <div 
        ref={card3Ref} 
        className="floating-card hidden xl:flex absolute top-44 right-[12%] bg-background/80 dark:bg-background/60 backdrop-blur-md border border-border/60 px-4 py-3 rounded-2xl shadow-lg items-center gap-3 z-20 hover:border-primary/50 transition-colors cursor-default"
      >
        <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
        <span className="text-xs font-semibold text-foreground">100% Cruelty-Free & Ethical</span>
      </div>

      {/* Main Content Container */}
      <div className="container relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center justify-center">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md text-primary mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs md:text-sm font-semibold tracking-widest uppercase">100% Biodegradable & Plastic-Free</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-foreground leading-[0.95] mb-8 max-w-4xl mx-auto">
          <span className="hero-title-line block">Nature's Purest</span>
          <span className="hero-title-line block bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-600 to-teal-500 italic font-serif mt-1 pb-2">
            Masterpiece.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-lg sm:text-2xl text-muted-foreground font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Discover export-quality, zero-waste essentials crafted from organic bamboo, neem wood, and natural gourd. Uncompromising durability meets everyday sustainability.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto">
          <Link 
            to="/products" 
            className={cn(
              buttonVariants({ size: 'lg' }), 
              "hero-cta w-full sm:w-auto text-lg px-8 py-7 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 font-semibold group bg-primary text-primary-foreground"
            )}
          >
            Explore Collection
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/sustainability" 
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }), 
              "hero-cta w-full sm:w-auto text-lg px-8 py-7 rounded-full border-border/80 hover:border-primary/60 hover:bg-secondary/40 transition-all duration-300 font-medium"
            )}
          >
            Our Eco Promise
          </Link>
        </div>

        {/* Mobile / Tablet Inline Highlights */}
        <div className="grid grid-cols-2 gap-4 mt-16 w-full max-w-sm lg:hidden pt-8 border-t border-border/40 text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <span className="text-xs font-semibold text-muted-foreground">Export Quality Certified</span>
          </div>
          <div className="flex items-center gap-3">
            <Leaf className="w-5 h-5 text-primary shrink-0" />
            <span className="text-xs font-semibold text-muted-foreground">50k+ Tons Prevented</span>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="hero-scroll-indicator absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground pointer-events-none">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Scroll to Discover</span>
        <ChevronDown className="scroll-arrow w-4 h-4 text-primary" />
      </div>
    </section>
  )
}
