import { useState, useEffect } from 'react'
import { personalInfo, heroContent, navLinks, socialLinks } from '../data/portfolioData'

export default function Hud() {
  const [timeString, setTimeString] = useState('')
  const [activeStatusIndex, setActiveStatusIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Live technical clock formatted with the personalInfo timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date()
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: personalInfo.timezone || 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZoneName: 'short',
        })
        setTimeString(formatter.format(now))
      } catch {
        setTimeString(new Date().toLocaleTimeString())
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Rotate through HUD status lines every 4 seconds
  useEffect(() => {
    if (!heroContent.statusLines?.length) return
    const interval = setInterval(() => {
      setActiveStatusIndex((prev) => (prev + 1) % heroContent.statusLines.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-bone/10 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <a
          href="#home"
          className="group flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-bone"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_#ff5b1f] animate-pulse" />
          <span className="font-semibold">{personalInfo.brandName}</span>
          <span className="text-dim group-hover:text-signal transition-colors">[SYS.OK]</span>
        </a>

        {/* Center Technical Telemetry: Clock & Status ticker (hidden on small mobile) */}
        <div className="hidden md:flex items-center gap-6 font-mono text-xs tracking-wider">
          {/* Live Clock */}
          <div className="flex items-center gap-2 text-dim border-r border-bone/10 pr-6">
            <span className="text-bone/40">LOC_TIME:</span>
            <span className="text-bone font-medium">{timeString || 'SYNCING...'}</span>
          </div>

          {/* HUD Status Ticker */}
          <div className="flex items-center gap-2 text-dim max-w-xs truncate">
            <span className="text-signal">&gt;</span>
            <span className="text-bone/80 transition-all duration-300">
              {heroContent.statusLines[activeStatusIndex]}
            </span>
          </div>

          {/* Availability badge */}
          {personalInfo.availability && (
            <div className="hidden lg:flex items-center gap-1.5 border-l border-bone/10 pl-6 text-[11px] text-bone/70">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              <span>{personalInfo.availability}</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest text-dim hover:text-signal transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Social Quick Links */}
          <div className="flex items-center gap-3 border-l border-bone/10 pl-4">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-dim hover:text-bone transition-colors"
                title="GitHub"
              >
                GH
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-dim hover:text-bone transition-colors"
                title="LinkedIn"
              >
                LI
              </a>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col justify-center gap-1 p-2 text-bone focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block h-0.5 w-5 bg-bone transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 bg-bone transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 bg-bone transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-bone/10 bg-ink/95 px-4 py-4 space-y-3 font-mono text-xs uppercase">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-dim hover:text-signal py-1 tracking-wider"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-bone/10 flex items-center justify-between text-dim">
            <span>{timeString}</span>
            <div className="flex gap-4">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="text-bone">
                  GitHub
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-bone">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
