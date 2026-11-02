import { lazy, Suspense, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { personalInfo, heroContent } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

// Lazy load HeroScene so three.js arrives in its own chunk
const HeroScene = lazy(() => import('./HeroScene'))

export default function Hero() {
  const heroRef = useRef(null)

  // Split name into first word (solid) and rest (outlined)
  const nameParts = (personalInfo.name || '').trim().split(' ')
  const firstWord = nameParts[0] || personalInfo.name
  const restOfName = nameParts.slice(1).join(' ')

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Fade & slide in hero elements with stagger
      gsap.fromTo(
        '[data-hero="fade"]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.3,
          clearProps: 'transform,opacity',
        }
      )

      // Thin divider draws from the left
      gsap.fromTo(
        '[data-hero="divider"]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          delay: 0.3,
          transformOrigin: 'left center',
          clearProps: 'transform',
        }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={heroRef}
      className="hud-grid min-h-screen flex flex-col justify-between overflow-hidden px-5 md:px-10 pt-24 pb-10"
    >
      {/* Inner Two-Column Grid */}
      <div className="mx-auto w-full max-w-[1440px] flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-10">
        {/* LEFT Column */}
        <div className="flex flex-col space-y-6">
          {/* Eyebrow */}
          <div
            data-hero="fade"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          >
            // {heroContent.eyebrow}
          </div>

          {/* <h1> with Split Name (Solid First Word, Outlined Rest) */}
          <h1
            data-hero="fade"
            className="text-[clamp(3.2rem,11vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] font-sans"
          >
            <span className="block text-bone">
              <ScrambleText text={firstWord} trigger="mount" delay={200} />
            </span>
            {restOfName && (
              <span className="block text-transparent [-webkit-text-stroke:1.5px_#e8e6df]">
                <ScrambleText text={restOfName} trigger="mount" delay={500} />
              </span>
            )}
          </h1>

          {/* Divider Line */}
          <div
            data-hero="divider"
            className="h-px max-w-xl w-full bg-bone/25 origin-left"
          />

          {/* Role & Narrative Intro */}
          <div data-hero="fade" className="space-y-3 max-w-xl">
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              [ROLE // {personalInfo.role}]
            </div>
            <p className="text-lg md:text-xl text-bone/85 leading-relaxed font-sans">
              {heroContent.intro}
            </p>
          </div>

          {/* Square-Cornered Action Buttons */}
          <div data-hero="fade" className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={heroContent.ctaPrimary.href}
              className="group inline-flex items-center gap-2 bg-signal text-ink hover:bg-bone transition-colors font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5"
            >
              <span>{heroContent.ctaPrimary.label}</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href={heroContent.ctaSecondary.href}
              className="inline-flex items-center border border-bone/30 text-bone hover:border-signal hover:text-signal transition-colors font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5"
            >
              <span>{heroContent.ctaSecondary.label}</span>
            </a>
          </div>
        </div>

        {/* RIGHT Column: HUD Frame holding Lazy HeroScene */}
        <div
          data-hero="fade"
          className="hud-frame border border-bone/10 bg-panel/40 h-[48vh] min-h-[320px] lg:h-[70vh] relative flex items-center justify-center overflow-hidden"
        >
          {/* Top-left Telemetry Tag */}
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.25em] text-dim font-mono pointer-events-none select-none z-10">
            core.view — drag to rotate
          </span>

          {/* Lazy Three.js Scene */}
          <div className="w-full h-full">
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>

          {/* Bottom-right Location Tag */}
          <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.25em] text-dim font-mono pointer-events-none select-none z-10">
            {personalInfo.city}
          </span>
        </div>
      </div>

      {/* Bottom Telemetry Strip */}
      <div
        data-hero="fade"
        className="mx-auto w-full max-w-[1440px] mt-10 border-t border-bone/10 pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-dim flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_6px_#ff5b1f]" />
          <span>{personalInfo.availability}</span>
        </div>
        <div className="hidden sm:inline-block text-bone/60">
          Scroll ↓
        </div>
      </div>
    </section>
  )
}
