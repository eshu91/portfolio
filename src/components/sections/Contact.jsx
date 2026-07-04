import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../../data/profile'
import { socials } from '../../data/socials'
import Magnetic from '../ui/Magnetic'

/*
 * Transmission sector. The form uses a mailto fallback out of the box —
 * zero backend, works on Vercel immediately. To upgrade to EmailJS:
 * `npm i @emailjs/browser`, then swap the submit handler for
 * emailjs.send(SERVICE_ID, TEMPLATE_ID, { name, email, message }).
 */
const SOCIAL_ICONS = { github: '⌥', linkedin: 'in', email: '✉' }

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const transmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Transmission from ${form.name || 'a visitor'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}${form.email ? ` · ${form.email}` : ''}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  const inputCls =
    'w-full rounded-md border border-space-grad bg-space-deep/70 px-3 py-2.5 font-code text-[13px] text-white placeholder-white/30 outline-none transition focus:border-plasma-mid focus:shadow-[0_0_14px_rgba(34,211,238,0.3)]'

  return (
    <section id="contact" className="dom-layer flex min-h-screen flex-col px-6 pt-24">
      <div className="mx-auto w-full max-w-lg flex-1">
        <h2 className="text-center font-code text-sm tracking-[0.3em] text-plasma md:text-base">
          📡 TRANSMISSION
        </h2>
        <p className="mt-3 text-center text-[13px] leading-relaxed text-white/60">
          Open to cloud roles, Flutter collaborations, and AI automation projects.
          Signals answered from Itahari, Nepal 🇳🇵 — usually within one orbit.
        </p>

        <motion.form
          onSubmit={transmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="scanlines relative mt-8 space-y-4 rounded-xl border border-plasma-mid/40 bg-space-deep/75 p-6 backdrop-blur-md"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input aria-label="Your name" className={inputCls} placeholder="call sign (name)" value={form.name} onChange={set('name')} />
            <input aria-label="Your email" type="email" className={inputCls} placeholder="return frequency (email)" value={form.email} onChange={set('email')} />
          </div>
          <textarea
            aria-label="Your message"
            rows={4}
            className={inputCls}
            placeholder="your transmission…"
            value={form.message}
            onChange={set('message')}
            required
          />
          <div className="flex justify-center pt-1">
            <Magnetic>
              <button
                type="submit"
                className="rounded-full border border-plasma bg-space-mid px-7 py-2.5 font-code text-[12px] tracking-[0.2em] text-plasma transition hover:shadow-[0_0_26px_rgba(103,232,249,0.5)]"
              >
                SEND TRANSMISSION ⚡
              </button>
            </Magnetic>
          </div>
        </motion.form>

        <div className="mt-8 flex justify-center gap-4">
          {socials.map((s) => (
            <Magnetic key={s.id} strength={0.25}>
              <a
                href={s.url}
                target={s.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-space-grad font-code text-sm text-plasma-mid transition hover:border-plasma hover:text-plasma hover:shadow-[0_0_18px_rgba(103,232,249,0.45)]"
                aria-label={s.label}
                title={s.label}
              >
                {SOCIAL_ICONS[s.id] || '◈'}
              </a>
            </Magnetic>
          ))}
        </div>
      </div>

      <footer className="mt-16 border-t border-space-grad/60 py-6 text-center font-code text-[11px] tracking-wider text-white/50">
        Made with <span className="text-plasma">⚡</span> from Nepal 🇳🇵 · © {new Date().getFullYear()} <span className="text-plasma">SNova</span>
      </footer>
    </section>
  )
}
