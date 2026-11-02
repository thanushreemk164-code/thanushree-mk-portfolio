import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { aboutContent, skillGroups } from '../data/portfolioData'

// Dynamic asset resolution for portrait with fallback
const portraitModules = import.meta.glob(
  '../assets/about/about-portrait.{png,jpg,jpeg,webp,svg}',
  { eager: true, import: 'default' }
)
const portraitSrc = Object.values(portraitModules)[0] || null

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('.about-anim', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'all',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative border-t border-bone/10 py-24 px-4 sm:px-6 lg:px-8 bg-ink"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="about-anim mb-12">
          <div className="font-mono text-xs uppercase tracking-widest text-signal mb-2">
            // {aboutContent.label}
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-bone max-w-2xl">
            {aboutContent.heading}
          </h2>
        </div>

        {/* Grid: Narrative & Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Narrative text & Stats */}
          <div className="lg:col-span-7 space-y-8">
            <p className="about-anim text-base sm:text-lg text-dim leading-relaxed font-sans">
              {aboutContent.paragraph}
            </p>

            {/* Numerical Stats row */}
            <div className="about-anim grid grid-cols-3 gap-4 pt-4 border-t border-bone/10">
              {aboutContent.stats.map((stat, idx) => (
                <div key={idx} className="hud-frame border border-bone/10 bg-panel/40 p-4">
                  <div className="font-mono text-2xl sm:text-4xl font-bold text-bone">
                    {stat.value}
                    <span className="text-signal">{stat.suffix}</span>
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-dim mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portrait or Technical HUD Canvas Placeholder */}
          <div className="about-anim lg:col-span-5">
            <div className="hud-frame border border-bone/10 bg-panel p-2">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-ink/70 flex flex-col items-center justify-center p-6 text-center border border-bone/5">
                {portraitSrc ? (
                  <img
                    src={portraitSrc}
                    alt="Thanushree MK portrait"
                    className="h-full w-full object-cover filter grayscale contrast-125"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto h-20 w-20 rounded-full border border-dashed border-signal/40 flex items-center justify-center">
                      <span className="font-mono text-xs text-signal font-semibold">TMK // HUD</span>
                    </div>
                    <div className="font-mono text-xs text-bone tracking-wider">
                      [OPERATOR // PROFILE_VERIFIED]
                    </div>
                    <p className="font-mono text-[11px] text-dim max-w-xs">
                      DATA ANALYST // BANGALORE, INDIA
                    </p>
                  </div>
                )}

                {/* Corner telemetry tag */}
                <div className="absolute bottom-2 left-2 font-mono text-[9px] text-bone/30 uppercase">
                  SYS_ID // 084-MK
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Groups */}
        <div className="about-anim pt-12 border-t border-bone/10">
          <div className="font-mono text-xs uppercase tracking-widest text-signal mb-8">
            // TECHNICAL_TOOLKIT
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillGroups.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className="hud-frame border border-bone/10 bg-panel/60 p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-bone mb-4 pb-2 border-b border-bone/10 flex items-center justify-between">
                    <span>{group.title}</span>
                    <span className="text-signal text-[10px]">0{groupIdx + 1}</span>
                  </h3>
                  <ul className="space-y-2">
                    {group.items.map((skill, skillIdx) => (
                      <li
                        key={skillIdx}
                        className="font-mono text-xs text-dim flex items-center gap-2"
                      >
                        <span className="h-1 w-1 rounded-full bg-signal/60" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
