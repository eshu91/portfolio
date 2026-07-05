import { motion } from 'framer-motion'
import { profile } from '../../data/profile'
import { useTyping } from '../../hooks/useTyping'
import Magnetic from '../ui/Magnetic'
import { sfx } from '../../lib/soundEngine'

/*
 * Launch sector — the DOM layer floating over the SNova scene.
 * All copy comes from data/profile.js.
 */
export default function Hero() {
  const typed = useTyping(profile.roles)

  return (
    <section id="hero" className="dom-layer min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-code text-plasma-mid tracking-[0.3em] text-[10px] md:text-xs mb-3"
      >
        {profile.name.toUpperCase()} // {profile.alias.toUpperCase()}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="font-display font-bold text-3xl md:text-5xl text-white drop-shadow-[0_0_18px_rgba(103,232,249,0.3)]"
      >
        {profile.alias}
      </motion.h1>

      <p className="font-code text-plasma mt-4 h-6 text-sm md:text-base" aria-live="polite">
        {typed}<span className="text-stargold animate-pulse">▌</span>
      </p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white/60 max-w-sm mt-3 text-[12px] md:text-[13px]"
      >
        {profile.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-wrap justify-center gap-3 mt-8"
      >
        <Magnetic><a
          onClick={() => sfx.click()}
          href="#skills"
          className="font-code text-[11px] px-5 py-2.5 rounded-full border border-plasma-mid text-plasma hover:bg-space-mid hover:shadow-[0_0_20px_rgba(34,211,238,0.45)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma"
        >
          Explore my universe
        </a></Magnetic>
        <Magnetic><a
          onClick={() => sfx.click()}
          href="/resume.pdf"
          className="font-code text-[11px] px-5 py-2.5 rounded-full border border-space-grad text-white/70 hover:text-plasma hover:border-plasma-mid transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma"
        >
          Download résumé
        </a></Magnetic>
      </motion.div>
    </section>
  )
}
