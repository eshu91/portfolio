import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Starfield from './Starfield'
import Nebula from './Nebula'
import SNovaStar from './SNovaStar'
import SolarSystem from './SolarSystem'
import CameraRig from './CameraRig'
import Effects from './Effects'
import { useStore } from '../../store/useStore'

/*
 * THE single shared full-viewport canvas — fixed behind the DOM.
 * eventSource points at the app root so planet hover/click raycasting works
 * even though DOM sections scroll on top (canvas itself is pointer-events:none).
 */
export default function Scene({ eventSource }) {
  const quality = useStore((s) => s.quality)
  return (
    <Canvas
      className="webgl-canvas"
      eventSource={eventSource}
      eventPrefix="client"
      dpr={quality === 'high' ? [1, 2] : [1, 1.5]}
      camera={{ position: [0, 0.5, 12], fov: 50, near: 0.1, far: 400 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#030f18')
        scene.fog = new THREE.FogExp2('#030f18', 0.004)
      }}
      onPointerMissed={() => useStore.getState().setFocusedSkill(null)}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.18} />
        <Nebula />
        <Starfield />
        <SNovaStar />
        <SolarSystem />
        <CameraRig />
        <Effects />
      </Suspense>
    </Canvas>
  )
}
