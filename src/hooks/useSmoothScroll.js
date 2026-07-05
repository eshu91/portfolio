import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger scrubbing
 * (CameraRig waypoints) stays perfectly in sync. Scroll velocity is pushed
 * into the store to drive chromatic aberration on section transitions.
 * Skipped entirely under prefers-reduced-motion → native scroll.
 */
export function useSmoothScroll() {
  const reducedMotion = useStore((s) => s.reducedMotion)
  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    window.__lenis = lenis // used by SectorRail for click-to-fly
    lenis.on('scroll', (e) => {
      ScrollTrigger.update()
      useStore.getState().setScrollVelocity(e.velocity)
    })
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      delete window.__lenis
    }
  }, [reducedMotion])
}
