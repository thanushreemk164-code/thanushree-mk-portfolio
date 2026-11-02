import { personalInfo, socialLinks, navLinks, footerContent, academy } from '../data/portfolioData'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Filter non-empty social links
  const activeSocials = [
    { label: 'GitHub ↗', url: socialLinks.github },
    { label: 'LinkedIn ↗', url: socialLinks.linkedin },
    { label: 'Instagram ↗', url: socialLinks.instagram },
  ].filter((item) => Boolean(item.url))

  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 md:px-10 pt-16 pb-8 bg-ink">
      <div className="max-w-[1440px] mx-auto">
        {/* Three Columns on md+ (stacked on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          {/* Column 1: Navigate */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-4">
              Navigate
            </div>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-mono text-xs uppercase tracking-wider text-bone/75 hover:text-signal transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Elsewhere */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-4">
              Elsewhere
            </div>
            <ul className="space-y-2.5">
              {activeSocials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-wider text-bone/75 hover:text-signal transition-colors"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Say hello */}
          <div className="md:text-right flex flex-col md:items-end">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-4">
              Say hello
            </div>
            <a
              href={`mailto:${personalInfo.email}`}
              className="font-mono text-xs text-bone/75 hover:text-signal transition-colors mb-1"
            >
              {personalInfo.email}
            </a>
            <span className="font-mono text-xs text-dim">
              {personalInfo.city}
            </span>
          </div>
        </div>

        {/* Huge Faint Watermark */}
        <div
          aria-hidden="true"
          className="text-center my-6 select-none uppercase font-bold leading-none tracking-[-0.05em] whitespace-nowrap text-[13.5vw] text-bone/[0.07]"
        >
          {personalInfo.brandName}
        </div>

        {/* Bottom Row */}
        <div className="border-t border-bone/10 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-dim flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            © {currentYear} {personalInfo.name} · {footerContent.tagline}
          </div>

          <div>
            Trained at{' '}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-bone hover:text-signal transition-colors font-medium"
            >
              {academy.name}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
