import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../store/useStore'
import { sfx } from '../../lib/soundEngine'

gsap.registerPlugin(ScrollTrigger)

/*
 * Sector Navigation HUD — the flight-progress rail on the right edge.
 * ScrollTrigger marks whichever section spans the viewport center as
 * active (finally putting store.activeSection to work). Passed sectors
 * fill #22D3EE, the active node enlarges in plasma with a pulsing glow
 * and a visible label, upcoming ones stay hollow; labels appear on
 * hover. Clicking flies there via Lenis. Hidden below md.
 */
const SECTORS = [
  { id: 'hero', label: 'LAUNCH' },
  { id: 'about', label: 'OBSERVATORY' },
  { id: 'skills', label: 'SYSTEM' },
  { id: 'projects', label: 'STATIONS' },
  { id: 'roadmap', label: 'TRAJECTORY' },
  { id: 'contact', label: 'TRANSMISSION' },
]

export default function SectorRail() {
  const active = useStore((s) => s.activeSection)
  const setActiveSection = useStore((s) => s.setActiveSection)

  useEffect(() => {
    const triggers = SECTORS.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => self.isActive && setActiveSection(id),
      })
    )
    return () => triggers.forEach((t) => t.kill())
  }, [setActiveSection])

  const idx = Math.max(0, SECTORS.findIndex((s) => s.id === active))

  const fly = (id) => {
    sfx.click()
    const lenis = window.__lenis
    if (lenis) lenis.scrollTo(`#${id}`, { duration: 2 })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav aria-label="Sector navigation" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <div className="relative flex flex-col items-end">
        {/* track + progress fill */}
        <div className="absolute bottom-3 right-[5px] top-3 w-[2px] bg-space-grad/70" />
        <div
          className="absolute right-[5px] top-3 w-[2px] bg-gradient-to-b from-plasma to-plasma-mid shadow-[0_0_8px_rgba(103,232,249,0.6)] transition-all duration-700"
          style={{ height: `calc(${(idx / (SECTORS.length - 1)) * 100}% - ${(idx / (SECTORS.length - 1)) * 24}px)` }}
        />
        {SECTORS.map((s, i) => {
          const isActive = s.id === active
          const passed = i < idx
          return (
            <button
              key={s.id}
              onClick={() => fly(s.id)}
              aria-label={`Fly to ${s.label}`}
              aria-current={isActive ? 'true' : undefined}
              className="group relative flex items-center gap-2.5 py-2.5"
            >
              <span
                className={`whitespace-nowrap font-code text-[9px] tracking-[0.2em] transition ${
                  isActive
                    ? 'rounded border border-plasma/50 bg-space-deep/85 px-2 py-1 text-plasma shadow-[0_0_14px_rgba(103,232,249,0.3)]'
                    : 'text-transparent group-hover:text-white/60'
                }`}
              >
                {isActive ? `◉ ${s.label}` : s.label}
              </span>
              <span
                className={`relative rounded-full transition-all duration-300 ${
                  isActive
                    ? 'rail-pulse h-4 w-4 bg-plasma shadow-[0_0_16px_rgba(103,232,249,0.9)]'
                    : passed
                      ? 'h-3 w-3 bg-plasma-mid shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                      : 'h-3 w-3 border-2 border-space-grad bg-space-deep'
                }`}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
