import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Trail } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

/*
 * Hero centerpiece — the SNova pulsar:
 *  - distorted emissive sphere (#67E8F9) that breathes; bloom makes it glow
 *  - tilted energy ring in #22D3EE with a gold comet riding it (Trail)
 *  - gold Sparkles as ejected star-stuff
 */
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
      const pulse = 1 + Math.sin(t * 1.6) * 0.05
      core.current.scale.setScalar(pulse)
      core.current.rotation.y = t * 0.15
    }
    if (ring.current) ring.current.rotation.z = t * 0.25
    if (comet.current) {
      const a = t * 0.9
      comet.current.position.set(Math.cos(a) * 4.2, Math.sin(a) * 4.2 * 0.32, Math.sin(a) * 1.2)
    }
  })

  return (
    <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group position={[0, 0.4, 0]}>
        {/* pulsar core — emissive intensity > bloom threshold so only it glows */}
        <mesh ref={core}>
          <sphereGeometry args={[1.4, 64, 64]} />
          <MeshDistortMaterial
            color="#67E8F9"
            emissive={new THREE.Color('#67E8F9')}
            emissiveIntensity={1.6}
            distort={reducedMotion ? 0 : 0.35}
            speed={2}
            roughness={0.2}
          />
        </mesh>

        {/* energy ring */}
        <group rotation={[Math.PI / 2.4, 0, 0]}>
          <mesh ref={ring}>
            <torusGeometry args={[4.2, 0.035, 16, 200]} />
            <meshStandardMaterial
              color="#22D3EE"
              emissive={new THREE.Color('#22D3EE')}
              emissiveIntensity={1.2}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* gold comet with trail riding the ring plane */}
        {!reducedMotion && (
          <Trail width={1.2} length={5} color="#F8D866" attenuation={(w) => w * w}>
            <mesh ref={comet}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshBasicMaterial color="#F8D866" toneMapped={false} />
            </mesh>
          </Trail>
        )}

        {/* ejected star-stuff */}
        <Sparkles
          count={quality === 'high' ? 90 : 30}
          scale={7}
          size={3}
          speed={reducedMotion ? 0 : 0.35}
          color="#F8D866"
        />
        <pointLight color="#67E8F9" intensity={14} distance={30} decay={2} />
      </group>
    </Float>
  )
}
