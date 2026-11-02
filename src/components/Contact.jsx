import { useState, useRef, useEffect } from 'react'
import { personalInfo, socialLinks, contactContent, emailjsConfig } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

export default function Contact() {
  const formRef = useRef(null)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null

  // Extract first name for the terminal prompt
  const firstName = (personalInfo.name || '').trim().split(' ')[0].toLowerCase() || 'operator'

  // Auto-clear status feedback after ~4 seconds
  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => {
      setStatus(null)
    }, 4000)
    return () => clearTimeout(timer)
  }, [status])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)

    const form = formRef.current
    if (!form) return

    const { serviceId, templateId, publicKey } = emailjsConfig
    const isConfigured = Boolean(
      serviceId &&
      templateId &&
      publicKey &&
      serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
      templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
      publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY'
    )

    if (!isConfigured) {
      // Fallback: open mailto link with encoded payload
      const formData = new FormData(form)
      const name = formData.get('user_name') || ''
      const email = formData.get('user_email') || ''
      const message = formData.get('message') || ''

      const subject = encodeURIComponent('Portfolio contact')
      const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`)

      window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`, '_blank')
      setStatus('success')
      form.reset()
      setIsSending(false)
      return
    }

    try {
      const emailjs = await import('@emailjs/browser')
      await emailjs.sendForm(serviceId, templateId, form, publicKey)
      setStatus('success')
      form.reset()
    } catch (err) {
      console.error(err)
      setStatus('error')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="contact" className="hud-grid px-5 md:px-10 py-28 md:py-40 bg-ink">
      <div className="grid max-w-[1440px] mx-auto lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* LEFT Column: Info & Links */}
        <div className="flex flex-col">
          <ScrambleText
            text={contactContent.label}
            className="block font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4"
            trigger="view"
          />

          <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] font-sans text-bone mb-6">
            {contactContent.heading}
          </h2>

          <p className="text-lg text-bone/70 max-w-md leading-relaxed font-sans mb-8">
            {contactContent.note}
          </p>

          {/* Email as mailto link with thick signal underline */}
          <a
            href={`mailto:${personalInfo.email}`}
            className="font-mono text-lg md:text-2xl text-bone underline decoration-signal decoration-2 underline-offset-8 hover:text-signal transition-colors block mb-4"
          >
            {personalInfo.email}
          </a>

          {/* Phone (only if set) */}
          {personalInfo.phone && (
            <a
              href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
              className="font-mono text-sm text-dim hover:text-bone transition-colors block mb-8"
            >
              {personalInfo.phone}
            </a>
          )}

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase text-dim hover:text-signal transition-colors"
              >
                GitHub ↗
              </a>
            )}

            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase text-dim hover:text-signal transition-colors"
              >
                LinkedIn ↗
              </a>
            )}

            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase text-dim hover:text-signal transition-colors"
              >
                Instagram ↗
              </a>
            )}
          </div>
        </div>

        {/* RIGHT Column: Terminal-style Form in .hud-frame */}
        <div className="hud-frame border border-bone/10 bg-ink/70 backdrop-blur p-6 md:p-10">
          {/* Terminal prompt header */}
          <div className="font-mono text-xs text-dim mb-8 flex items-center gap-1.5 select-none">
            <span className="text-signal font-semibold">$</span>
            <span>new message --to {firstName}</span>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Field: Name */}
            <div>
              <label
                htmlFor="user_name"
                className="block font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-1"
              >
                &gt; name
              </label>
              <input
                id="user_name"
                name="user_name"
                required
                placeholder="Your full name"
                className="w-full bg-transparent border-b border-bone/20 focus:border-signal font-mono text-sm text-bone placeholder:text-bone/30 rounded-none outline-none py-2 transition-colors"
              />
            </div>

            {/* Field: Email */}
            <div>
              <label
                htmlFor="user_email"
                className="block font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-1"
              >
                &gt; email
              </label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-transparent border-b border-bone/20 focus:border-signal font-mono text-sm text-bone placeholder:text-bone/30 rounded-none outline-none py-2 transition-colors"
              />
            </div>

            {/* Field: Message */}
            <div>
              <label
                htmlFor="message"
                className="block font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-1"
              >
                &gt; message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about the role or project…"
                className="w-full bg-transparent border-b border-bone/20 focus:border-signal font-mono text-sm text-bone placeholder:text-bone/30 rounded-none outline-none py-2 resize-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-signal text-ink font-mono text-xs font-semibold uppercase tracking-[0.25em] px-6 py-4 flex items-center justify-between hover:bg-bone transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSending ? 'Sending…' : 'Send message'}</span>
              <span>→</span>
            </button>

            {/* Status Line */}
            {status && (
              <p
                role="status"
                className={`font-mono text-xs pt-2 ${
                  status === 'success' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {status === 'success'
                  ? '✓ Message sent. Talk soon.'
                  : '✕ Something went wrong. Please try again.'}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
