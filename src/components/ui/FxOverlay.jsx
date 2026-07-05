import { useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { THEMES } from '../../lib/themes'

/*
 * 2D overlay canvas above everything, pointer-events:none. Two effects:
 *  1. glowing cursor with trailing plasma particles
 *  2. a gold comet on the right edge that races with scroll velocity
 * Skipped entirely on touch devices and under prefers-reduced-motion.
 */
export default function FxOverlay() {
  const canvasRef = useRef(null)
  const reducedMotion = useStore((s) => s.reducedMotion)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reducedMotion || coarse) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, raf
    const size = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    size()
    window.addEventListener('resize', size)

    const theme = () => THEMES[useStore.getState().theme]
    const hexToRgb = (h) => `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`
    const particles = []
    let mx = -100, my = -100
    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      particles.push({
        x: mx, y: my,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        life: 1,
        gold: Math.random() < 0.18,
      })
      if (particles.length > 70) particles.shift()
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let cometY = H * 0.5
    let novaFlash = 0
    let novaSeqSeen = useStore.getState().novaSeq
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // supernova screen flash
      const seqNow = useStore.getState().novaSeq
      if (seqNow !== novaSeqSeen) {
        novaSeqSeen = seqNow
        novaFlash = 0.5
      }
      if (novaFlash > 0.01) {
        ctx.fillStyle = `rgba(${hexToRgb(theme().accent)},${novaFlash * 0.5})`
        ctx.fillRect(0, 0, W, H)
        novaFlash *= 0.88
      }

      // cursor glow
      if (mx > 0) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 26)
        const ac = hexToRgb(theme().accent)
        g.addColorStop(0, `rgba(${ac},0.35)`)
        g.addColorStop(1, `rgba(${ac},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(mx, my, 26, 0, 6.283); ctx.fill()
      }
      // trailing particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.life -= 0.03
        if (p.life <= 0) { particles.splice(i, 1); continue }
        ctx.globalAlpha = p.life * 0.7
        ctx.fillStyle = p.gold ? theme().gold : theme().accent
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6 * p.life + 0.4, 0, 6.283); ctx.fill()
      }
      ctx.globalAlpha = 1

      // scroll-velocity comet on the right edge
      const v = useStore.getState().scrollVelocity
      if (Math.abs(v) > 2) {
        cometY += v * 0.9
        if (cometY > H + 40) cometY = -40
        if (cometY < -40) cometY = H + 40
        const cx = W - 34
        const len = Math.min(Math.abs(v) * 3.2, 130) * Math.sign(v)
        const gc = hexToRgb(theme().gold)
        const grad = ctx.createLinearGradient(cx, cometY - len, cx, cometY)
        grad.addColorStop(0, `rgba(${gc},0)`)
        grad.addColorStop(1, `rgba(${gc},0.75)`)
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(cx, cometY - len); ctx.lineTo(cx, cometY); ctx.stroke()
        ctx.fillStyle = theme().gold
        ctx.beginPath(); ctx.arc(cx, cometY, 2.4, 0, 6.283); ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  )
}
