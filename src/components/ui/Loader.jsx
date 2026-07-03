import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'

/** Themed loading screen: "⚡ Initializing launch sequence…" with a plasma progress bar. */
export default function Loader() {
  const { progress, active } = useProgress()
  const blocks = Math.round(progress / 12.5)
  const bar = '█'.repeat(blocks) + '░'.repeat(8 - blocks)
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-space-deep font-code"
        >
          <p className="text-plasma text-sm md:text-base">
            ⚡ Initializing launch sequence… [{bar}] {Math.round(progress)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
