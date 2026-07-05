import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Float, MeshDistortMaterial, Sparkles, Trail } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { THEMES } from '../../lib/themes'
import { sfx } from '../../lib/soundEngine'
import Shockwave from './Shockwave'

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
  uniform vec3 uCol;
  uniform vec3 uHot;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5)) * 2.0;          // 0 center → 1 edge
    float pulse = 1.0 + 0.08 * sin(uTime * 1.6);
    float a = pow(max(0.0, 1.0 - d / pulse), 2.6);     // soft radial falloff
    vec3 col = mix(uCol, uHot, a);
    gl_FragColor = vec4(col, a * 0.85);
  }
`

function Halo({ size = 5.5 }) {
  const mat = useRef()
  const reducedMotion = useStore((s) => s.reducedMotion)
  const theme = useStore((s) => THEMES[s.theme])
  useEffect(() => {
    if (!mat.current) return
    mat.current.uniforms.uCol.value.set(theme.accent)
    mat.current.uniforms.uHot.value.set(theme.hot)
  }, [theme])
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
          uniforms={{
            uTime: { value: 0 },
            uCol: { value: new THREE.Color('#67E8F9') },
            uHot: { value: new THREE.Color('#e0fbff') },
          }}
        />
      </mesh>
    </Billboard>
  )
}

export default function SNovaStar() {
  const theme = useStore((s) => THEMES[s.theme])
  const core = useRef()
  const coreMat = useRef()
  const light = useRef()
  const clicks = useRef({ n: 0, last: 0 })
  const flash = useRef(0)
  const lastSeq = useRef(0)
  const ring = useRef()
  const comet = useRef()
  const reducedMotion = useStore((s) => s.reducedMotion)
  const quality = useStore((s) => s.quality)

  useFrame((state, delta) => {
    // supernova flash: react to seq change + play the boom (covers both triggers)
    const seq = useStore.getState().novaSeq
    if (seq !== lastSeq.current) {
      lastSeq.current = seq
      flash.current = 0.8
      sfx.supernova()
    }
    if (flash.current > 0) {
      flash.current = Math.max(0, flash.current - delta)
      const f = flash.current / 0.8
      if (coreMat.current) coreMat.current.emissiveIntensity = 2.2 + f * 6
      if (light.current) light.current.intensity = 10 + f * 90
    }
    if (reducedMotion) return
    const t = state.clock.elapsedTime
    if (core.current) {
      const burst = (flash.current / 0.8) * 1.6
      core.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.05 + burst)
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

        {/* distorted plasma shell — click it 5× fast for a surprise */}
        <mesh
          ref={core}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { document.body.style.cursor = 'auto' }}
          onClick={(e) => {
            e.stopPropagation()
            const now = performance.now()
            if (now - clicks.current.last > 1500) clicks.current.n = 0
            clicks.current.last = now
            clicks.current.n += 1
            sfx.hover()
            if (clicks.current.n >= 5) {
              clicks.current.n = 0
              useStore.getState().triggerNova()
            }
          }}
        >
          <sphereGeometry args={[0.8, 64, 64]} />
          <MeshDistortMaterial
            ref={coreMat}
            color={theme.accent2}
            emissive={new THREE.Color(theme.accent)}
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
          <meshBasicMaterial color={theme.hot} toneMapped={false} />
        </mesh>

        {/* energy ring — thinner, half the old radius */}
        <group rotation={[Math.PI / 2.4, 0, 0]}>
          <mesh ref={ring}>
            <torusGeometry args={[2.8, 0.02, 16, 200]} />
            <meshStandardMaterial
              color={theme.accent2}
              emissive={new THREE.Color(theme.accent2)}
              emissiveIntensity={1.4}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* gold comet with trail */}
        {!reducedMotion && (
          <Trail width={0.9} length={4} color={theme.gold} attenuation={(w) => w * w}>
            <mesh ref={comet}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color={theme.gold} toneMapped={false} />
            </mesh>
          </Trail>
        )}

        <Sparkles
          count={quality === 'high' ? 70 : 25}
          scale={5.5}
          size={2.5}
          speed={reducedMotion ? 0 : 0.3}
          color={theme.gold}
        />
        <pointLight ref={light} color={theme.accent} intensity={10} distance={48} decay={2} />
        <Shockwave />
      </group>
    </Float>
  )
}
