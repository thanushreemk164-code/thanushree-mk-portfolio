import { personalInfo, academy, footerContent } from '../data/portfolioData'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-bone/10 bg-ink py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs text-dim">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="text-bone font-medium">
            © {currentYear} {personalInfo.name}
          </span>
          <span className="hidden sm:inline text-bone/20">•</span>
          <span className="text-dim">{footerContent.tagline}</span>
        </div>

        {/* TAP Academy Attribution Credit */}
        <div className="flex items-center gap-2">
          <span>Trained at</span>
          <a
            href={academy.url}
            target="_blank"
            rel="noreferrer"
            className="text-signal hover:underline font-semibold"
          >
            {academy.name}
          </a>
        </div>

        {/* Return to top */}
        <a
          href="#home"
          className="text-dim hover:text-signal transition-colors flex items-center gap-1.5 uppercase tracking-wider"
        >
          <span>TOP</span>
          <span>↑</span>
        </a>
      </div>
    </footer>
  )
}
