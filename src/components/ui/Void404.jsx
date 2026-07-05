import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store/useStore'

/*
 * "LOST IN THE VOID" — the 404 sector. Rendered by App when the path
 * isn't '/', which the vercel.json SPA rewrite routes here. Lightweight
 * CSS starfield (no WebGL), drifting satellite, 10s auto-return home.
 */
export default function Void404() {
  const [count, setCount] = useState(10)
  const sat = useRef(null)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useEffect(() => {
    document.title = '404 — Lost in the Void · SNova'
    const timer = setInterval(() => setCount((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (count <= 0) window.location.href = '/'
  }, [count])

  useEffect(() => {
    if (reducedMotion || !sat.current) return
    let t = 0
    let raf
    const drift = () => {
      t += 0.008
      sat.current.style.transform = `translate(${Math.sin(t) * 30}px, ${Math.cos(t * 0.7) * 14}px) rotate(${Math.sin(t * 0.5) * 20}deg)`
      raf = requestAnimationFrame(drift)
    }
    raf = requestAnimationFrame(drift)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  return (
    <main className="void-stars relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-space-deep px-6 text-center font-code">
      <div className="pointer-events-none absolute inset-x-0 -top-1/3 h-4/5 bg-[radial-gradient(ellipse_at_60%_100%,rgba(14,82,104,0.4)_0%,transparent_65%)]" />
      <div ref={sat} className="absolute left-[12%] top-[18%] text-2xl opacity-80" aria-hidden="true">🛰️</div>

      <p className="relative text-[11px] tracking-[0.5em] text-plasma-mid">ERROR // SECTOR NOT FOUND</p>

      <p className="relative mt-4 font-display text-7xl font-bold text-plasma drop-shadow-[0_0_34px_rgba(103,232,249,0.55)] md:text-8xl">
        4
        <span className="relative inline-block w-[0.9em] align-baseline">
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-[0.62em] w-[0.62em] rounded-full border-[5px] border-plasma bg-space-deep shadow-[0_0_22px_rgba(103,232,249,0.6)]" />
          </span>
          <span className="absolute -left-[14%] -right-[14%] top-1/2 h-[0.3em] -translate-y-1/2 -rotate-[20deg] rounded-[50%] border-2 border-stargold opacity-90" />
          &nbsp;
        </span>
        4
      </p>

      <p className="relative mt-4 text-base tracking-[0.35em] text-white">LOST IN THE VOID</p>
      <p className="relative mt-3 max-w-sm text-[12px] leading-relaxed text-white/50">
        Telemetry shows no page at these coordinates. The transmission may have been
        moved, renamed, or swallowed by a black hole.
      </p>

      <a
        href="/"
        className="relative mt-6 inline-block rounded-full border border-plasma px-6 py-2.5 text-[11px] tracking-[0.2em] text-plasma shadow-[0_0_18px_rgba(103,232,249,0.25)] transition hover:bg-space-mid hover:shadow-[0_0_28px_rgba(103,232,249,0.5)]"
      >
        ⟵ RETURN TO BASE
      </a>

      <p className="relative mt-5 text-[10px] text-white/30">
        auto-navigation home in <span className="text-stargold">{Math.max(count, 0)}</span>s
      </p>
    </main>
  )
}
