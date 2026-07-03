import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../store/useStore'
import { skillPositions } from './skillRegistry'

gsap.registerPlugin(ScrollTrigger)

/*
 * Scroll-driven camera — v2.
 * A GSAP ScrollTrigger timeline (scrubbed over the whole page) tweens two
 * Vector3s — desired position + look target — through the sector WAYPOINTS.
 * useFrame damps the real camera toward them and layers pointer parallax
 * on top, keeping motion silky at any scroll speed.
 *
 * Clicking a skill planet overrides the scroll rig: the camera docks beside
 * the planet's live position (from skillRegistry) until released.
 *
 * Adding a sector in phase 3 = adding a WAYPOINTS row + one timeline leg.
 */
export const WAYPOINTS = {
  hero:   { position: [0, 0.5, 12],  lookAt: [0, 0.4, 0] },
  about:  { position: [7, 2.5, 9.5], lookAt: [1.5, 0.6, 0] },
  skills: { position: [0, 22, 30],   lookAt: [0, 0, 0] },
  // phase 3:
  // projects: { position: [30, 4, 10],  lookAt: [34, 2, 0] },
  // roadmap:  { position: [0, -14, 18], lookAt: [0, -16, 0] },
  // contact:  { position: [0, 0.5, 7],  lookAt: [0, 0.4, 0] },
}

export default function CameraRig() {
  const { camera } = useThree()
  const pos = useRef(new THREE.Vector3(...WAYPOINTS.hero.position))
  const look = useRef(new THREE.Vector3(...WAYPOINTS.hero.lookAt))
  const smoothLook = useRef(new THREE.Vector3(...WAYPOINTS.hero.lookAt))
  const dockPos = useRef(new THREE.Vector3())
  const reducedMotion = useStore((s) => s.reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const tl = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })
    const leg = (wp, duration) => {
      tl.to(pos.current, { x: wp.position[0], y: wp.position[1], z: wp.position[2], duration })
      tl.to(look.current, { x: wp.lookAt[0], y: wp.lookAt[1], z: wp.lookAt[2], duration }, '<')
    }
    leg(WAYPOINTS.about, 1)    // Launch → Observatory
    leg(WAYPOINTS.skills, 1.2) // Observatory → Solar System (flying up & over)
    tl.to({}, { duration: 0.8 }) // hold at the system while the user explores
    ScrollTrigger.refresh()
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reducedMotion])

  useFrame((state, delta) => {
    if (reducedMotion) {
      camera.position.set(...WAYPOINTS.hero.position)
      camera.lookAt(smoothLook.current.set(...WAYPOINTS.hero.lookAt))
      return
    }

    const focused = useStore.getState().focusedSkill
    const planetPos = focused ? skillPositions.get(focused) : null

    if (planetPos) {
      // dock beside the (still-parked) planet
      dockPos.current.set(planetPos.x + 2.5, planetPos.y + 1.8, planetPos.z + 4)
      camera.position.x = THREE.MathUtils.damp(camera.position.x, dockPos.current.x, 2.5, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, dockPos.current.y, 2.5, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, dockPos.current.z, 2.5, delta)
      smoothLook.current.x = THREE.MathUtils.damp(smoothLook.current.x, planetPos.x, 3, delta)
      smoothLook.current.y = THREE.MathUtils.damp(smoothLook.current.y, planetPos.y, 3, delta)
      smoothLook.current.z = THREE.MathUtils.damp(smoothLook.current.z, planetPos.z, 3, delta)
      camera.lookAt(smoothLook.current)
      return
    }

    // scroll waypoint + idle drift + pointer parallax
    const t = state.clock.elapsedTime
    const px = pos.current.x + state.pointer.x * 1.1 + Math.sin(t * 0.1) * 0.35
    const py = pos.current.y + state.pointer.y * 0.7 + Math.cos(t * 0.13) * 0.25
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px, 2, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, py, 2, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, pos.current.z, 2, delta)
    smoothLook.current.x = THREE.MathUtils.damp(smoothLook.current.x, look.current.x, 3, delta)
    smoothLook.current.y = THREE.MathUtils.damp(smoothLook.current.y, look.current.y, 3, delta)
    smoothLook.current.z = THREE.MathUtils.damp(smoothLook.current.z, look.current.z, 3, delta)
    camera.lookAt(smoothLook.current)
  })
  return null
}
