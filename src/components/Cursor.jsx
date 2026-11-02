import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isFinePointer || prefersReducedMotion) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.classList.add('has-cursor')

    // Center elements on the coordinates and make them visible
    gsap.set([dot, ring], {
      xPercent: -50,
      yPercent: -50,
      opacity: 1,
    })

    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

    const handlePointerMove = (e) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      xToRing(e.clientX)
      yToRing(e.clientY)
    }

    const handlePointerOver = (e) => {
      const interactiveTarget = e.target.closest('a, button, input, textarea, [data-cursor="hot"]')
      if (interactiveTarget) {
        gsap.to(ring, {
          scale: 1.8,
          borderColor: '#ff5b1f',
          duration: 0.2,
        })
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(232, 230, 223, 0.6)',
          duration: 0.2,
        })
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerover', handlePointerOver)

    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerover', handlePointerOver)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[999] h-[6px] w-[6px] rounded-full bg-signal opacity-0"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[999] h-[36px] w-[36px] rounded-full border border-bone/60 opacity-0"
        aria-hidden="true"
      />
    </>
  )
}
