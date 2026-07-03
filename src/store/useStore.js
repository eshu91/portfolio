import { create } from 'zustand'

/**
 * Global scene state.
 * quality: 'high' | 'low' — decided once at boot from device signals.
 * reducedMotion: user preference; freezes orbits, twinkle and camera flights.
 */
function detectQuality() {
  if (typeof navigator === 'undefined') return 'high'
  const cores = navigator.hardwareConcurrency || 4
  const dpr = window.devicePixelRatio || 1
  const coarse = window.matchMedia('(pointer: coarse)').matches
  if (cores <= 4 || (coarse && dpr > 2)) return 'low'
  return 'high'
}

export const useStore = create((set) => ({
  quality: detectQuality(),
  reducedMotion:
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  activeSection: 'hero',
  setActiveSection: (id) => set({ activeSection: id }),
}))
