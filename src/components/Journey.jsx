import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

export default function Journey() {
  const sectionRef = useRef(null)
  const listRef = useRef(null)
  const fillLineRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const list = listRef.current
    const fillLine = fillLineRef.current
    const section = sectionRef.current

    if (!list || !fillLine || !section) return

    const ctx = gsap.context(() => {
      const items = list.querySelectorAll('.journey-item')

      if (prefersReducedMotion) {
        fillLine.style.transform = 'scaleY(1)'
        items.forEach((item) => item.classList.add('is-on'))
        return
      }

      // Fill line animation with scrub
      gsap.fromTo(
        fillLine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: true,
          },
        }
      )

      // Each item: activate node at top 65% and fade-in once at top 85%
      items.forEach((item) => {
        // Toggle active node on/off based on scroll position
        ScrollTrigger.create({
          trigger: item,
          start: 'top 65%',
          onEnter: () => item.classList.add('is-on'),
          onLeaveBack: () => item.classList.remove('is-on'),
        })

        // Fade in from x 30 once
        gsap.fromTo(
          item,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              once: true,
            },
            clearProps: 'transform,opacity',
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="px-5 md:px-10 py-28 md:py-40 bg-ink"
    >
      <div className="grid max-w-[1440px] mx-auto lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
        {/* LEFT Column: Sticky Header on Large Screens */}
        <div className="lg:sticky lg:top-28 lg:self-start space-y-4">
          <ScrambleText
            text="03 / Journey"
            className="block font-mono text-xs uppercase tracking-[0.3em] text-signal"
            trigger="view"
          />
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] font-sans text-bone">
            Where I&apos;ve been learning and building.
          </h2>
        </div>

        {/* RIGHT Column: Timeline List */}
        <div className="relative">
          <ol ref={listRef} className="relative pl-10 space-y-16 list-none">
            {/* Vertical Base Line */}
            <div
              className="absolute left-0 top-2 bottom-2 w-px bg-bone/15 pointer-events-none"
              aria-hidden="true"
            />

            {/* Signal Orange Fill Line */}
            <div
              ref={fillLineRef}
              className="absolute left-0 top-2 bottom-2 w-px bg-signal origin-top scale-y-0 pointer-events-none"
              aria-hidden="true"
            />

            {/* Timeline Entries */}
            {experience.map((entry, idx) => (
              <li
                key={idx}
                className="journey-item group relative space-y-3 [&.is-on_.node]:bg-signal [&.is-on_.node]:scale-100"
              >
                {/* 15px Square Node on the Line */}
                <div
                  className="node absolute -left-[7.5px] top-1.5 h-[15px] w-[15px] border border-signal bg-ink scale-75 transition-all duration-300"
                  aria-hidden="true"
                />

                {/* Period */}
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim block">
                  {entry.period}
                </span>

                {/* Role */}
                <h3 className="text-2xl md:text-3xl font-bold font-sans text-bone block">
                  {entry.role}
                </h3>

                {/* Organisation */}
                <div className="font-mono text-sm text-signal block">
                  @ {entry.org}
                </div>

                {/* Description */}
                <p className="text-base text-bone/70 leading-relaxed font-sans block max-w-xl">
                  {entry.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
