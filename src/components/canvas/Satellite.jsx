import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { THEMES } from "../../lib/themes";

/** Small rotating satellite drifting beside the star - visible in Transmission. */
export default function Satellite() {
  const group = useRef();
  const reducedMotion = useStore((s) => s.reducedMotion);
  const theme = useStore((s) => THEMES[s.theme]);

  useFrame((state, delta) => {
    if (reducedMotion || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y += delta * 0.5;
    group.current.position.y = 1.6 + Math.sin(t * 0.7) * 0.2;
  });

  return (
    <group ref={group} position={[3.4, 1.6, 2.4]} scale={0.6}>
      {/* body */}
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.8]} />
        <meshStandardMaterial
          color={theme.mid}
          metalness={0.6}
          roughness={0.35}
          emissive={new THREE.Color(theme.grad)}
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* solar panels */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.1, 0, 0]}>
          <boxGeometry args={[1.4, 0.02, 0.6]} />
          <meshStandardMaterial
            color={theme.grad}
            emissive={new THREE.Color(theme.accent2)}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* dish */}
      <mesh position={[0, 0.45, 0.2]} rotation={[-0.6, 0, 0]}>
        <coneGeometry args={[0.25, 0.18, 16, 1, true]} />
        <meshStandardMaterial
          color={theme.accent}
          emissive={new THREE.Color(theme.accent)}
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.62, 0.32]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color={theme.gold} toneMapped={false} />
      </mesh>
    </group>
  );
}
