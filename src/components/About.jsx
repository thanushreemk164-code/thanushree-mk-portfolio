import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { personalInfo, aboutContent, skillGroups } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

// Load portrait dynamically with import.meta.glob
const portraitModules = import.meta.glob(
  '../assets/about/about-portrait.{png,jpg,jpeg,webp,svg}',
  { eager: true, import: 'default' }
)
const portraitSrc = Object.values(portraitModules)[0] || null

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Immediately reveal and set stat values under reduced motion
        const statEls = sectionRef.current?.querySelectorAll('[data-stat-value]')
        statEls?.forEach((el) => {
          el.textContent = el.getAttribute('data-stat-value')
        })
        return
      }

      // 1. Reveal entrance animation for elements marked data-about="reveal"
      gsap.fromTo(
        '[data-about="reveal"]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
          clearProps: 'transform,opacity',
        }
      )

      // 2. Count-up animation for stats (1.6s duration, power2.out)
      const statEls = sectionRef.current?.querySelectorAll('[data-stat-value]')
      statEls?.forEach((el) => {
        const targetVal = parseFloat(el.getAttribute('data-stat-value')) || 0
        const counter = { val: 0 }

        gsap.to(counter, {
          val: targetVal,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = Math.round(counter.val)
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40 bg-ink"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Label */}
        <div data-about="reveal" className="mb-10 font-mono text-xs uppercase tracking-[0.3em] text-signal">
          // <ScrambleText text={aboutContent.label} trigger="view" />
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* LEFT Column: Portrait in .hud-frame */}
          <div data-about="reveal" className="flex justify-center lg:justify-start">
            <div className="hud-frame aspect-[4/5] max-w-[420px] w-full border border-bone/10 bg-panel overflow-hidden relative">
              {portraitSrc ? (
                <>
                  <img
                    src={portraitSrc}
                    alt={`${personalInfo.name} — ${personalInfo.role}`}
                    className="h-full w-full object-cover grayscale contrast-125"
                  />
                  {/* Orange tint layer with multiply blend */}
                  <div
                    className="absolute inset-0 bg-signal mix-blend-multiply opacity-25 pointer-events-none"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center hud-grid text-dim font-mono text-xs">
                  <div className="h-16 w-16 rounded-full border border-dashed border-signal/40 flex items-center justify-center mb-3 text-signal">
                    HUD
                  </div>
                  <span>[OPERATOR // PROFILE_VERIFIED]</span>
                </div>
              )}

              {/* Bottom-left ID tag */}
              <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/60 select-none z-10">
                ID · {personalInfo.brandName}
              </span>
            </div>
          </div>

          {/* RIGHT Column: Narrative, Stats & Skills */}
          <div className="flex flex-col space-y-10">
            {/* Heading */}
            <h2
              data-about="reveal"
              className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] font-sans text-bone"
            >
              {aboutContent.heading}
            </h2>

            {/* Paragraph */}
            <p
              data-about="reveal"
              className="text-lg md:text-xl leading-relaxed text-bone/75 max-w-2xl font-sans"
            >
              {aboutContent.paragraph}
            </p>

            {/* Stats <dl> Grid between two thin lines */}
            <div data-about="reveal">
              <dl className="border-y border-bone/10 py-8 grid grid-cols-3 gap-4 md:gap-8 my-2">
                {aboutContent.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <dd className="order-1 text-4xl md:text-6xl font-bold font-mono text-bone tracking-tight">
                      <span data-stat-value={stat.value}>0</span>
                      <span className="text-signal">{stat.suffix}</span>
                    </dd>
                    <dt className="order-2 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-dim mt-2">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* Skill Modules Grid with 1px gaps */}
            <div data-about="reveal" className="space-y-4">
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
                [TECHNICAL_TOOLKIT // CAPABILITIES]
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-bone/10 border border-bone/10 overflow-hidden">
                {skillGroups.map((group, groupIdx) => (
                  <div
                    key={groupIdx}
                    className="bg-ink p-6 hover:bg-panel transition-colors flex flex-col justify-between"
                  >
                    <div>
                      {/* Header Row */}
                      <div className="flex items-center justify-between pb-3 border-b border-bone/10">
                        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
                          {group.title}
                        </span>
                        <span className="font-mono text-xs text-dim">
                          0{groupIdx + 1}
                        </span>
                      </div>

                      {/* Small Square-Cornered Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {group.items.map((skill, skillIdx) => (
                          <span
                            key={skillIdx}
                            className="border border-bone/15 px-2.5 py-1 font-mono text-xs text-bone/85 bg-ink"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
