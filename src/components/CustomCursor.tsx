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

    // QuickTo for high performance following
    const xMoveDot = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" })
    const yMoveDot = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" })
    const xMoveRing = gsap.quickTo(ringRef.current, "x", { duration: 0.4, ease: "power3" })
    const yMoveRing = gsap.quickTo(ringRef.current, "y", { duration: 0.4, ease: "power3" })

    const onMouseMove = (e: MouseEvent) => {
      xMoveDot(e.clientX)
      yMoveDot(e.clientY)
      xMoveRing(e.clientX)
      yMoveRing(e.clientY)
      
      if (cursorRef.current && cursorRef.current.style.opacity === '0') {
        gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 })
      }
    }

    const onMouseLeave = () => {
      if (cursorRef.current) gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 })
    }
    const onMouseEnter = () => {
      if (cursorRef.current) gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 })
    }

    let currentTarget: HTMLElement | null = null;

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target === currentTarget) return;
      currentTarget = target;

      // Check for buttons/links
      if (target.closest('a') || target.closest('button') || target.tagName.toLowerCase() === 'input') {
        gsap.to(dotRef.current, { scale: 0.5, duration: 0.2 })
        gsap.to(ringRef.current, { scale: 1.5, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.5)', duration: 0.2 })
      } else {
        gsap.to(dotRef.current, { scale: 1, duration: 0.2 })
        gsap.to(ringRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,1)', duration: 0.2 })
      }

      // Check for context
      const contextEl = target.closest('[data-cursor]') as HTMLElement
      if (contextEl && (cursorStyle === 'context' || cursorStyle === 'premium')) {
        setContextText(contextEl.dataset.cursor || '')
        setIsHovering(true)
        gsap.to(ringRef.current, { width: 96, height: 96, marginLeft: -48, marginTop: -48, backgroundColor: 'white', border: 'none', duration: 0.3 })
      } else {
        setContextText('')
        setIsHovering(false)
        gsap.to(ringRef.current, { width: 32, height: 32, marginLeft: -16, marginTop: -16, backgroundColor: 'transparent', border: '1px solid white', duration: 0.3 })
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
  const isEco = cursorStyle === 'eco'

  return (
    <div 
      ref={cursorRef} 
      className="fixed inset-0 pointer-events-none z-[10000] mix-blend-difference"
      style={{ opacity: 0 }}
    >
      {/* Inner Dot */}
      <div 
        ref={dotRef} 
        className="absolute top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white flex items-center justify-center"
      >
        {isEco && <Leaf className="w-4 h-4 text-white absolute" />}
      </div>

      {/* Outer Ring / Context Box */}
      <div 
        ref={ringRef} 
        className="absolute top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-white flex items-center justify-center"
      >
        <div 
          ref={contextRef}
          className={`text-[10px] text-black font-bold uppercase tracking-widest transition-opacity duration-300 ${showContext ? 'opacity-100' : 'opacity-0'}`}
        >
          {contextText}
        </div>
      </div>
    </div>
  )
}
