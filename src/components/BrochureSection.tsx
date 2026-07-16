import React, { useState, useRef, useEffect, forwardRef } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { BookOpen, Download, Maximize2, X, ChevronLeft, ChevronRight, Pause, Play, Sparkles, FileText, CheckCircle2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePageSection } from '@/hooks/usePageSection'

interface PageProps {
  title?: string
  imageUrl?: string
  description?: string
  pageNumber: number
  totalPages: number
  isCover?: boolean
}

const BrochurePage = forwardRef<HTMLDivElement, PageProps>(
  ({ title, imageUrl, description, pageNumber, totalPages, isCover }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-full w-full bg-background dark:bg-card border border-border/40 overflow-hidden shadow-inner flex flex-col justify-between p-6 sm:p-8 select-none transition-all",
          isCover 
            ? "bg-gradient-to-br from-primary/15 via-emerald-600/10 to-background border-primary/30" 
            : "bg-background/95 dark:bg-zinc-900/95"
        )}
      >
        {/* Top Header / Brand Mark */}
        <div className="flex items-center justify-between border-b border-border/30 pb-3 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
              {isCover ? 'Ecoji Official' : 'Export Specifications'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/70">
            {pageNumber === 1 ? 'COVER' : `p.${pageNumber}`}
          </span>
        </div>

        {/* Main Spread Content */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 z-10 relative">
          {imageUrl ? (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-border/20 mb-4 group">
              <img
                src={imageUrl}
                alt={title || `Page ${pageNumber}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              {isCover && (
                <div className="absolute bottom-3 left-3 bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  2026 Edition
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-[4/3] rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-primary/40" />
            </div>
          )}

          {title && (
            <h3 className={cn(
              "font-bold text-foreground text-center tracking-tight line-clamp-2",
              isCover ? "text-xl sm:text-2xl font-serif italic text-primary" : "text-base sm:text-lg"
            )}>
              {title}
            </h3>
          )}

          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground text-center mt-2 line-clamp-3 font-light leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Bottom Footer / Page Number */}
        <div className="flex items-center justify-between border-t border-border/30 pt-3 z-10 text-[10px] text-muted-foreground/80 font-mono">
          <span>{isCover ? 'Global Zero-Waste Essentials' : 'Certified Biodegradable'}</span>
          <span>{pageNumber} / {totalPages}</span>
        </div>

        {/* Subtle page fold binding line on inside edges */}
        <div 
          className={cn(
            "absolute top-0 bottom-0 w-6 pointer-events-none z-20",
            pageNumber % 2 === 0 
              ? "right-0 bg-gradient-to-l from-black/15 to-transparent" 
              : "left-0 bg-gradient-to-r from-black/15 to-transparent"
          )} 
        />
      </div>
    )
  }
)
BrochurePage.displayName = 'BrochurePage'

export const BrochureSection: React.FC = () => {
  const { data: brochureData } = usePageSection('home', 'brochure', {
    badgeText: 'Interactive Flipbook Catalog',
    heading: 'Explore Our 2026 Export Brochure',
    subheading: 'Experience our complete product specs, export tiers, and zero-waste manufacturing lifecycle directly in your browser.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: [
      {
        title: 'Nature’s Purest Masterpiece',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
        description: 'Global Export Catalog — Certified 100% Biodegradable & Plastic-Free Eco Essentials.'
      },
      {
        title: 'Organic Bamboo Oral & Culinary Care',
        imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=800&auto=format&fit=crop',
        description: 'Antimicrobial bamboo toothbrushes, precision cutlery, and sustainable dining accessories.'
      },
      {
        title: 'Neem Wood Grooming & Wellness',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
        description: 'Handcrafted neem wood combs designed to eliminate static and naturally promote scalp health.'
      },
      {
        title: 'Natural Loofah Exfoliators',
        imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop',
        description: 'Unbleached, organic gourd scrubbers for kitchen, spa, and everyday zero-waste bathing.'
      },
      {
        title: 'OEM Custom Engraving & Bulk Tiers',
        imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800&auto=format&fit=crop',
        description: 'Tailored laser branding, eco-packaging options, and container-load export logistics worldwide.'
      },
      {
        title: 'Ethical & Impact Metrics',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        description: 'Over 50,000 tons of single-use plastic diverted from landfills. Certified cruelty-free.'
      }
    ]
  })

  const pagesList = brochureData?.pages && brochureData.pages.length > 0 ? brochureData.pages : []
  const totalPages = pagesList.length || 1

  const flipBookRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // IntersectionObserver to only auto-flip when visible (Zero-Lag CPU optimization)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    return () => observer.disconnect()
  }, [])

  // Auto-flip interval (every 5 seconds when visible, unpaused, unhovered, and modal closed)
  useEffect(() => {
    if (!isVisible || isPaused || isHovered || isModalOpen || totalPages <= 1) return

    const timer = setInterval(() => {
      if (flipBookRef.current?.pageFlip()) {
        const flip = flipBookRef.current.pageFlip()
        const currentIndex = flip.getCurrentPageIndex()
        if (currentIndex >= totalPages - 1) {
          flip.flip(0)
        } else {
          flip.flipNext()
        }
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [isVisible, isPaused, isHovered, isModalOpen, totalPages])

  const handleFlip = (e: any) => {
    setCurrentPage(e.data)
  }

  const prevPage = () => {
    if (flipBookRef.current?.pageFlip()) {
      flipBookRef.current.pageFlip().flipPrev()
    }
  }

  const nextPage = () => {
    if (flipBookRef.current?.pageFlip()) {
      flipBookRef.current.pageFlip().flipNext()
    }
  }

  const handleDownload = () => {
    const url = brochureData?.pdfUrl || '#'
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Ecoji_Export_Catalog_2026.pdf')
    link.setAttribute('target', '_blank')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section ref={containerRef} className="relative py-24 bg-secondary/10 border-t border-b border-border/40 overflow-hidden">
      {/* Background Organic Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 dark:bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{brochureData?.badgeText || 'Interactive Flipbook Catalog'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {brochureData?.heading || 'Explore Our 2026 Export Brochure'}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
            {brochureData?.subheading || 'Experience our complete product specs, export tiers, and zero-waste manufacturing lifecycle directly in your browser.'}
          </p>
        </div>

        {/* 3D Flipbook & Controls Stage */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          
          {/* Left Action & Highlights Panel */}
          <div className="w-full lg:w-80 flex flex-col gap-6 text-left order-2 lg:order-1">
            <div className="p-6 rounded-3xl bg-background/80 dark:bg-card/80 backdrop-blur-md border border-border/60 shadow-xl shadow-primary/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Interactive Reader</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              <h3 className="text-lg font-bold text-foreground">
                Automatic 3D Page Curl
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Pages automatically advance every 5 seconds when in view. Grab any corner or use our controls below to turn pages at your pace.
              </p>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={cn(buttonVariants({ variant: 'default', size: 'lg' }), "w-full justify-center gap-2 font-semibold shadow-lg shadow-primary/20")}
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Open Fullscreen Flipbook</span>
                </button>

                <button
                  onClick={handleDownload}
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "w-full justify-center gap-2 border-border/60 hover:bg-secondary/50 font-medium")}
                >
                  <Download className="w-4 h-4 text-primary" />
                  <span>Download Full Catalog (.PDF)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-background/60 border border-border/40 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground">Export Quality Verified</span>
              </div>
              <div className="p-4 rounded-2xl bg-background/60 border border-border/40 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground">OEM Tiers & Specs</span>
              </div>
            </div>
          </div>

          {/* Center 3D Flipbook Showcase */}
          <div
            className="relative order-1 lg:order-2 flex flex-col items-center justify-center py-4 px-2 sm:px-6 rounded-3xl bg-background/40 dark:bg-black/20 backdrop-blur-xl border border-border/50 shadow-2xl overflow-visible max-w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between gap-4 mb-4 px-2 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-primary font-mono font-bold">Page {currentPage + 1} of {totalPages}</span>
                {isHovered && <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-foreground">Paused on Hover</span>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title={isPaused ? "Resume Auto-Flip" : "Pause Auto-Flip"}
                >
                  {isPaused ? <Play className="w-4 h-4 text-primary" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title="Fullscreen View"
                >
                  <Maximize2 className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>

            {/* The HTMLFlipBook Engine */}
            <div className="flipbook-wrapper flex items-center justify-center my-2 select-none shadow-2xl">
              <HTMLFlipBook
                ref={flipBookRef}
                width={360}
                height={480}
                size="stretch"
                minWidth={280}
                maxWidth={440}
                minHeight={380}
                maxHeight={580}
                drawShadow={true}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={handleFlip}
                className="rounded-2xl shadow-2xl border border-border/30"
                style={{}}
                startPage={0}
                flippingTime={800}
                usePortrait={true}
                startZIndex={0}
                autoSize={true}
                maxShadowOpacity={0.5}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                {pagesList.map((page: any, index: number) => (
                  <BrochurePage
                    key={index}
                    pageNumber={index + 1}
                    totalPages={totalPages}
                    title={page.title}
                    imageUrl={page.imageUrl}
                    description={page.description}
                    isCover={index === 0 || index === totalPages - 1}
                  />
                ))}
              </HTMLFlipBook>
            </div>

            {/* Bottom Controls Bar */}
            <div className="w-full flex items-center justify-between gap-4 mt-6 px-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border/50 bg-background hover:bg-secondary/60 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[160px] sm:max-w-[220px]">
                {pagesList.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => flipBookRef.current?.pageFlip()?.flip(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all shrink-0",
                      currentPage === idx 
                        ? "w-6 bg-primary shadow-sm" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    )}
                    title={`Jump to Page ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border/50 bg-background hover:bg-secondary/60 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold transition-all shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal Overlay Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-300">
          {/* Modal Header Bar */}
          <div className="w-full flex items-center justify-between text-white pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-bold text-base sm:text-lg">Ecoji 2026 Global Export Catalog</h3>
                <p className="text-xs text-zinc-400">Fullscreen Interactive Flipbook (`Page {currentPage + 1} of {totalPages}`)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close Fullscreen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Fullscreen Flipbook Stage */}
          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
            <HTMLFlipBook
              width={480}
              height={640}
              size="stretch"
              minWidth={320}
              maxWidth={600}
              minHeight={420}
              maxHeight={800}
              drawShadow={true}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={handleFlip}
              className="rounded-2xl shadow-2xl border border-white/20"
              style={{}}
              startPage={currentPage}
              flippingTime={800}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              maxShadowOpacity={0.6}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {pagesList.map((page: any, index: number) => (
                <BrochurePage
                  key={index}
                  pageNumber={index + 1}
                  totalPages={totalPages}
                  title={page.title}
                  imageUrl={page.imageUrl}
                  description={page.description}
                  isCover={index === 0 || index === totalPages - 1}
                />
              ))}
            </HTMLFlipBook>
          </div>

          {/* Modal Footer Controls */}
          <div className="w-full flex items-center justify-between text-white pt-4 border-t border-white/10">
            <button
              onClick={() => {
                if (flipBookRef.current?.pageFlip()) flipBookRef.current.pageFlip().flipPrev()
              }}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-sm font-semibold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Page</span>
            </button>

            <span className="text-sm font-mono tracking-widest text-zinc-300">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              onClick={() => {
                if (flipBookRef.current?.pageFlip()) flipBookRef.current.pageFlip().flipNext()
              }}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-sm font-semibold transition-colors"
            >
              <span>Next Page</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
