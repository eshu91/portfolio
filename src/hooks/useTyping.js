import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

/** Fira Code typing effect over an array of strings. Static first string if reduced motion. */
export function useTyping(lines, { typeMs = 70, deleteMs = 32, holdMs = 1400 } = {}) {
  const reducedMotion = useStore((s) => s.reducedMotion)
  const [text, setText] = useState(reducedMotion ? lines[0] : '')

  useEffect(() => {
    if (reducedMotion) return
    let line = 0, char = 0, deleting = false, timer
    const tick = () => {
      const current = lines[line]
      if (!deleting) {
        char++
        setText(current.slice(0, char))
        if (char === current.length) { deleting = true; timer = setTimeout(tick, holdMs); return }
        timer = setTimeout(tick, typeMs)
      } else {
        char--
        setText(current.slice(0, char))
        if (char === 0) { deleting = false; line = (line + 1) % lines.length }
        timer = setTimeout(tick, deleteMs)
      }
    }
    timer = setTimeout(tick, typeMs)
    return () => clearTimeout(timer)
  }, [lines, reducedMotion, typeMs, deleteMs, holdMs])

  return text
}
