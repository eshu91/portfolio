import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { THEMES } from '../../lib/themes'

/*
 * Supernova shockwave — mounted inside the SNovaStar group, dormant until
 * store.novaSeq increments. Two expanding rings (accent horizontal, gold
 * on the energy-ring plane) + a 220-particle debris shell. Reduced motion:
 * rings only, no particles (the user explicitly triggered it, so a gentle
 * acknowledgment still plays).
 */
const DURATION = 1.6

export default function Shockwave() {
  const novaSeq = useStore((s) => s.novaSeq)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const theme = useStore((s) => THEMES[s.theme])
  const ring1 = useRef()
  const ring2 = useRef()
  const pts = useRef()
  const anim = useRef({ active: false, t: 0 })

  const { positions, dirs } = useMemo(() => {
    const n = 220
    const positions = new Float32Array(n * 3)
    const dirs = new Float32Array(n * 3)
    const v = new THREE.Vector3()
    for (let i = 0; i < n; i++) {
      v.randomDirection()
      dirs.set([v.x, v.y, v.z], i * 3)
    }
    return { positions, dirs }
  }, [])

  useEffect(() => {
    if (novaSeq > 0) anim.current = { active: true, t: 0 }
  }, [novaSeq])

  useFrame((_, delta) => {
    const a = anim.current
    const r1 = ring1.current
    const r2 = ring2.current
    const p = pts.current
    if (!r1 || !r2 || !p) return
    if (!a.active) {
      r1.visible = r2.visible = p.visible = false
      return
    }
    a.t += delta
    const k = a.t / DURATION
    if (k >= 1) {
      a.active = false
      return
    }
    r1.visible = r2.visible = true
    r1.scale.setScalar(1 + k * 26)
    r1.material.opacity = (1 - k) * 0.9
    const k2 = Math.max(0, (a.t - 0.15) / DURATION)
    r2.scale.setScalar(1 + k2 * 20)
    r2.material.opacity = k2 > 0 ? (1 - k2) * 0.6 : 0

    if (!reducedMotion) {
      p.visible = true
      const arr = p.geometry.attributes.position.array
      const dist = 0.9 + k * 16
      for (let i = 0; i < arr.length; i++) arr[i] = dirs[i] * dist
      p.geometry.attributes.position.needsUpdate = true
      p.material.opacity = 1 - k
    }
  })

  return (
    <group>
      <mesh ref={ring1} visible={false} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1, 1.14, 64]} />
        <meshBasicMaterial color={theme.accent} transparent opacity={0} side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ring2} visible={false} rotation={[Math.PI / 2.4, 0, 0]}>
        <ringGeometry args={[1, 1.1, 64]} />
        <meshBasicMaterial color={theme.gold} transparent opacity={0} side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <points ref={pts} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={220} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={theme.gold} size={0.18} transparent opacity={0}
          blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
    </group>
  )
}
