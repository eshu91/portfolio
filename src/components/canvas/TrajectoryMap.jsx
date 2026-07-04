import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { roadmap } from '../../data/roadmap'
import { useStore } from '../../store/useStore'

/*
 * Roadmap = constellation Trajectory Map, floating below the solar plane.
 * Stars from data/roadmap.js connected by glowing lines:
 *   done → plasma, current → pulsing gold, planned → dim deep-cyan.
 * Two extra unlabeled dim stars trail off the end — expandable placeholders.
 */
const CENTER_Y = -43

function statusColor(status) {
  return status === 'done' ? '#67E8F9' : status === 'current' ? '#F8D866' : '#0e5268'
}

function MilestoneStar({ point, item }) {
  const mesh = useRef()
  const reducedMotion = useStore((s) => s.reducedMotion)
  const current = item?.status === 'current'

  useFrame((state) => {
    if (!mesh.current) return
    if (current && !reducedMotion) {
      mesh.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.3)
    }
  })

  const color = item ? statusColor(item.status) : '#0e5268'
  return (
    <group position={point}>
      <mesh ref={mesh}>
        <sphereGeometry args={[current ? 0.32 : 0.22, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={item ? 1 : 0.35} />
      </mesh>
      {item && (
        <Html center position={[0, -0.9, 0]} distanceFactor={20} style={{ pointerEvents: 'none' }}>
          <div className="text-center font-code">
            <p className="text-[11px] tracking-widest" style={{ color }}>
              ⟪ {item.year} ⟫ {item.status === 'done' ? '✓' : item.status === 'current' ? '⟳' : '◈'}
            </p>
            <p className="mt-0.5 whitespace-nowrap text-[11px] text-white/85">{item.title}</p>
            <p className="whitespace-nowrap text-[10px] text-white/50">{item.detail}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function TrajectoryMap() {
  const points = useMemo(() => {
    const n = roadmap.length + 2 // +2 dim placeholder stars
    return Array.from({ length: n }, (_, i) => [
      (i - (n - 1) / 2) * 5,
      CENTER_Y + (i % 2 === 0 ? 0 : 2.6) + Math.sin(i * 1.3) * 0.6,
      (i % 3 - 1) * 1.4,
    ])
  }, [])

  return (
    <group>
      <Line
        points={points}
        color="#22D3EE"
        lineWidth={1}
        transparent
        opacity={0.5}
      />
      {points.map((p, i) => (
        <MilestoneStar key={i} point={p} item={roadmap[i] || null} />
      ))}
    </group>
  )
}
