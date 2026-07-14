import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export const GlobalLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoWrapperRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    // Lock page scroll, stop Lenis, and intercept all scroll events while loader is visible
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    const preventScroll = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const preventScrollKeys = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'].includes(e.code || e.key)) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    window.addEventListener('wheel', preventScroll, { passive: false, capture: true })
    window.addEventListener('touchmove', preventScroll, { passive: false, capture: true })
    window.addEventListener('keydown', preventScrollKeys, { passive: false, capture: true })

    const win = window as Record<string, any>
    if (win.lenis) win.lenis.stop()
    const checkLenisInterval = setInterval(() => {
      if (win.lenis && isMounted) {
        win.lenis.stop()
      }
    }, 50)

    const unlockScroll = () => {
      clearInterval(checkLenisInterval)
      window.removeEventListener('wheel', preventScroll, { capture: true })
      window.removeEventListener('touchmove', preventScroll, { capture: true })
      window.removeEventListener('keydown', preventScrollKeys, { capture: true })
      document.body.style.overflow = previousOverflow
      window.scrollTo(0, 0)
      if (win.lenis) {
        win.lenis.scrollTo(0, { immediate: true })
        win.lenis.start()
      }
    }

    const runAnimation = () => {
      if (!isMounted || !containerRef.current || !logoWrapperRef.current || !textRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => {
          unlockScroll()
          if (isMounted) onComplete()
        }
      })

      // Animate the image directly
      tl.to('.leaf-icon-loader', {
        opacity: 1,
        scale: 1.1,
        duration: 1.5,
        ease: "power2.inOut"
      })

      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .to(logoWrapperRef.current, {
        scale: 1.2,
        duration: 1.5,
        ease: "sine.inOut"
      }, "-=0.5")
      .to(logoWrapperRef.current, {
        opacity: 0,
        y: -40,
        duration: 0.8,
        ease: "power3.in"
      })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "expo.inOut"
      }, "-=0.4")
    }

    // Slight delay to ensure React commits DOM
    const timer = setTimeout(runAnimation, 100)

    return () => { 
      isMounted = false
      clearTimeout(timer)
      unlockScroll()
    }
  }, [onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-background origin-top pointer-events-auto">
      <div ref={logoWrapperRef} className="flex flex-col items-center">
        <div className="flex items-center justify-center">
          <img src="/logo.png" className="w-80 sm:w-96 h-auto object-contain leaf-icon-loader opacity-0 scale-90" alt="Loading Ecoji" />
        </div>
        <div ref={textRef} className="text-center opacity-0 translate-y-4 -mt-10 sm:-mt-14 relative z-10">
          <p className="text-muted-foreground uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold">Premium Sustainability</p>
        </div>
      </div>
    </div>
  )
}
