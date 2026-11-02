import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/portfolioData'

// Dynamic asset loader for project screenshots with fallback
const projectImageModules = import.meta.glob(
  '../assets/projects/*.{png,jpg,jpeg,webp,svg}',
  { eager: true, import: 'default' }
)

const getProjectImage = (id) => {
  const matchingKey = Object.keys(projectImageModules).find((key) =>
    key.toLowerCase().includes(id.toLowerCase())
  )
  return matchingKey ? projectImageModules[matchingKey] : null
}

export default function Projects() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        y: 35,
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
      id="projects"
      ref={sectionRef}
      className="relative border-t border-bone/10 py-24 px-4 sm:px-6 lg:px-8 bg-ink"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-signal mb-2">
            // 02 / Work
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-bone">
            Featured Projects & Implementations
          </h2>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => {
            const imageSrc = getProjectImage(proj.id)

            return (
              <article
                key={proj.id}
                className="project-card hud-frame border border-bone/10 bg-panel/70 flex flex-col justify-between overflow-hidden group hover:border-bone/30 transition-colors duration-300"
              >
                {/* Visual Area / Screenshot or Schematic */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-ink/90 border-b border-bone/10">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={proj.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center hud-grid">
                      <div className="font-mono text-2xl font-bold text-bone/20 mb-2">
                        {proj.number}
                      </div>
                      <div className="font-mono text-xs uppercase tracking-widest text-signal">
                        [DATA_SYSTEM // SCHEMATIC]
                      </div>
                      <div className="mt-2 font-mono text-[11px] text-bone/40 max-w-xs">
                        {proj.tags.join(' • ')}
                      </div>
                    </div>
                  )}

                  {/* Corner tags */}
                  <div className="absolute top-3 left-3 font-mono text-[10px] uppercase bg-ink/80 px-2 py-0.5 border border-bone/10 text-bone">
                    SYS_NUM // {proj.number}
                  </div>
                  <div className="absolute top-3 right-3 font-mono text-[10px] uppercase bg-ink/80 px-2 py-0.5 border border-bone/10 text-signal">
                    {proj.year}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-bone mb-3 group-hover:text-signal transition-colors">
                      {proj.title}
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-dim leading-relaxed mb-6">
                      {proj.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {proj.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="font-mono text-[11px] border border-bone/10 bg-ink px-2.5 py-1 text-bone/70 uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions Links */}
                    <div className="flex items-center gap-4 pt-4 border-t border-bone/10 font-mono text-xs uppercase tracking-wider">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-bone hover:text-signal transition-colors"
                        >
                          <span>Source Code</span>
                          <span>↗</span>
                        </a>
                      )}
                      {proj.liveUrl && proj.liveUrl !== proj.githubUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-dim hover:text-bone transition-colors"
                        >
                          <span>Live System</span>
                          <span>↗</span>
                        </a>
                      )}
                      {proj.video && (
                        <a
                          href={proj.video}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-signal hover:underline"
                        >
                          <span>Video Demo</span>
                          <span>▶</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
