import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

/*
 * Camera rig — phase 1: gentle idle drift + mouse parallax at the Launch sector.
 *
 * Phase 2 (Solar System onward) plugs GSAP ScrollTrigger in here: a timeline of
 * WAYPOINTS below, scrubbed by scroll progress, eased between sectors.
 * Keep every waypoint as {position, lookAt} so adding a sector = adding a row.
 */
export const WAYPOINTS = {
  hero:     { position: [0, 0.5, 12],  lookAt: [0, 0.4, 0] },
  about:    { position: [-8, 2, 8],    lookAt: [-6, 1, 0] },   // Observatory (phase 2)
  skills:   { position: [0, 18, 26],   lookAt: [0, 0, 0] },    // Solar System (phase 2)
  projects: { position: [30, 4, 10],   lookAt: [34, 2, 0] },   // Stations (phase 3)
  roadmap:  { position: [0, -14, 18],  lookAt: [0, -16, 0] },  // Trajectory (phase 3)
  contact:  { position: [0, 0.5, 7],   lookAt: [0, 0.4, 0] },  // Transmission (phase 3)
}

export default function CameraRig() {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0.4, 0))
  const reducedMotion = useStore((s) => s.reducedMotion)

  useFrame((state, delta) => {
    if (reducedMotion) {
      camera.position.set(...WAYPOINTS.hero.position)
      camera.lookAt(target.current)
      return
    }
    const t = state.clock.elapsedTime
    const [bx, by, bz] = WAYPOINTS.hero.position
    // idle drift + pointer parallax, framerate-independent damping
    const px = bx + state.pointer.x * 1.2 + Math.sin(t * 0.1) * 0.4
    const py = by + state.pointer.y * 0.8 + Math.cos(t * 0.13) * 0.3
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px, 2, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, py, 2, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, bz, 2, delta)
    camera.lookAt(target.current)
  })
  return null
}
