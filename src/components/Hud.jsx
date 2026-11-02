import { useState, useEffect } from 'react'
import { personalInfo, navLinks, heroContent } from '../data/portfolioData'

export default function Hud() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeStatusIndex, setActiveStatusIndex] = useState(0)
  const [timeString, setTimeString] = useState('')

  // Compute initials for the 32px badge (e.g. TMK)
  const initials = personalInfo.brandName
    ? personalInfo.brandName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 3)
        .toUpperCase()
    : 'HUD'

  // Scroll listener for sticky background styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live 24-hour HH:MM:SS clock in personalInfo.timezone
  useEffect(() => {
    const timeZone = personalInfo.timezone || 'Asia/Kolkata'
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const updateClock = () => {
      setTimeString(formatter.format(new Date()))
    }

    updateClock()
    const clockInterval = setInterval(updateClock, 1000)
    return () => clearInterval(clockInterval)
  }, [])

  // Status line cycling every 3.5 seconds
  useEffect(() => {
    const lines = heroContent.statusLines || []
    if (lines.length <= 1) return

    const statusInterval = setInterval(() => {
      setActiveStatusIndex((prev) => (prev + 1) % lines.length)
    }, 3500)

    return () => clearInterval(statusInterval)
  }, [])

  const isBarActive = isScrolled || mobileMenuOpen

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[64px] transition-all duration-300 ${
        isBarActive
          ? 'bg-ink/80 backdrop-blur-md border-b border-bone/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 md:px-10">
        {/* Left: Brand Initials Badge & Brand Name */}
        <a
          href="#home"
          className="group flex items-center gap-3"
          aria-label={`${personalInfo.brandName} - Return to top`}
        >
          <div className="flex h-8 w-8 items-center justify-center border border-signal font-mono text-xs font-semibold text-signal transition-transform group-hover:scale-105">
            {initials}
          </div>
          <span className="hidden sm:inline font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors group-hover:text-signal">
            {personalInfo.brandName}
          </span>
        </a>

        {/* Centre: Pulsing Signal Dot & Rotating Status Line (lg and up only) */}
        {heroContent.statusLines && heroContent.statusLines.length > 0 && (
          <div
            className="hidden lg:flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-dim"
            aria-live="polite"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_6px_#ff5b1f] animate-pulse" />
            <span className="transition-opacity duration-300">
              {heroContent.statusLines[activeStatusIndex]}
            </span>
          </div>
        )}

        {/* Right: Navigation Links & Live Timezone Clock (md and up) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <nav className="flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone/70 transition-colors hover:text-signal"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* 24-hour live clock */}
          <div
            className="font-mono text-xs tabular-nums text-dim border-l border-bone/10 pl-6 lg:pl-8 select-none"
            title={personalInfo.timezone}
          >
            {timeString || '--:--:--'}
          </div>
        </div>

        {/* Mobile: Menu / Close Text Button (below md) */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
            className="font-mono text-xs uppercase tracking-[0.18em] text-bone transition-colors hover:text-signal focus:outline-none"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="md:hidden absolute top-[64px] inset-x-0 border-b border-bone/10 bg-ink/95 backdrop-blur-md px-5 py-6 animate-fadeIn"
        >
          <nav className="flex flex-col" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block border-b border-bone/10 py-4 text-2xl font-semibold text-bone transition-colors hover:text-signal"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-6 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-dim">
            <span>{personalInfo.city}</span>
            <span title={personalInfo.timezone} className="tabular-nums text-bone">
              {timeString}
            </span>
          </div>
        </div>
      )}
    </header>
  )
}
