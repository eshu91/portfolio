import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Starfield from "./Starfield";
import Nebula from "./Nebula";
import SNovaStar from "./SNovaStar";
import SolarSystem from "./SolarSystem";
import ProjectStations from "./ProjectStations";
import TrajectoryMap from "./TrajectoryMap";
import Satellite from "./Satellite";
import CameraRig from "./CameraRig";
import Effects from "./Effects";
import { useStore } from "../../store/useStore";

/*
 * THE single shared full-viewport canvas - fixed behind the DOM.
 * Regions: SNova + Solar System at origin · Station Corridor x 34→87 ·
 * Trajectory constellation y ≈ −43 · Satellite beside the star.
 */
export default function Scene({ eventSource }) {
  const quality = useStore((s) => s.quality);
  return (
    <Canvas
      className="webgl-canvas"
      eventSource={eventSource}
      eventPrefix="client"
      dpr={quality === "high" ? [1, 2] : [1, 1.5]}
      // camera={{ position: [0, 0.5, 12], fov: 50, near: 0.1, far: 400 }}
      camera={{ position: [0, 16, 26], fov: 50, near: 0.1, far: 400 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#030f18");
        scene.fog = new THREE.FogExp2("#030f18", 0.004);
      }}
      onPointerMissed={() => useStore.getState().setFocusedSkill(null)}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.18} />
        <Nebula />
        <Starfield />
        <SNovaStar />
        <SolarSystem />
        <ProjectStations />
        <TrajectoryMap />
        <Satellite />
        <CameraRig />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
