import { useState, useEffect, useRef } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/'

export default function ScrambleText({
  text = '',
  as: Component = 'span',
  className = '',
  delay = 0,
  speed = 30,
  trigger = 'view',
}) {
  const [display, setDisplay] = useState(text)
  const elementRef = useRef(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return
    }

    let intervalId = null
    let timeoutId = null
    let observer = null

    const startScramble = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true

      timeoutId = setTimeout(() => {
        let frame = 0
        const totalLength = text.length

        intervalId = setInterval(() => {
          frame++
          const lockedCount = Math.floor(frame / 2)

          if (lockedCount >= totalLength) {
            setDisplay(text)
            clearInterval(intervalId)
            return
          }

          const scrambled = text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' '
              if (index < lockedCount) return char
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            })
            .join('')

          setDisplay(scrambled)
        }, speed)
      }, delay)
    }

    if (trigger === 'mount') {
      startScramble()
    } else {
      const element = elementRef.current
      if (element) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              startScramble()
              observer.disconnect()
            }
          },
          { threshold: 0.4 }
        )
        observer.observe(element)
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
      if (observer) observer.disconnect()
    }
  }, [text, delay, speed, trigger])

  return (
    <Component ref={elementRef} aria-label={text} className={className}>
      <span aria-hidden="true">{display}</span>
    </Component>
  )
}
