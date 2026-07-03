import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Starfield from './Starfield'
import Nebula from './Nebula'
import SNovaStar from './SNovaStar'
import CameraRig from './CameraRig'
import Effects from './Effects'
import { useStore } from '../../store/useStore'

/*
 * THE single shared full-viewport canvas — everything 3D lives here,
 * fixed behind the DOM (.webgl-canvas). Never mount a second Canvas.
 */
export default function Scene() {
  const quality = useStore((s) => s.quality)
  return (
    <Canvas
      className="webgl-canvas"
      dpr={quality === 'high' ? [1, 2] : [1, 1.5]}
      camera={{ position: [0, 0.5, 12], fov: 50, near: 0.1, far: 400 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#030f18')
        scene.fog = new THREE.FogExp2('#030f18', 0.004)
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} />
        <Nebula />
        <Starfield />
        <SNovaStar />
        <CameraRig />
        <Effects />
      </Suspense>
    </Canvas>
  )
}
