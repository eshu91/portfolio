import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { skillPositions } from './skillRegistry'

/*
 * One tech-ecosystem planet, fully prop-driven from data/skills.js.
 *  - orbits the SNova star; hovering PAUSES the orbit and scales it up
 *  - moons (frameworks) circle the planet; QuadraticBezier arcs draw the
 *    dependency chain planet → moon₁ → moon₂ … in #22D3EE
 *  - hover/focus shows an Html HUD card (name, level, chain)
 *  - click focuses the camera (handled by CameraRig via skillRegistry)
 */
export default function SkillPlanet({ skill, scale = 1 }) {
  const { id, label, color, orbitRadius, size, speed, level, moons } = skill
  const pivot = useRef()
  const planet = useRef()
  const moonGroup = useRef()
  const worldPos = useRef(new THREE.Vector3())

  const hoveredSkill = useStore((s) => s.hoveredSkill)
  const focusedSkill = useStore((s) => s.focusedSkill)
  const setHoveredSkill = useStore((s) => s.setHoveredSkill)
  const setFocusedSkill = useStore((s) => s.setFocusedSkill)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const hovered = hoveredSkill === id
  const focused = focusedSkill === id
  const r = orbitRadius * scale
  const angle = useRef(Math.random() * Math.PI * 2)

  // moons laid out on a widening spiral so chain arcs never overlap
  const moonData = useMemo(
    () =>
      moons.map((name, i) => {
        const a = i * 0.9 + 0.4
        const mr = size * 1.9 + i * 0.85
        return { name, pos: [Math.cos(a) * mr, 0.18 * i, Math.sin(a) * mr] }
      }),
    [moons, size]
  )

  useFrame((state, delta) => {
    // hover or focus pauses the orbit
    if (!reducedMotion && !hovered && !focused) angle.current += speed * delta
    pivot.current.position.set(Math.cos(angle.current) * r, 0, Math.sin(angle.current) * r)
    pivot.current.getWorldPosition(worldPos.current)
    skillPositions.set(id, worldPos.current)

    const targetScale = hovered || focused ? 1.55 : 1
    const s = THREE.MathUtils.damp(planet.current.scale.x, targetScale, 6, delta)
    planet.current.scale.setScalar(s)

    if (!reducedMotion && moonGroup.current) moonGroup.current.rotation.y += delta * 0.2
  })

  return (
    <group ref={pivot}>
      <group ref={planet}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredSkill(id)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredSkill(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setFocusedSkill(focused ? null : id) // click again to release
          }}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={new THREE.Color(color)}
            emissiveIntensity={hovered || focused ? 0.6 : 0.22}
            roughness={0.55}
          />
        </mesh>

        {/* moons + dependency-chain arcs (rotate together) */}
        <group ref={moonGroup}>
          {moonData.map((m, i) => {
            const prev = i === 0 ? [0, 0, 0] : moonData[i - 1].pos
            const mid = [
              (prev[0] + m.pos[0]) / 2,
              (prev[1] + m.pos[1]) / 2 + 0.6,
              (prev[2] + m.pos[2]) / 2,
            ]
            return (
              <group key={m.name}>
                <QuadraticBezierLine
                  start={prev}
                  end={m.pos}
                  mid={mid}
                  color="#22D3EE"
                  lineWidth={1}
                  transparent
                  opacity={hovered || focused ? 0.9 : 0.35}
                />
                <mesh position={m.pos}>
                  <sphereGeometry args={[0.16, 16, 16]} />
                  <meshStandardMaterial
                    color="#cffafe"
                    emissive={new THREE.Color('#67E8F9')}
                    emissiveIntensity={0.4}
                    roughness={0.4}
                  />
                </mesh>
              </group>
            )
          })}
        </group>

        {/* HUD label card */}
        {(hovered || focused) && (
          <Html center position={[0, size * 2.6, 0]} distanceFactor={16} style={{ pointerEvents: 'none' }}>
            <div className="w-56 rounded-lg border border-plasma-mid/60 bg-space-deep/90 px-4 py-3 font-code text-left shadow-[0_0_24px_rgba(34,211,238,0.35)] backdrop-blur">
              <p className="text-plasma text-sm font-medium">{label}</p>
              <p className="text-stargold text-[11px] mt-0.5">{level}</p>
              <p className="text-white/75 text-[11px] mt-2 leading-relaxed">
                {[label, ...moons].join(' → ')}
              </p>
              <p className="text-plasma-mid/70 text-[10px] mt-2">
                {focused ? 'click again to release' : 'click to focus'}
              </p>
            </div>
          </Html>
        )}
      </group>
    </group>
  )
}
