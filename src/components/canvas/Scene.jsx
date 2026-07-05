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
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useStore } from "../../store/useStore";
import { THEMES } from "../../lib/themes";

/*
 * THE single shared full-viewport canvas - fixed behind the DOM.
 * Regions: SNova + Solar System at origin · Station Corridor x 34→87 ·
 * Trajectory constellation y ≈ −43 · Satellite beside the star.
 */
function ThemeSync() {
  const { gl, scene } = useThree();
  const theme = useStore((s) => THEMES[s.theme]);
  useEffect(() => {
    gl.setClearColor(theme.deep);
    if (scene.fog) scene.fog.color.set(theme.deep);
  }, [theme, gl, scene]);
  return null;
}

export default function Scene({ eventSource }) {
  const quality = useStore((s) => s.quality);
  return (
    <Canvas
      className="webgl-canvas"
      eventSource={eventSource}
      eventPrefix="client"
      dpr={quality === "high" ? [1, 2] : [1, 1.5]}
      camera={{ position: [0, 0.5, 12], fov: 50, near: 0.1, far: 400 }}
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
        <ThemeSync />
        <CameraRig />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
