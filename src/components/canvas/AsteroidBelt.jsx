import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { THEMES } from "../../lib/themes";

/*
 * Asteroid belt - one instancedMesh per belt (1 draw call each).
 * Rocks are distributed PROPORTIONALLY:
 *  - count scales with the belt's circumference, so the inner and outer
 *    belts share the same visual density
 *  - even angular spacing + jitter → no random clumps or bare gaps
 *  - Kepler-style speed falloff: the inner belt orbits noticeably faster
 */
const DENSITY = { high: 1.15, low: 0.45 }; // rocks per world-unit of circumference
const REF_RADIUS = 22.25; // inner belt = speed reference

export default function AsteroidBelt({
  radius,
  spread,
  thickness = 1.2,
  scale = 1,
}) {
  const ref = useRef();
  const quality = useStore((s) => s.quality);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const theme = useStore((s) => THEMES[s.theme]);

  const r = radius * scale;
  const count = useMemo(
    () => Math.max(24, Math.round(2 * Math.PI * r * DENSITY[quality])),
    [r, quality],
  );
  const speed = 0.022 * Math.pow(REF_RADIUS / radius, 1.5);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const p = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const a = i * step + (Math.random() - 0.5) * step * 0.9; // even slots + jitter
      const rr = r + (Math.random() - 0.5) * spread * 2 * scale;
      p.set(
        Math.cos(a) * rr,
        (Math.random() - 0.5) * thickness,
        Math.sin(a) * rr,
      );
      e.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      q.setFromEuler(e);
      s.setScalar(0.06 + Math.random() * 0.15);
      m.compose(p, q, s);
      ref.current.setMatrixAt(i, m);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [count, r, spread, thickness, scale]);

  useFrame((_, delta) => {
    if (!reducedMotion && ref.current) ref.current.rotation.y += delta * speed;
  });

  return (
    <instancedMesh key={count} ref={ref} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={theme.grad}
        roughness={0.9}
        metalness={0.15}
      />
    </instancedMesh>
  );
}
