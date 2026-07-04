import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Float, MeshDistortMaterial, Sparkles, Trail } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

/*
 * Hero centerpiece — the SNova pulsar. v2 fixes:
 *  - core shrunk 1.4 → 0.8, ring 4.2 → 2.8 (was filling the viewport)
 *  - glow no longer depends on Bloom: a shader halo billboard renders the
 *    radial plasma glow directly, so it looks identical on the low tier
 *  - hot white-cyan inner core + toneMapped:false so Bloom (when on) also fires
 */

const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const haloFragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5)) * 2.0;          // 0 center → 1 edge
    float pulse = 1.0 + 0.08 * sin(uTime * 1.6);
    float a = pow(max(0.0, 1.0 - d / pulse), 2.6);     // soft radial falloff
    vec3 plasma = vec3(0.404, 0.910, 0.976);           // #67E8F9
    vec3 hot    = vec3(0.812, 0.980, 0.996);           // near-white cyan core
    vec3 col = mix(plasma, hot, a);
    gl_FragColor = vec4(col, a * 0.85);
  }
`

function Halo({ size = 5.5 }) {
  const mat = useRef()
  const reducedMotion = useStore((s) => s.reducedMotion)
  useFrame((state) => {
    if (!reducedMotion && mat.current)
      mat.current.uniforms.uTime.value = state.clock.elapsedTime
  })
  return (
    <Billboard>
      <mesh>
        <planeGeometry args={[size, size]} />
        <shaderMaterial
          ref={mat}
          vertexShader={haloVertex}
          fragmentShader={haloFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>
    </Billboard>
  )
}

export default function SNovaStar() {
  const core = useRef()
  const ring = useRef()
  const comet = useRef()
  const reducedMotion = useStore((s) => s.reducedMotion)
  const quality = useStore((s) => s.quality)

  useFrame((state) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime
    if (core.current) {
      core.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.05)
      core.current.rotation.y = t * 0.15
    }
    if (ring.current) ring.current.rotation.z = t * 0.25
    if (comet.current) {
      const a = t * 0.9
      // ride the tilted ring plane (ring group is rotated, comet lives outside it,
      // so approximate the projected ellipse: rx = ring radius, ry squashed by tilt)
      comet.current.position.set(Math.cos(a) * 2.8, Math.sin(a) * 0.9, Math.sin(a) * 1.1)
    }
  })

  return (
    <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.12} floatIntensity={0.3}>
      <group position={[0, 0.6, 0]}>
        {/* plasma glow — pure shader, works with post-processing on OR off */}
        <Halo size={5.5} />

        {/* distorted plasma shell */}
        <mesh ref={core}>
          <sphereGeometry args={[0.8, 64, 64]} />
          <MeshDistortMaterial
            color="#22D3EE"
            emissive={new THREE.Color('#67E8F9')}
            emissiveIntensity={2.2}
            toneMapped={false}
            distort={reducedMotion ? 0 : 0.28}
            speed={2}
            roughness={0.25}
          />
        </mesh>

        {/* hot inner core — the bright heart of the star */}
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshBasicMaterial color="#e0fbff" toneMapped={false} />
        </mesh>

        {/* energy ring — thinner, half the old radius */}
        <group rotation={[Math.PI / 2.4, 0, 0]}>
          <mesh ref={ring}>
            <torusGeometry args={[2.8, 0.02, 16, 200]} />
            <meshStandardMaterial
              color="#22D3EE"
              emissive={new THREE.Color('#22D3EE')}
              emissiveIntensity={1.4}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* gold comet with trail */}
        {!reducedMotion && (
          <Trail width={0.9} length={4} color="#F8D866" attenuation={(w) => w * w}>
            <mesh ref={comet}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color="#F8D866" toneMapped={false} />
            </mesh>
          </Trail>
        )}

        <Sparkles
          count={quality === 'high' ? 70 : 25}
          scale={5.5}
          size={2.5}
          speed={reducedMotion ? 0 : 0.3}
          color="#F8D866"
        />
        <pointLight color="#67E8F9" intensity={10} distance={48} decay={2} />
      </group>
    </Float>
  )
}
