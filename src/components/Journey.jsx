import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../data/portfolioData'

export default function Journey() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('.journey-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        x: -24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.16,
        ease: 'power3.out',
        clearProps: 'all',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative border-t border-bone/10 py-24 px-4 sm:px-6 lg:px-8 bg-ink"
    >
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-signal mb-2">
            // 03 / Journey
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-bone">
            Experience & Education Timeline
          </h2>
        </div>

        {/* Timeline Stack */}
        <div className="relative border-l border-bone/15 ml-4 sm:ml-6 pl-6 sm:pl-10 space-y-12">
          {experience.map((item, idx) => (
            <div key={idx} className="journey-item relative group">
              {/* Timeline Node Point */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-ink bg-signal shadow-[0_0_8px_#ff5b1f]" />

              {/* Card Container */}
              <div className="hud-frame border border-bone/10 bg-panel/70 p-6 sm:p-8 hover:border-bone/25 transition-colors">
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs text-signal uppercase tracking-wider font-semibold">
                    {item.period}
                  </span>
                  <span className="font-mono text-[11px] text-bone/40 uppercase">
                    SYS_LOG // 0{idx + 1}
                  </span>
                </div>

                {/* Role / Degree */}
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-bone mb-1">
                  {item.role}
                </h3>

                {/* Organization */}
                <div className="font-mono text-xs uppercase tracking-wider text-bone/70 mb-4">
                  @ {item.org}
                </div>

                {/* Description */}
                <p className="font-sans text-sm sm:text-base text-dim leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
