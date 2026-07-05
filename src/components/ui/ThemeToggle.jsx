import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import { THEMES, THEME_ORDER } from '../../lib/themes'
import { sfx } from '../../lib/soundEngine'

/*
 * Theme picker — with six palettes, cycling is tedious, so the button now
 * opens a popover: one split-accent dot per theme, current one highlighted.
 * Closes on selection, outside click, or Escape. The trigger dot always
 * shows the CURRENT theme's accents.
 */
export default function ThemeToggle() {
  const themeId = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = THEMES[themeId]

  return (
    <div ref={ref} className="fixed bottom-[4.6rem] right-5 z-50 flex flex-col items-end gap-2">
      {open && (
        <div
          role="menu"
          aria-label="Theme picker"
          className="flex flex-col gap-1 rounded-xl border border-space-grad bg-space-deep/90 p-2 shadow-[0_0_24px_rgb(var(--accent)/0.15)] backdrop-blur"
        >
          {THEME_ORDER.map((id) => {
            const t = THEMES[id]
            const active = id === themeId
            return (
              <button
                key={id}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  sfx.click()
                  setTheme(id)
                  setOpen(false)
                }}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 font-code text-[10px] tracking-widest transition ${
                  active
                    ? 'bg-space-mid/70 text-plasma'
                    : 'text-white/60 hover:bg-space-mid/40 hover:text-plasma'
                }`}
              >
                <span
                  className={`block h-3.5 w-3.5 rounded-full border ${active ? 'border-plasma' : 'border-white/20'}`}
                  style={{ background: `linear-gradient(135deg, ${t.accent} 50%, ${t.accent2} 50%)` }}
                />
                {t.label}
                {active && <span aria-hidden="true">◉</span>}
              </button>
            )
          })}
        </div>
      )}
      <button
        onClick={() => {
          sfx.click()
          setOpen((o) => !o)
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose theme"
        title={`Theme: ${current.label}`}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-space-grad bg-space-deep/80 backdrop-blur transition hover:border-plasma-mid hover:shadow-[0_0_18px_rgb(var(--accent2)/0.4)]"
      >
        <span
          className="block h-4 w-4 rounded-full border border-white/20"
          style={{ background: `linear-gradient(135deg, ${current.accent} 50%, ${current.accent2} 50%)` }}
        />
      </button>
    </div>
  )
}
