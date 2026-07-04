import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "../../data/projects";
import { useStore } from "../../store/useStore";

/*
 * Projects = Deep Space Stations, parked along a corridor at x ≈ 34…87.
 * The camera pans past them while the DOM project cards scroll.
 * Featured projects get solid stations; locked entries render as dimmed
 * amber wireframes - "incoming transmissions" awaiting payload.
 * Fully data-driven: featured/locked flags in data/projects.js decide
 * which entries materialise out here.
 */
const CORRIDOR_X = 34;
const GAP = 7.5;

function Station({ project, position, index }) {
  const group = useRef();
  const ringA = useRef();
  const wire = useRef();
  const reducedMotion = useStore((s) => s.reducedMotion);
  const locked = project.locked;

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime + index * 1.7;
    if (group.current) {
      group.current.rotation.y += delta * 0.15;
      group.current.position.y = position[1] + Math.sin(t * 0.6) * 0.35;
    }
    if (ringA.current) ringA.current.rotation.z += delta * 0.4;
    if (wire.current)
      wire.current.material.opacity = 0.25 + Math.abs(Math.sin(t * 1.4)) * 0.3;
  });

  return (
    <group position={position}>
      <group ref={group}>
        {locked ? (
          /* wireframe transmission - dim, blinking amber */
          <mesh ref={wire}>
            <octahedronGeometry args={[1.4, 1]} />
            <meshBasicMaterial
              color="#F8D866"
              wireframe
              transparent
              opacity={0.35}
            />
          </mesh>
        ) : (
          <>
            {/* habitat core */}
            <mesh>
              <boxGeometry args={[1.1, 1.1, 1.1]} />
              <meshStandardMaterial
                color="#083344"
                roughness={0.5}
                metalness={0.4}
                emissive={new THREE.Color("#0e5268")}
                emissiveIntensity={0.5}
              />
            </mesh>
            {/* docking ring */}
            <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.9, 0.06, 12, 80]} />
              <meshStandardMaterial
                color="#22D3EE"
                emissive={new THREE.Color("#22D3EE")}
                emissiveIntensity={1.1}
                toneMapped={false}
              />
            </mesh>
            {/* comms antenna */}
            <mesh position={[0, 1.3, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
              <meshStandardMaterial
                color="#67E8F9"
                emissive={new THREE.Color("#67E8F9")}
                emissiveIntensity={0.9}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, 2.05, 0]}>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshBasicMaterial color="#F8D866" toneMapped={false} />
            </mesh>
          </>
        )}
      </group>
      <Html
        center
        position={[0, locked ? 2.2 : 2.9, 0]}
        distanceFactor={22}
        style={{ pointerEvents: "none" }}
      >
        <p
          className={`whitespace-nowrap font-code text-[11px] tracking-widest ${locked ? "text-stargold/70" : "text-plasma"}`}
        >
          {locked ? "🛰️ INCOMING TRANSMISSION" : project.title.toUpperCase()}
        </p>
      </Html>
    </group>
  );
}

export default function ProjectStations() {
  const stationed = useMemo(
    () => projects.filter((p) => p.featured || p.locked),
    [],
  );
  return (
    <group>
      {stationed.map((p, i) => (
        <Station
          key={p.id}
          project={p}
          index={i}
          position={[
            CORRIDOR_X + i * GAP,
            (i % 2) * 1.2 - 0.6,
            ((i % 3) - 1) * 2,
          ]}
        />
      ))}
    </group>
  );
}
