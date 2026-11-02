import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

// Dynamically load project covers with import.meta.glob
const projectImageModules = import.meta.glob(
  '../assets/projects/*.{png,jpg,jpeg,webp,svg}',
  { eager: true, import: 'default' }
)

function getProjectCover(id) {
  const match = Object.keys(projectImageModules).find((key) => {
    const filename = key.split('/').pop()?.toLowerCase() || ''
    return filename.startsWith(id.toLowerCase() + '.')
  })
  return match ? projectImageModules[match] : null
}

function ProjectCard({ project }) {
  const coverSrc = getProjectCover(project.id)

  return (
    <article
      data-cursor="hot"
      className="group relative w-full md:w-[min(560px,42vw)] shrink-0 border border-bone/10 bg-panel/60 flex flex-col justify-between overflow-hidden transition-colors hover:border-bone/30"
    >
      {/* Top Cover Area */}
      <div className="relative aspect-[16/10] md:aspect-[16/8] w-full border-b border-bone/10 bg-ink overflow-hidden flex items-center justify-center">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={project.title}
            className="h-full w-full object-cover grayscale opacity-80 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="hud-grid h-full w-full flex flex-col items-center justify-center p-6 text-center select-none">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              [SYSTEM // {project.id}]
            </span>
          </div>
        )}

        {/* Top-Left Badge: <number> / <year> */}
        <div className="absolute top-3 left-3 z-10 bg-ink/80 px-2.5 py-1 border border-bone/10 font-mono text-[10px] uppercase tracking-[0.25em] text-signal select-none">
          {project.number} / {project.year}
        </div>
      </div>

      {/* Body Area */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone font-sans transition-colors group-hover:text-signal">
            {project.title}
          </h3>

          <p className="text-sm md:text-base text-bone/70 leading-relaxed font-sans">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions Bottom Bar */}
        <div className="flex items-center gap-3 pt-4 border-t border-bone/10">
          {project.liveUrl && project.liveUrl !== project.githubUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-signal text-ink hover:bg-bone font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Live</span>
              <span>↗</span>
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-bone/30 text-bone hover:border-signal hover:text-signal font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Code</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current
      const section = sectionRef.current
      const progressBar = progressRef.current

      if (!track || !section) return

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80)

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + getDistance(),
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBar) {
              progressBar.style.transform = `scaleX(${self.progress})`
            }
          },
        },
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full overflow-hidden py-24 md:h-screen md:flex md:flex-col md:justify-center md:pt-20 md:pb-6 bg-ink"
    >
      {/* Header Row */}
      <div className="max-w-[1440px] w-full mx-auto px-5 md:px-10 mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <ScrambleText
            text="02 / Selected work"
            className="block font-mono text-xs uppercase tracking-[0.3em] text-signal mb-2"
          />
          <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] font-sans text-bone">
            Projects
          </h2>
        </div>

        <div className="hidden md:block font-mono text-xs text-dim uppercase tracking-[0.2em]">
          {projects.length} projects · scroll →
        </div>
      </div>

      {/* Horizontal Track (Mobile: stacked vertical; Desktop: single horizontal row) */}
      <div className="w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-col gap-6 md:flex-row md:w-max md:gap-8 px-5 md:px-10"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Desktop Progress Line */}
      <div className="hidden md:block max-w-[1440px] w-full mx-auto px-5 md:px-10 mt-8">
        <div className="h-[2px] w-full bg-bone/10 overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-signal origin-left scale-x-0 transition-transform duration-75"
          />
        </div>
      </div>
    </section>
  )
}
