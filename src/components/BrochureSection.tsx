import { buttonVariants } from '@/components/ui/button'
import { usePageSection } from '@/hooks/usePageSection'
import { cn } from '@/lib/utils'
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Download, Eye, FileText, Layers, Pause, Play, Sparkles } from 'lucide-react'
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up pdf.js worker for Vite & modern browsers
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

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
          "bg-background dark:bg-card border border-border/40 overflow-hidden shadow-inner flex flex-col justify-between p-6 sm:p-8 select-none transition-all",
          isCover
            ? "bg-gradient-to-br from-primary/15 via-emerald-600/10 to-background border-primary/30"
            : "bg-background/95 dark:bg-zinc-900/95"
        )}
        style={{ width: '100%', height: '100%' }}
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
        <div className="flex-1 flex flex-col items-center justify-center py-4 z-10 relative overflow-hidden">
          {imageUrl ? (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-border/20 mb-4 group">
              <img
                src={imageUrl}
                alt={title || `Page ${pageNumber}`}
                className="w-full h-full object-contain bg-zinc-100 dark:bg-zinc-800 transition-transform duration-700 group-hover:scale-105"
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
            <div className="w-full aspect-[4/3] rounded-2xl bg-secondary/40 flex items-center justify-center p-4 border border-border/20 mb-4">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                {isCover ? 'Catalog Cover Spread' : `Technical Diagram ${pageNumber}`}
              </span>
            </div>
          )}

          {/* Page Text & Details */}
          <div className="w-full space-y-2 text-left">
            <h4 className="text-sm font-bold text-foreground line-clamp-1">
              {title || `Catalog Specification Section ${pageNumber}`}
            </h4>
            <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
              {description || 'Detailed technical specifications, material sustainability breakdown, and international compliance standards verified for export distribution.'}
            </p>
          </div>
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

const BrochurePdfPage = forwardRef<HTMLDivElement, { pageNumber: number; totalPages: number; width: number; onRenderSuccess?: () => void }>(
  ({ pageNumber, totalPages, width, onRenderSuccess }, ref) => {
    const renderWidth = Math.max(160, width - 24)

    return (
      <div
        ref={ref}
        className="bg-white dark:bg-zinc-900 border border-border/40 shadow-inner flex flex-col justify-between select-none relative w-full h-full"
        style={{ width: '100%', height: '100%' }}
      >
        <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-white relative p-2 sm:p-0">
          <Page
            pageNumber={pageNumber}
            width={renderWidth}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onRenderSuccess={onRenderSuccess}
            className="!w-full !h-full !max-w-full !max-h-full flex items-center justify-center overflow-hidden [&_.react-pdf\_\_Page\_\_canvas]:!w-full [&_.react-pdf\_\_Page\_\_canvas]:!h-full [&_.react-pdf\_\_Page\_\_canvas]:!max-w-full [&_.react-pdf\_\_Page\_\_canvas]:!max-h-full [&_.react-pdf\_\_Page\_\_canvas]:!object-contain [&_.react-pdf\_\_Page\_\_canvas]:!mx-auto [&_.react-pdf\_\_Page\_\_canvas]:!my-auto"
          />
        </div>
        <div className="flex items-center justify-between border-t border-border/20 px-4 py-2 bg-zinc-50 dark:bg-zinc-900/90 text-[10px] text-muted-foreground font-mono z-10 shrink-0 h-8">
          <span>Ecoji 2026 Export Catalog</span>
          <span>{pageNumber} / {totalPages}</span>
        </div>
      </div>
    )
  }
)
BrochurePdfPage.displayName = 'BrochurePdfPage'

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
  const staticTotalPages = pagesList.length || 1

  const flipBookRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [viewMode, setViewMode] = useState<'flipbook' | 'pdf'>('flipbook')

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  })

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Exact responsive geometry for Normal View across Mobile (< 640px), Tablet (640px - 1024px), and Desktop (1024px+)
  const bookWidth = useMemo(() => {
    const { width, height } = windowSize
    if (width < 640) {
      const maxW = width - 40
      const maxHByW = Math.floor((height - 200) / 1.414)
      return Math.max(220, Math.min(maxW, maxHByW, 340))
    } else if (width < 1024) {
      // Tablet view: check if 2-page spread fits or scale down
      return Math.max(260, Math.min(Math.floor((width - 80) / 2), 350))
    }
    return 370
  }, [windowSize])
  const bookHeight = Math.round(bookWidth * 1.414)

  // PDF specific state
  const [numPdfPages, setNumPdfPages] = useState<number | null>(null)
  const [isPdfError, setIsPdfError] = useState(false)
  const [renderedPagesCount, setRenderedPagesCount] = useState(0)

  const hasValidPdf = Boolean(
    brochureData?.pdfUrl &&
    brochureData.pdfUrl !== '#' &&
    !isPdfError &&
    numPdfPages !== null &&
    numPdfPages > 0
  )
  const activeTotalPages = hasValidPdf && numPdfPages ? numPdfPages : staticTotalPages

  // When canvases finish rendering asynchronously, trigger react-pageflip to update textures and prevent white pages
  const handlePageRenderSuccess = () => {
    setRenderedPagesCount(prev => prev + 1)
  }

  useEffect(() => {
    if (renderedPagesCount > 0 && flipBookRef.current?.pageFlip) {
      try {
        flipBookRef.current.pageFlip().update()
      } catch (err) {
        // ignore if in transition
      }
    }
  }, [renderedPagesCount])

  // IntersectionObserver to only auto-flip when visible
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

  // Auto-flip interval (every 5 seconds when visible, unpaused, unhovered, and in flipbook mode)
  useEffect(() => {
    if (!isVisible || isPaused || isHovered || viewMode !== 'flipbook' || activeTotalPages <= 1) return

    const timer = setInterval(() => {
      if (flipBookRef.current?.pageFlip) {
        const flip = flipBookRef.current.pageFlip()
        const currentIndex = flip.getCurrentPageIndex()
        if (currentIndex >= activeTotalPages - 1) {
          flip.flip(0)
        } else {
          flip.flipNext()
        }
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [isVisible, isPaused, isHovered, viewMode, activeTotalPages])

  const handleFlip = (e: any) => {
    setCurrentPage(e.data)
  }

  const prevPage = () => {
    if (flipBookRef.current?.pageFlip) {
      flipBookRef.current.pageFlip().flipPrev()
    }
  }

  const nextPage = () => {
    if (flipBookRef.current?.pageFlip) {
      flipBookRef.current.pageFlip().flipNext()
    }
  }

  const handleDownload = () => {
    const url = brochureData?.pdfUrl || '#'
    if (url === '#' || !url) {
      alert('No PDF file uploaded yet. Please upload a PDF file from the Admin Dashboard.')
      return
    }
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

      {/* Hidden Document loader to verify PDF page count */}
      {brochureData?.pdfUrl && brochureData.pdfUrl !== '#' && (
        <div className="hidden">
          <Document
            file={brochureData.pdfUrl}
            onLoadSuccess={({ numPages }) => {
              setNumPdfPages(numPages)
              setIsPdfError(false)
            }}
            onLoadError={() => setIsPdfError(true)}
          />
        </div>
      )}

      <div className="container max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
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

          {/* View Mode Toggle: Only shown when a valid PDF url is available */}
          {brochureData?.pdfUrl && brochureData.pdfUrl !== '#' && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setViewMode('flipbook')}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm",
                  viewMode === 'flipbook'
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                    : "bg-background border border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <Layers className="w-4 h-4" />
                <span>Interactive Flipbook</span>
              </button>

              <button
                onClick={() => setViewMode('pdf')}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm",
                  viewMode === 'pdf'
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                    : "bg-background border border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <Eye className="w-4 h-4" />
                <span>Document Reader</span>
              </button>
            </div>
          )}
        </div>

        {viewMode === 'pdf' ? (
          /* Direct PDF Viewer Mode */
          <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-border shadow-2xl bg-background/80 backdrop-blur-xl p-3 sm:p-6 flex flex-col items-center justify-center gap-4 animate-fade-in">
            <div className="w-full flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border/40 pb-3">
              <span className="font-bold text-foreground">Live Document Viewer (.PDF)</span>
              {brochureData?.pdfUrl && brochureData.pdfUrl !== '#' && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-primary font-bold hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Brochure</span>
                </button>
              )}
            </div>

            {brochureData?.pdfUrl && brochureData.pdfUrl !== '#' ? (
              <iframe
                src={`${brochureData.pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                title="Ecoji Export Brochure PDF"
                className="w-full h-[650px] sm:h-[800px] rounded-2xl border border-border/30 shadow-inner bg-white"
              />
            ) : (
              <div className="w-full h-[400px] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <FileText className="w-12 h-12 text-primary/40" />
                <p className="text-sm font-medium">No direct PDF file has been uploaded yet from the Admin Dashboard.</p>
                <button
                  onClick={() => setViewMode('flipbook')}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "mt-2")}
                >
                  Switch back to Flipbook
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 3D Flipbook & Controls Stage structured neatly in a 12-column grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">

            {/* Left Action & Highlights Panel (4 Columns on Desktop) */}
            <div className="lg:col-span-4 flex flex-col gap-6 text-left order-2 lg:order-1">
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

                {brochureData?.pdfUrl && brochureData.pdfUrl !== '#' && (
                  <div className="pt-2 flex flex-col gap-3">
                    <button
                      onClick={handleDownload}
                      className={cn(buttonVariants({ variant: 'default', size: 'lg' }), "w-full justify-center gap-2 font-bold shadow-lg shadow-primary/20")}
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF Brochure</span>
                    </button>
                  </div>
                )}
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

            {/* Right Showcase Box (8 Columns on Desktop) — Keeps Flipbook exactly aligned inside its container */}
            <div
              className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center justify-center py-8 px-4 sm:px-8 rounded-3xl bg-background/60 dark:bg-card/40 backdrop-blur-xl border border-border/60 shadow-2xl w-full min-h-[600px]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Top Toolbar */}
              <div className="w-full flex items-center justify-between gap-4 mb-4 px-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-mono font-bold">Page {currentPage + 1} of {activeTotalPages}</span>
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
                </div>
              </div>

              {/* The HTMLFlipBook Engine with strict fixed aspect wrapper */}
              <div className="flex items-center justify-center my-2 select-none shadow-2xl max-w-full overflow-hidden">
                {hasValidPdf ? (
                  <Document file={brochureData?.pdfUrl}>
                    <HTMLFlipBook
                      key={`pdf-book-${bookWidth}-${bookHeight}`}
                      ref={flipBookRef}
                      width={bookWidth}
                      height={bookHeight}
                      size="fixed"
                      minWidth={180}
                      maxWidth={500}
                      minHeight={250}
                      maxHeight={750}
                      drawShadow={true}
                      showCover={true}
                      mobileScrollSupport={true}
                      onFlip={handleFlip}
                      className="rounded-2xl shadow-2xl border border-border/40 max-w-full"
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
                      {Array.from(new Array(numPdfPages), (_, index) => (
                        <BrochurePdfPage
                          key={`pdf_page_${index + 1}`}
                          pageNumber={index + 1}
                          totalPages={numPdfPages!}
                          width={bookWidth}
                          onRenderSuccess={handlePageRenderSuccess}
                        />
                      ))}
                    </HTMLFlipBook>
                  </Document>
                ) : (
                  <HTMLFlipBook
                    key={`static-book-${bookWidth}-${bookHeight}`}
                    ref={flipBookRef}
                    width={bookWidth}
                    height={bookHeight}
                    size="fixed"
                    minWidth={180}
                    maxWidth={500}
                    minHeight={250}
                    maxHeight={750}
                    drawShadow={true}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={handleFlip}
                    className="rounded-2xl shadow-2xl border border-border/40"
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
                        totalPages={staticTotalPages}
                        title={page.title}
                        imageUrl={page.imageUrl}
                        description={page.description}
                        isCover={index === 0 || index === staticTotalPages - 1}
                      />
                    ))}
                  </HTMLFlipBook>
                )}
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

                <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-1 max-w-[160px] sm:max-w-[220px]">
                  {Array.from(new Array(activeTotalPages), (_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (flipBookRef.current?.pageFlip) {
                          flipBookRef.current.pageFlip().flip(idx)
                        }
                      }}
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
                  disabled={currentPage >= activeTotalPages - 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border/50 bg-background hover:bg-secondary/60 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold transition-all shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
