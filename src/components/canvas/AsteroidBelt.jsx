import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

/*
 * Tools asteroid belt — one instancedMesh of low-poly rocks scattered in a
 * ring outside the outer planet orbit. Instanced: 160 rocks = 1 draw call.
 */
export default function AsteroidBelt({ radius, spread, scale = 1 }) {
  const ref = useRef()
  const quality = useStore((s) => s.quality)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const count = quality === 'high' ? 160 : 60

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const p = new THREE.Vector3()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const s = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const rr = (radius + (Math.random() - 0.5) * spread * 2) * scale
      p.set(Math.cos(a) * rr, (Math.random() - 0.5) * 1.2, Math.sin(a) * rr)
      e.set(Math.random() * 3, Math.random() * 3, Math.random() * 3)
      q.setFromEuler(e)
      const size = 0.07 + Math.random() * 0.16
      s.setScalar(size)
      m.compose(p, q, s)
      ref.current.setMatrixAt(i, m)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [count, radius, spread, scale])

  useFrame((_, delta) => {
    if (!reducedMotion && ref.current) ref.current.rotation.y += delta * 0.02
  })

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#0e5268" roughness={0.9} metalness={0.15} />
    </instancedMesh>
  )
}
