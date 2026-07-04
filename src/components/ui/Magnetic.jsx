import { useRef } from "react";
import { useStore } from "../../store/useStore";

/**
 * Magnetic wrapper - children are gently pulled toward the cursor on hover
 * and spring back on leave. Pure transform, no reflow. Disabled under
 * prefers-reduced-motion and on touch devices.
 */
export default function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const reducedMotion = useStore((s) => s.reducedMotion);

  const onMove = (e) => {
    if (reducedMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block transition-transform duration-300 ease-out will-change-transform"
    >
      {children}
    </div>
  );
}
