import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

/*
 * Procedural star field - instanced Points with a custom shader.
 * 3 parallax depth layers; colors mixed from #ffffff / #67E8F9 / #F8D866.
 * Twinkle = per-star phase + hash-noised frequency in the fragment shader.
 */

const vertex = /* glsl */ `
  uniform float uPixelRatio;
  attribute float aScale;   // per-star size
  attribute float aPhase;   // per-star twinkle offset
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vPhase;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    // size attenuation: farther stars render smaller
    gl_PointSize = aScale * uPixelRatio * (340.0 / -mv.z);
    vColor = aColor;
    vPhase = aPhase;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vPhase;
  // cheap hash → each star twinkles at its own irregular frequency
  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float disc = smoothstep(0.5, 0.12, d);      // soft round point
    if (disc < 0.01) discard;
    float freq = 0.5 + hash(vPhase) * 1.6;
    float tw = 0.55 + 0.45 * sin(uTime * freq + vPhase * 6.28318);
    gl_FragColor = vec4(vColor, disc * tw);
  }
`;

const PALETTE = [
  new THREE.Color("#ffffff"),
  new THREE.Color("#67E8F9"),
  new THREE.Color("#F8D866"),
];

function StarLayer({ count, radius, thickness, baseScale, drift }) {
  const mat = useRef();
  const group = useRef();
  const reducedMotion = useStore((s) => s.reducedMotion);

  const { positions, scales, phases, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // random point in a spherical shell around the camera path
      const r = radius + (Math.random() - 0.5) * thickness;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      scales[i] = baseScale * (0.5 + Math.random());
      phases[i] = Math.random();
      const roll = Math.random();
      const c = roll < 0.72 ? PALETTE[0] : roll < 0.9 ? PALETTE[1] : PALETTE[2];
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, scales, phases, colors };
  }, [count, radius, thickness, baseScale]);

  useFrame((state) => {
    if (reducedMotion) return;
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current)
      group.current.rotation.y = state.clock.elapsedTime * drift;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aScale"
            count={count}
            array={scales}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            count={count}
            array={phases}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aColor"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          }}
        />
      </points>
    </group>
  );
}

export default function Starfield() {
  const quality = useStore((s) => s.quality);
  const mult = quality === "high" ? 1 : 0.35; // low tier: ~4k stars instead of ~12k
  return (
    <>
      {/* three parallax depths - far layer drifts slowest */}
      <StarLayer
        count={Math.floor(6000 * mult)}
        radius={160}
        thickness={60}
        baseScale={1.6}
        drift={0.004}
      />
      <StarLayer
        count={Math.floor(4000 * mult)}
        radius={110}
        thickness={40}
        baseScale={2.2}
        drift={0.008}
      />
      <StarLayer
        count={Math.floor(2000 * mult)}
        radius={70}
        thickness={30}
        baseScale={3.0}
        drift={0.013}
      />
    </>
  );
}
