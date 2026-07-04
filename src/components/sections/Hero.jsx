import { motion } from 'framer-motion'
import { profile } from '../../data/profile'
import { useTyping } from '../../hooks/useTyping'
import Magnetic from '../ui/Magnetic'

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
        className="font-code text-plasma-mid tracking-[0.35em] text-xs md:text-sm mb-4"
      >
        {profile.name.toUpperCase()} // {profile.alias.toUpperCase()}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="font-display font-bold text-5xl md:text-7xl text-white drop-shadow-[0_0_24px_rgba(103,232,249,0.35)]"
      >
        {profile.alias}
      </motion.h1>

      <p className="font-code text-plasma mt-5 h-7 text-base md:text-lg" aria-live="polite">
        {typed}<span className="text-stargold animate-pulse">▌</span>
      </p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white/70 max-w-md mt-4 text-sm md:text-base"
      >
        {profile.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-wrap justify-center gap-4 mt-10"
      >
        <Magnetic><a
          href="#skills"
          className="font-code text-sm px-6 py-3 rounded-full border border-plasma-mid text-plasma hover:bg-space-mid hover:shadow-[0_0_20px_rgba(34,211,238,0.45)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma"
        >
          Explore my universe
        </a></Magnetic>
        <Magnetic><a
          href="/resume.pdf"
          className="font-code text-sm px-6 py-3 rounded-full border border-space-grad text-white/70 hover:text-plasma hover:border-plasma-mid transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma"
        >
          Download résumé
        </a></Magnetic>
      </motion.div>
    </section>
  )
}
