import { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { unlock, setMuted, scrollWhoosh } from '../../lib/soundEngine'

/*
 * Fixed 🔊/🔇 toggle. Also owns the engine lifecycle:
 *  - unlocks Web Audio on the first user gesture (browser autoplay policy)
 *  - feeds Lenis scroll velocity into the whoosh loop
 * Preference persists in localStorage.
 */
export default function SoundToggle() {
  const soundOn = useStore((s) => s.soundOn)
  const toggleSound = useStore((s) => s.toggleSound)

  useEffect(() => {
    const arm = () => {
      unlock()
      setMuted(!useStore.getState().soundOn)
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
      window.removeEventListener('wheel', arm)
      window.removeEventListener('touchstart', arm)
    }
    window.addEventListener('pointerdown', arm)
    window.addEventListener('keydown', arm)
    window.addEventListener('wheel', arm, { passive: true })
    window.addEventListener('touchstart', arm, { passive: true })

    let raf
    const loop = () => {
      scrollWhoosh(useStore.getState().scrollVelocity)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
      window.removeEventListener('wheel', arm)
      window.removeEventListener('touchstart', arm)
    }
  }, [])

  const onToggle = () => {
    unlock()
    const next = !soundOn
    toggleSound()
    setMuted(!next)
  }

  return (
    <button
      onClick={onToggle}
      aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
      title={soundOn ? 'Sound: on' : 'Sound: off'}
      className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-space-grad bg-space-deep/80 text-base backdrop-blur transition hover:border-plasma-mid hover:shadow-[0_0_18px_rgba(34,211,238,0.4)]"
    >
      {soundOn ? '🔊' : '🔇'}
    </button>
  )
}
