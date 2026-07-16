import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useAppStore } from '@/store/useAppStore'
import { Leaf } from 'lucide-react'

export const CustomCursor = () => {
  const { cursorStyle } = useAppStore()
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const contextRef = useRef<HTMLDivElement>(null)
  
  const [contextText, setContextText] = useState('')
  const [isHovering, setIsHovering] = useState(false)

  // Disable completely on touch devices
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  useEffect(() => {
    if (isTouchDevice || cursorStyle === 'default') return

    // QuickTo for high performance following (faster response to eliminate lag feel)
    const xMoveDot = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "power3" })
    const yMoveDot = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "power3" })
    const xMoveRing = gsap.quickTo(ringRef.current, "x", { duration: 0.18, ease: "power3" })
    const yMoveRing = gsap.quickTo(ringRef.current, "y", { duration: 0.18, ease: "power3" })

    const onMouseMove = (e: MouseEvent) => {
      xMoveDot(e.clientX)
      yMoveDot(e.clientY)
      xMoveRing(e.clientX)
      yMoveRing(e.clientY)
      
      if (cursorRef.current && cursorRef.current.style.opacity === '0') {
        gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 })
      }
    }

    const onMouseLeave = () => {
      if (cursorRef.current) gsap.to(cursorRef.current, { opacity: 0, duration: 0.2 })
    }
    const onMouseEnter = () => {
      if (cursorRef.current) gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 })
    }

    let currentTarget: HTMLElement | null = null;

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target === currentTarget) return;
      currentTarget = target;

      // Check for buttons/links
      if (target.closest('a') || target.closest('button') || target.tagName.toLowerCase() === 'input') {
        gsap.to(dotRef.current, { scale: 0.6, duration: 0.15 })
        gsap.to(ringRef.current, { scale: 1.3, backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.8)', duration: 0.15 })
      } else {
        gsap.to(dotRef.current, { scale: 1, duration: 0.15 })
        gsap.to(ringRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(34, 197, 94, 0.7)', duration: 0.15 })
      }

      // Check for context
      const contextEl = target.closest('[data-cursor]') as HTMLElement
      if (contextEl && (cursorStyle === 'context' || cursorStyle === 'premium')) {
        setContextText(contextEl.dataset.cursor || '')
        setIsHovering(true)
        gsap.to(ringRef.current, { width: 88, height: 88, marginLeft: -44, marginTop: -44, backgroundColor: 'rgba(34, 197, 94, 0.95)', border: '2px solid rgba(255,255,255,0.4)', duration: 0.25 })
      } else {
        setContextText('')
        setIsHovering(false)
        gsap.to(ringRef.current, { width: 32, height: 32, marginLeft: -16, marginTop: -16, backgroundColor: 'transparent', border: '1.5px solid rgba(34, 197, 94, 0.7)', duration: 0.25 })
      }
    }

    const onMouseDown = () => {
      gsap.to([dotRef.current, ringRef.current], { scale: 0.8, duration: 0.2 })
    }
    const onMouseUp = () => {
      gsap.to([dotRef.current, ringRef.current], { scale: 1, duration: 0.2 })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mouseenter', onMouseEnter)
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseenter', onMouseEnter)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [cursorStyle, isTouchDevice])

  useEffect(() => {
    // Hide default cursor globally when active
    if (!isTouchDevice && cursorStyle !== 'default') {
      document.body.style.cursor = 'none'
      const style = document.createElement('style')
      style.innerHTML = `* { cursor: none !important; }`
      document.head.appendChild(style)
      return () => {
        document.body.style.cursor = 'auto'
        document.head.removeChild(style)
      }
    }
  }, [cursorStyle, isTouchDevice])

  if (isTouchDevice || cursorStyle === 'default') return null

  const showContext = (cursorStyle === 'context' || cursorStyle === 'premium') && isHovering && contextText
  
  // Design Logic based on cursorStyle
  const isEco = cursorStyle === 'eco'
  const isPremium = cursorStyle === 'premium'
  const isContext = cursorStyle === 'context'

  return (
    <div 
      ref={cursorRef} 
      className="fixed inset-0 pointer-events-none z-[999999]"
      style={{ opacity: 0 }}
    >
      {/* Inner Element */}
      <div 
        ref={dotRef} 
        className={`absolute top-0 left-0 flex items-center justify-center transition-colors duration-300
          ${isEco ? '-ml-3 -mt-3 text-primary drop-shadow-[0_0_8px_rgba(76,175,80,0.8)]' : ''}
          ${isPremium ? 'w-1 h-1 -ml-[2px] -mt-[2px] rounded-full bg-white shadow-md' : ''}
          ${isContext ? 'w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-primary shadow-sm' : ''}
        `}
      >
        {isEco && <Leaf className="w-6 h-6 fill-primary" />}
      </div>

      {/* Outer Ring / Context Box */}
      <div 
        ref={ringRef} 
        className={`absolute top-0 left-0 flex items-center justify-center transition-colors duration-300
          ${isEco ? 'w-12 h-12 -ml-6 -mt-6 rounded-full border border-primary/50 bg-primary/5' : ''}
          ${isPremium ? 'w-10 h-10 -ml-5 -mt-5 rounded-full border border-white/80 shadow-sm' : ''}
          ${isContext ? 'w-8 h-8 -ml-4 -mt-4 rounded-full border-1.5 border-primary/70' : ''}
        `}
      >
        <div 
          ref={contextRef}
          className={`text-[10px] text-white font-bold uppercase tracking-widest transition-opacity duration-300 drop-shadow-md ${showContext ? 'opacity-100' : 'opacity-0'}`}
        >
          {contextText}
        </div>
      </div>
    </div>
  )
}
