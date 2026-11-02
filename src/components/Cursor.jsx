import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Check if the device has a fine pointer (mouse) and if reduced motion is requested
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!hasFinePointer || prefersReducedMotion) {
      return
    }

    document.body.classList.add('has-cursor')

    const cursor = cursorRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    if (!cursor || !dot || !ring) return

    // Quick setters for smooth 60fps tracking
    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' })
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' })
    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' })
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' })

    let isVisible = false

    const handleMouseMove = (e) => {
      if (!isVisible) {
        gsap.to(cursor, { opacity: 1, duration: 0.2 })
        isVisible = true
      }
      xToDot(e.clientX)
      yToDot(e.clientY)
      xToRing(e.clientX)
      yToRing(e.clientY)
    }

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 })
      isVisible = false
    }

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 })
      isVisible = true
    }

    // Expand reticle on clickable elements
    const handleElementHover = (e) => {
      const target = e.target.closest('a, button, input, textarea, [role="button"]')
      if (target) {
        gsap.to(ring, { scale: 1.6, borderColor: '#ff5b1f', duration: 0.2 })
        gsap.to(dot, { scale: 1.8, backgroundColor: '#ff5b1f', duration: 0.2 })
      } else {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(232, 230, 223, 0.4)', duration: 0.2 })
        gsap.to(dot, { scale: 1, backgroundColor: '#ff5b1f', duration: 0.2 })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleElementHover)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleElementHover)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed inset-0 z-50 opacity-0 transition-opacity"
      aria-hidden="true"
    >
      {/* Center signal targeting dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_#ff5b1f]"
      />
      {/* Outer reticle ring with HUD crosshair ticks */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-4 -mt-4 h-8 w-8 rounded-full border border-bone/40 transition-colors"
      />
    </div>
  )
}
