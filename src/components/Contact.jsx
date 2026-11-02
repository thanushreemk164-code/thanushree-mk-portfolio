import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { personalInfo, contactContent, socialLinks, emailjsConfig } from '../data/portfolioData'

export default function Contact() {
  const sectionRef = useRef(null)
  const formRef = useRef(null)

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('.contact-anim', {
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

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ state: 'sending', message: 'TRANSMITTING SIGNAL...' })

    // If EmailJS keys have not been configured yet, give friendly fallback guidance
    if (
      !emailjsConfig.serviceId ||
      emailjsConfig.serviceId.includes('YOUR_') ||
      !emailjsConfig.publicKey ||
      emailjsConfig.publicKey.includes('YOUR_')
    ) {
      window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(formState.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`From: ${formState.name} (${formState.email})\n\n${formState.message}`)}`
      setStatus({
        state: 'success',
        message: 'Opened your mail client to send directly to ' + personalInfo.email,
      })
      return
    }

    try {
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          from_name: formState.name,
          reply_to: formState.email,
          subject: formState.subject,
          message: formState.message,
          to_name: personalInfo.name,
        },
        emailjsConfig.publicKey
      )

      setStatus({ state: 'success', message: 'TRANSMISSION COMPLETE. I will reply soon.' })
      setFormState({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus({
        state: 'error',
        message: 'TRANSMISSION FAILED. Please email directly at ' + personalInfo.email,
      })
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative border-t border-bone/10 py-24 px-4 sm:px-6 lg:px-8 bg-ink"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="contact-anim mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-signal mb-2">
            // {contactContent.label}
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-bone">
            {contactContent.heading}
          </h2>
          <p className="font-sans text-base sm:text-lg text-dim mt-4 max-w-xl">
            {contactContent.note}
          </p>
        </div>

        {/* Grid: Direct Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Direct channels */}
          <div className="contact-anim lg:col-span-5 space-y-6">
            <div className="hud-frame border border-bone/10 bg-panel/60 p-6 space-y-6">
              <div className="font-mono text-xs uppercase tracking-widest text-signal pb-2 border-b border-bone/10">
                // DIRECT_COMM_CHANNELS
              </div>

              {/* Email */}
              <div>
                <div className="font-mono text-[11px] text-bone/40 uppercase">Email Address</div>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="font-mono text-sm text-bone hover:text-signal transition-colors block mt-1"
                >
                  {personalInfo.email}
                </a>
              </div>

              {/* Phone */}
              {personalInfo.phone && (
                <div>
                  <div className="font-mono text-[11px] text-bone/40 uppercase">Phone Line</div>
                  <a
                    href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                    className="font-mono text-sm text-bone hover:text-signal transition-colors block mt-1"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              )}

              {/* City / Base */}
              <div>
                <div className="font-mono text-[11px] text-bone/40 uppercase">Base Station</div>
                <div className="font-mono text-sm text-bone mt-1">{personalInfo.city}</div>
              </div>

              {/* Social links */}
              <div className="pt-4 border-t border-bone/10 flex items-center gap-4">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs uppercase tracking-wider text-dim hover:text-bone transition-colors"
                  >
                    GitHub ↗
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs uppercase tracking-wider text-dim hover:text-bone transition-colors"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="contact-anim lg:col-span-7">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="hud-frame border border-bone/10 bg-panel/70 p-6 sm:p-8 space-y-6"
            >
              <div className="font-mono text-xs uppercase tracking-widest text-signal pb-2 border-b border-bone/10 flex justify-between items-center">
                <span>// SEND_TRANSMISSION</span>
                <span className="text-[10px] text-bone/40">SECURE_CHANNEL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-dim mb-2">
                    Operator Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full border border-bone/10 bg-ink px-4 py-3 font-mono text-xs text-bone placeholder-bone/30 focus:border-signal focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-dim mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full border border-bone/10 bg-ink px-4 py-3 font-mono text-xs text-bone placeholder-bone/30 focus:border-signal focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-dim mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  placeholder="Data Analyst Opportunity / Project"
                  className="w-full border border-bone/10 bg-ink px-4 py-3 font-mono text-xs text-bone placeholder-bone/30 focus:border-signal focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-dim mb-2">
                  Message Payload *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell me about your team, role, or data requirements..."
                  className="w-full border border-bone/10 bg-ink px-4 py-3 font-mono text-xs text-bone placeholder-bone/30 focus:border-signal focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status.state === 'sending'}
                className="w-full border border-signal bg-signal/15 py-3.5 font-mono text-xs uppercase tracking-widest text-bone hover:bg-signal hover:text-ink transition-colors disabled:opacity-50"
              >
                {status.state === 'sending' ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE →'}
              </button>

              {status.state !== 'idle' && (
                <div
                  className={`p-3 font-mono text-xs border ${status.state === 'error' ? 'border-red-500/30 text-red-400 bg-red-950/20' : 'border-signal/30 text-signal bg-signal/5'}`}
                >
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
