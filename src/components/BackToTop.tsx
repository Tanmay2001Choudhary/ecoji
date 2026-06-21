import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    // @ts-ignore
    if (window.lenis) {
      // @ts-ignore
      window.lenis.scrollTo(0, { duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500", isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none")}>
      <button 
        onClick={scrollToTop}
        className="group flex items-center gap-2 bg-background/80 backdrop-blur-md border shadow-lg px-6 py-3 rounded-full hover:bg-foreground hover:text-background transition-all duration-300"
        data-cursor="interact"
      >
        <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1" />
        <span className="text-sm font-semibold uppercase tracking-wider">Back to Top</span>
      </button>
    </div>
  )
}
