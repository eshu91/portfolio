import { useEffect } from 'react'
import { useStore } from '../store/useStore'

/**
 * Easter-egg keyboard trigger: typing "snova" anywhere (outside form
 * fields) detonates the supernova. The click path lives on the star
 * itself in SNovaStar.jsx.
 */
export function useNovaTrigger() {
  const triggerNova = useStore((s) => s.triggerNova)
  useEffect(() => {
    let buffer = ''
    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-5)
      if (buffer === 'snova') {
        buffer = ''
        triggerNova()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [triggerNova])
}
