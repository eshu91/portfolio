import { create } from 'zustand'

/**
 * Global scene state.
 * quality: 'high' | 'low' — decided once at boot from device signals.
 * reducedMotion: user preference; freezes orbits, twinkle and camera flights.
 * hoveredSkill / focusedSkill: solar-system interaction state.
 * scrollVelocity: fed by Lenis, drives chromatic aberration on transitions.
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
  hoveredSkill: null,
  setHoveredSkill: (id) => set({ hoveredSkill: id }),
  focusedSkill: null,
  setFocusedSkill: (id) => set({ focusedSkill: id }),
  scrollVelocity: 0,
  setScrollVelocity: (v) => set({ scrollVelocity: v }),
  novaSeq: 0, // increments each supernova trigger; listeners react to changes
  triggerNova: () => set((s) => ({ novaSeq: s.novaSeq + 1 })),
  theme:
    (typeof window !== 'undefined' && window.localStorage.getItem('snova-theme')) ||
    'plasma',
  setTheme: (t) => {
    window.localStorage.setItem('snova-theme', t)
    document.documentElement.dataset.theme = t
    set({ theme: t })
  },
  soundOn:
    typeof window !== 'undefined' &&
    window.localStorage.getItem('snova-sound') !== 'off',
  toggleSound: () =>
    set((s) => {
      const next = !s.soundOn
      window.localStorage.setItem('snova-sound', next ? 'on' : 'off')
      return { soundOn: next }
    }),
}))

// apply the persisted theme to <html> before first paint of the app tree
if (typeof document !== 'undefined') {
  document.documentElement.dataset.theme = useStore.getState().theme
}
