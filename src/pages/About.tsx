import { SafeHtmlRenderer } from '@/components/SafeHtmlRenderer'
import { SEO } from '@/components/SEO'
import { usePageSection } from '@/hooks/usePageSection'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Globe, Heart, Zap } from 'lucide-react'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: heroData } = usePageSection('about', 'hero', {
    heading: 'Our Story',
    subheading: 'Proving that premium quality and absolute sustainability can, and must, exist together.'
  })

  const { data: storyData } = usePageSection('about', 'story', {
    title: 'Born from a simple realization',
    paragraphs: [
      'Everyday products were leaving a permanent scar on our planet. We set out to create a brand that proves sustainability and premium quality can go hand-in-hand.',
      'We traveled, researched, and partnered with artisans to bring you everyday essentials that are biodegradable, ethically sourced, and beautifully designed.'
    ],
    quote: 'Radical Transparency. Circular Innovation. Uncompromising Quality.'
  })

  const { data: valuesData } = usePageSection('about', 'values', {
    items: [
      { title: 'Our Vision', description: 'We envision a world where zero-waste living is not a compromise, but a standard. A world where every product in your home is crafted from nature and returns to nature seamlessly.' },
      { title: 'Our Mission', description: 'To provide accessible, high-quality, and eco-friendly alternatives to everyday plastic products, empowering individuals to make conscious choices for massive collective impact.' }
    ]
  })

  const { data: philosophyData } = usePageSection('about', 'philosophy', {
    title: 'Manufacturing Philosophy',
    paragraphs: [
      'We believe in radical transparency. Our processes prioritize ethical labor, minimalistic processing, and maximum utilization of raw materials. We craft solutions with care and responsibility.'
    ]
  })

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
        <h1 className="about-title text-6xl md:text-8xl font-bold mb-6 text-foreground tracking-tighter">
          {typeof heroData?.heading === 'string' ? heroData.heading.replace(/<[^>]*>/g, '') : 'Our Story'}
        </h1>
        <SafeHtmlRenderer html={heroData?.subheading || 'Proving that premium quality and absolute sustainability can, and must, exist together.'} className="about-subtitle text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed [&_p]:m-0" />
      </section>

      <div className="container max-w-5xl mx-auto pt-24 space-y-32">
        {/* Brand Story */}
        {((storyData?.title && storyData.title.trim().length > 0) || (storyData?.paragraphs?.length > 0) || (storyData?.quote && storyData.quote.trim().length > 0)) && (
          <section className="reveal-section grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-muted rounded-[3rem] overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" alt="Nature" className="object-cover w-full h-full hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>
            <div className="space-y-6">
              {storyData?.title && <h2 className="text-4xl font-bold tracking-tight">{storyData.title}</h2>}
              {storyData?.paragraphs?.map((p: string, idx: number) => (
                <SafeHtmlRenderer key={idx} html={p} className="text-lg text-muted-foreground leading-relaxed" />
              ))}
              {storyData?.quote && (
                <div className="p-4 border-l-4 border-primary bg-primary/5 italic text-primary font-medium rounded-r-xl">
                  "{storyData.quote}"
                </div>
              )}
            </div>
          </section>
        )}

        {/* Mission & Vision Grid */}
        {valuesData?.items?.length > 0 && (
          <section className="reveal-section grid md:grid-cols-2 gap-8">
            {valuesData.items.slice(0, 2).map((item: any, idx: number) => {
              const icons = [Globe, Zap]
              const IconComp = icons[idx % icons.length]
              return (
                <div key={idx} className="bg-secondary/20 p-12 rounded-[3rem] border border-border/50 hover:border-primary/50 transition-colors">
                  <IconComp className="w-12 h-12 text-primary mb-6" />
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">{item.title}</h3>
                  <SafeHtmlRenderer html={item.description} className="text-muted-foreground text-lg leading-relaxed" />
                </div>
              )
            })}
          </section>
        )}

        {/* Goals & Philosophy */}
        {((philosophyData?.title && philosophyData.title.trim().length > 0) || (philosophyData?.paragraphs?.length > 0)) && (
          <section className="reveal-section text-center max-w-3xl mx-auto space-y-16">
            <div>
              <Heart className="w-16 h-16 text-primary mx-auto mb-8" />
              <h2 className="text-4xl font-bold tracking-tight mb-6">{philosophyData?.title || 'Manufacturing Philosophy'}</h2>
              {philosophyData?.paragraphs?.map((p: string, idx: number) => (
                <SafeHtmlRenderer key={idx} html={p} className="text-xl text-muted-foreground leading-relaxed font-light mb-4" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
