import { skills, asteroidBelts } from '../../data/skills'
import { useStore } from '../../store/useStore'
import { useMediaQuery } from '../../hooks/useMediaQuery'

/*
 * Solar System sector. Desktop + motion: a tall, mostly-transparent scroll
 * runway — the 3D system takes the stage, this layer only supplies the
 * heading and interaction hint. Reduced-motion / mobile: the same skills.js
 * data rendered as a 2-column fallback grid (progressive enhancement).
 */
function FallbackGrid() {
  return (
    <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
      {skills.map((s) => (
        <div key={s.id} className="rounded-lg border border-space-grad bg-space-mid/40 p-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
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
      {fallback && <FallbackGrid />}
    </section>
  )
}
