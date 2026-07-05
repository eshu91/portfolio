import { useStore } from "../../store/useStore";
import { THEMES, THEME_ORDER } from "../../lib/themes";
import { sfx } from "../../lib/soundEngine";

/*
 * Palette switcher - cycles the THEME_ORDER list (Plasma Cyan ⇄ Cyberpunk
 * Void). The button shows the *next* theme's two accents as a split dot,
 * so it doubles as a preview. Sits above the sound toggle.
 * Everything retints live: CSS variables handle the DOM, and every 3D
 * material/shader subscribes to the store.
 */
export default function ThemeToggle() {
  const themeId = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const idx = THEME_ORDER.indexOf(themeId);
  const nextId = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
  const next = THEMES[nextId];

  const onToggle = () => {
    sfx.click();
    setTheme(nextId);
  };

  return (
    <button
      onClick={onToggle}
      aria-label={`Switch theme to ${next.label}`}
      title={`Theme: ${THEMES[themeId].label} → ${next.label}`}
      className="fixed bottom-[4.6rem] right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-space-grad bg-space-deep/80 backdrop-blur transition hover:border-plasma-mid hover:shadow-[0_0_18px_rgb(var(--accent2)/0.4)]"
    >
      <span
        className="block h-4 w-4 rounded-full border border-white/20"
        style={{
          background: `linear-gradient(135deg, ${next.accent} 50%, ${next.accent2} 50%)`,
        }}
      />
    </button>
  );
}
