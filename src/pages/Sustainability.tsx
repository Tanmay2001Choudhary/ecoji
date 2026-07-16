import { SafeHtmlRenderer } from '@/components/SafeHtmlRenderer'
import { SEO } from '@/components/SEO'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Leaf, Recycle, Trees, Droplets, ArrowRight } from 'lucide-react'
import { usePageSection } from '@/hooks/usePageSection'

gsap.registerPlugin(ScrollTrigger)

export const SustainabilityPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: heroData } = usePageSection('sustainability', 'hero', {
    badgeText: 'The Ecoji Promise',
    heading: 'A cleaner Earth.',
    subheading: 'Every product we make is a deliberate step towards reversing the plastic crisis. Here is how we build a greener tomorrow.'
  })

  const { data: statsData } = usePageSection('sustainability', 'stats', {
    items: [
      { value: 2500, suffix: 'K+', label: 'Plastic Brushes Replaced' },
      { value: 120, suffix: 'Tons', label: 'Ocean Waste Diverted' },
      { value: 100, suffix: '%', label: 'Biodegradable Handles' },
      { value: 50, suffix: 'K+', label: 'Trees Planted via Partners' }
    ]
  })

  const { data: supplyChainData } = usePageSection('sustainability', 'supply_chain', {
    title: 'Plastic-Free Supply Chain',
    paragraphs: [
      'Our commitment doesn\'t stop at the product. We ensure that our entire logistics network, from packaging to shipping, is plastic-free.',
      'We partner exclusively with FSC-certified bamboo cooperatives and utilize carbon-neutral shipping routes whenever possible.'
    ],
    quote: 'Certified 100% Zero-Waste Logistics Workflow.'
  })

  const { data: regenerativeData } = usePageSection('sustainability', 'regenerative', {
    title: 'Regenerative Materials',
    paragraphs: [
      'We use fast-growing, highly renewable resources like Moso bamboo, neem wood, and natural gourd. These require minimal water and zero pesticides.'
    ]
  })

  const { data: microplasticsData } = usePageSection('sustainability', 'microplastics', {
    title: 'Zero Microplastics',
    paragraphs: [
      'By replacing daily essentials, you directly prevent microplastics from entering oceans. Our products biodegrade naturally without releasing toxins.'
    ]
  })

  const { data: ethicalData } = usePageSection('sustainability', 'ethical_sourcing', {
    title: 'Ethical Sourcing',
    paragraphs: [
      'We partner directly with local farmers and artisans. We pay fair wages and ensure our sourcing leaves the local ecosystem thriving and undisturbed.'
    ]
  })

  useGSAP(() => {
    gsap.from('.sus-header', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' })
    
    gsap.utils.toArray('.sus-card').forEach((card: any, index: number) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: (index % 2) * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="pb-32 overflow-hidden relative">
      <SEO title="Sustainability | Ecoji" description="Discover how our eco-friendly materials and sustainable practices are reducing plastic waste." />
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      
      <div className="container max-w-6xl mx-auto pt-32 space-y-24">
        <div className="sus-header max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-widest uppercase">{heroData?.badgeText || 'The Ecoji Promise'}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-foreground">
            {typeof heroData?.heading === 'string' ? heroData.heading.replace(/<[^>]*>/g, '') : 'A cleaner Earth.'}
          </h1>
          <SafeHtmlRenderer html={heroData?.subheading || 'Every product we make is a deliberate step towards reversing the plastic crisis. Here is how we build a greener tomorrow.'} className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed [&_p]:m-0" />
        </div>

        {/* Live Impact Counters Grid */}
        {statsData?.items?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.items.map((stat: any, index: number) => (
              <div key={index} className="sus-card bg-background border border-border/50 p-8 rounded-3xl text-center space-y-2 shadow-sm hover:border-primary/40 transition-all">
                <div className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="sus-grid grid md:grid-cols-2 gap-8">
          <div className="sus-card group p-10 bg-background rounded-[2.5rem] border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <Trees className="w-40 h-40" />
            </div>
            <div className="h-16 w-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
              <Trees className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">{regenerativeData?.title || 'Regenerative Materials'}</h3>
            <div className="space-y-3 mb-6">
              {regenerativeData?.paragraphs?.map((p: string, idx: number) => (
                <SafeHtmlRenderer key={idx} html={p} className="text-muted-foreground text-lg leading-relaxed" />
              ))}
            </div>
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
            <h3 className="text-3xl font-bold mb-4 tracking-tight">{microplasticsData?.title || 'Zero Microplastics'}</h3>
            <div className="space-y-3 mb-6">
              {microplasticsData?.paragraphs?.map((p: string, idx: number) => (
                <SafeHtmlRenderer key={idx} html={p} className="text-muted-foreground text-lg leading-relaxed" />
              ))}
            </div>
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
            <h3 className="text-3xl font-bold mb-4 tracking-tight">{supplyChainData?.title || 'Plastic-Free Supply Chain'}</h3>
            <div className="space-y-3 mb-6">
              {supplyChainData?.paragraphs?.map((p: string, idx: number) => (
                <SafeHtmlRenderer key={idx} html={p} className="text-muted-foreground text-lg leading-relaxed" />
              ))}
            </div>
            {supplyChainData?.quote && (
              <p className="text-xs italic text-primary font-semibold">
                ★ {supplyChainData.quote}
              </p>
            )}
          </div>

          <div className="sus-card group p-10 bg-primary/5 rounded-[2.5rem] border border-primary/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <Leaf className="w-40 h-40" />
            </div>
            <div className="h-16 w-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
              <Leaf className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">{ethicalData?.title || 'Ethical Sourcing'}</h3>
            <div className="space-y-3 mb-6">
              {ethicalData?.paragraphs?.map((p: string, idx: number) => (
                <SafeHtmlRenderer key={idx} html={p} className="text-muted-foreground text-lg leading-relaxed" />
              ))}
            </div>
            <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform cursor-pointer">
              Meet our artisans <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
