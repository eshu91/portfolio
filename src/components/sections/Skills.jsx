import { skills, asteroidBelts } from '../../data/skills'
import { useStore } from '../../store/useStore'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { THEMES, mapColor } from '../../lib/themes'
import { sfx } from '../../lib/soundEngine'
import { useEffect } from 'react'

/*
 * Solar System sector. Desktop + motion: a tall, mostly-transparent scroll
 * runway — the 3D system takes the stage, this layer only supplies the
 * heading and interaction hint. Reduced-motion / mobile: the same skills.js
 * data rendered as a 2-column fallback grid (progressive enhancement).
 */
function FallbackGrid() {
  const theme = useStore((s) => THEMES[s.theme])
  return (
    <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
      {skills.map((s) => (
        <div key={s.id} className="rounded-lg border border-space-grad bg-space-mid/40 p-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: mapColor(theme, s.color) }} />
            <p className="font-code text-sm text-white">{s.label}</p>
          </div>
          <p className="mt-1 font-code text-[11px] text-stargold">{s.level}</p>
          <p className="mt-2 font-code text-[11px] leading-relaxed text-white/70">
            {[s.label, ...s.moons].join(' → ')}
          </p>
        </div>
      ))}
      {asteroidBelts.map((b) => (
        <div key={b.id} className="rounded-lg border border-space-grad bg-space-mid/40 p-4">
          <p className="font-code text-sm text-plasma">🪨 {b.label}</p>
          <p className="mt-2 font-code text-[11px] leading-relaxed text-white/70">
            {b.tools.join(' · ')}
          </p>
        </div>
      ))}
    </div>
  )
}

/*
 * Keyboard access for the 3D planets: visually-hidden buttons (one per
 * planet) that become a visible HUD chip on focus. Tabbing to one scrolls
 * the browser into the Skills sector (the camera follows the scroll rig),
 * pauses that planet's orbit and shows its card; Enter/Space docks and
 * releases; Escape releases from anywhere.
 */
function PlanetKeyboardNav() {
  const hoveredSkill = useStore((s) => s.hoveredSkill)
  const focusedSkill = useStore((s) => s.focusedSkill)
  const setHoveredSkill = useStore((s) => s.setHoveredSkill)
  const setFocusedSkill = useStore((s) => s.setFocusedSkill)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && useStore.getState().focusedSkill) {
        sfx.release()
        setFocusedSkill(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setFocusedSkill])

  return (
    <ul aria-label="Skill planets — keyboard navigation" className="pointer-events-auto">
      {skills.map((sk) => {
        const docked = focusedSkill === sk.id
        return (
          <li key={sk.id}>
            <button
              className="planet-key font-code"
              aria-pressed={docked}
              onFocus={() => setHoveredSkill(sk.id)}
              onBlur={() => {
                if (useStore.getState().hoveredSkill === sk.id) setHoveredSkill(null)
              }}
              onClick={() => {
                docked ? sfx.release() : sfx.dock()
                setFocusedSkill(docked ? null : sk.id)
              }}
            >
              ◉ {sk.label} · {sk.level} · {[sk.label, ...sk.moons].join(' → ')} ·{' '}
              {docked ? 'docked — Enter to release, Esc anytime' : 'Enter to dock'}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default function Skills() {
  const reducedMotion = useStore((s) => s.reducedMotion)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const fallback = reducedMotion || isMobile

  return (
    <section id="skills" className={`dom-layer px-6 ${fallback ? 'min-h-screen py-24' : 'h-[200vh]'}`}>
      <div className={fallback ? '' : 'sticky top-0 flex h-screen flex-col items-center pt-16 pointer-events-none'}>
        <h2 className="font-code text-plasma tracking-[0.3em] text-sm md:text-base text-center">
          🪐 THE SNOVA SYSTEM
        </h2>
        <p className="mt-2 text-center font-code text-[11px] text-white/50">
          {fallback
            ? 'ecosystems and their dependency chains'
            : 'hover a planet to pause its orbit · click to dock'}
        </p>
      </div>
      {fallback ? <FallbackGrid /> : <PlanetKeyboardNav />}
    </section>
  )
}
