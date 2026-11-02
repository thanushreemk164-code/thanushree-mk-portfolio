import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { personalInfo, heroContent } from '../data/portfolioData'
import HeroScene from './HeroScene'
import ScrambleText from './ScrambleText'

export default function Hero() {
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  // GSAP entrance animation with once: true
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from('.hero-anim-item', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'all',
      })
    }, contentRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden hud-grid"
    >
      {/* Three.js 3D Interactive Signal Core */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <div className="w-full h-full max-w-4xl max-h-[700px] flex items-center justify-center">
          <HeroScene />
        </div>
      </div>

      {/* Decorative Technical Crosshairs */}
      <div className="absolute top-24 left-8 hidden sm:block font-mono text-[10px] text-bone/20 select-none pointer-events-none">
        [SYS_COORD // 12.9716° N, 77.5946° E]
      </div>
      <div className="absolute bottom-12 right-8 hidden sm:block font-mono text-[10px] text-bone/20 select-none pointer-events-none">
        [SIGNAL_HUD // ACTIVE]
      </div>

      {/* Content Container */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center pointer-events-none"
      >
        {/* Eyebrow badge */}
        <div className="hero-anim-item mb-4 inline-flex items-center gap-2 border border-bone/10 bg-panel/70 px-3 py-1 font-mono text-xs uppercase tracking-widest text-dim backdrop-blur-sm pointer-events-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_6px_#ff5b1f]" />
          <span>{heroContent.eyebrow}</span>
        </div>

        {/* Technical Title */}
        <h1 className="hero-anim-item font-sans text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-bone mb-6 pointer-events-auto">
          <span className="block text-dim text-lg sm:text-2xl font-mono uppercase tracking-widest mb-2 font-normal">
            // <ScrambleText text={personalInfo.role} trigger="mount" delay={200} />
          </span>
          <ScrambleText text={personalInfo.name} trigger="mount" delay={400} />
        </h1>

        {/* Hero Narrative Intro */}
        <p className="hero-anim-item mx-auto max-w-2xl text-base sm:text-lg text-dim mb-10 leading-relaxed font-sans pointer-events-auto">
          {heroContent.intro}
        </p>

        {/* Action Buttons */}
        <div className="hero-anim-item flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
          <a
            href={heroContent.ctaPrimary.href}
            className="hud-frame group relative inline-flex items-center gap-3 border border-signal bg-signal/10 px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-signal hover:text-ink transition-all duration-200"
          >
            <span>{heroContent.ctaPrimary.label}</span>
            <span className="text-signal group-hover:text-ink group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>

          <a
            href={heroContent.ctaSecondary.href}
            className="hud-frame inline-flex items-center gap-2 border border-bone/10 bg-panel/50 px-6 py-3 font-mono text-xs uppercase tracking-widest text-dim hover:text-bone hover:border-bone/30 transition-all duration-200"
          >
            <span>{heroContent.ctaSecondary.label}</span>
          </a>
        </div>

        {/* Quick telemetry indicators */}
        <div className="hero-anim-item mt-16 pt-8 border-t border-bone/10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 font-mono text-xs text-dim pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-bone/40">LOCATION:</span>
            <span className="text-bone">{personalInfo.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-bone/40">STATUS:</span>
            <span className="text-signal">{personalInfo.availability}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
