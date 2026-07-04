import { roadmap } from "../../data/roadmap";
import { useStore } from "../../store/useStore";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/*
 * Trajectory Map sector. Desktop + motion: transparent runway - the 3D
 * constellation below the solar plane is the content. Reduced-motion /
 * mobile: the same roadmap.js data as a vertical fallback timeline.
 */
function statusMeta(status) {
  if (status === "done") return { icon: "✓", color: "#67E8F9" };
  if (status === "current") return { icon: "⟳", color: "#F8D866" };
  return { icon: "◈", color: "#0e5268" };
}

function FallbackTimeline() {
  return (
    <ol className="mx-auto mt-10 max-w-md space-y-5 border-l border-space-grad pl-6">
      {roadmap.map((m) => {
        const s = statusMeta(m.status);
        return (
          <li key={`${m.year}-${m.title}`} className="relative">
            <span
              className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full"
              style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
            />
            <p
              className="font-code text-[11px] tracking-widest"
              style={{ color: s.color }}
            >
              ⟪ {m.year} ⟫ {s.icon}
            </p>
            <p className="mt-0.5 text-sm text-white/90">{m.title}</p>
            <p className="text-[12px] text-white/50">{m.detail}</p>
          </li>
        );
      })}
    </ol>
  );
}

export default function Roadmap() {
  const reducedMotion = useStore((s) => s.reducedMotion);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const fallback = reducedMotion || isMobile;

  return (
    <section
      id="roadmap"
      className={`dom-layer px-6 ${fallback ? "min-h-screen py-24" : "h-[150vh]"}`}
    >
      <div
        className={
          fallback
            ? ""
            : "sticky top-0 flex h-screen flex-col items-center pt-16 pointer-events-none"
        }
      >
        <h2 className="text-center font-code text-sm tracking-[0.3em] text-plasma md:text-base">
          🌠 TRAJECTORY MAP
        </h2>
        <p className="mt-2 text-center font-code text-[11px] text-white/50">
          {fallback
            ? "flight path so far - and where the ship is headed"
            : "the constellation below charts the flight path"}
        </p>
      </div>
      {fallback && <FallbackTimeline />}
    </section>
  );
}
