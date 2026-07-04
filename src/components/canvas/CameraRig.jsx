import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "../../store/useStore";
import { skillPositions } from "./skillRegistry";

gsap.registerPlugin(ScrollTrigger);

/*
 * Scroll-driven camera - v3, full flight path:
 * Launch → Observatory → Solar System → Station Corridor (pan past the
 * deep-space stations) → Trajectory Map (dive below the solar plane) →
 * Transmission (return home to the star + satellite).
 * A GSAP ScrollTrigger timeline scrubbed over the whole page tweens the
 * desired position/look Vector3s; useFrame damps the real camera toward
 * them with pointer parallax on top. Clicking a skill planet overrides
 * the rig and docks beside it until released.
 */
export const WAYPOINTS = {
  // hero:        { position: [0, 0.5, 12],   lookAt: [0, 0.4, 0] },
  hero: { position: [0, 16, 26], lookAt: [0, 0, 0] },
  about: { position: [7, 2.5, 9.5], lookAt: [1.5, 0.6, 0] },
  skills: { position: [0, 22, 30], lookAt: [0, 0, 0] },
  projectsIn: { position: [24, 2.5, 13], lookAt: [34, 0, 0] },
  projectsPan: { position: [72, 2.5, 13], lookAt: [82, 0, 0] },
  roadmap: { position: [0, -40, 22], lookAt: [0, -43, 0] },
  // contact:     { position: [0, 0.8, 8.5],  lookAt: [0.8, 0.6, 0] },
  contact: { position: [0, 7, 11], lookAt: [0.5, 0, 0] },
};

export default function CameraRig() {
  const { camera } = useThree();
  const pos = useRef(new THREE.Vector3(...WAYPOINTS.hero.position));
  const look = useRef(new THREE.Vector3(...WAYPOINTS.hero.lookAt));
  const smoothLook = useRef(new THREE.Vector3(...WAYPOINTS.hero.lookAt));
  const dockPos = useRef(new THREE.Vector3());
  const reducedMotion = useStore((s) => s.reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const tl = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    const leg = (wp, duration) => {
      tl.to(pos.current, {
        x: wp.position[0],
        y: wp.position[1],
        z: wp.position[2],
        duration,
      });
      tl.to(
        look.current,
        { x: wp.lookAt[0], y: wp.lookAt[1], z: wp.lookAt[2], duration },
        "<",
      );
    };
    leg(WAYPOINTS.about, 1); // Launch → Observatory
    leg(WAYPOINTS.skills, 1.2); // up & over the solar system
    tl.to({}, { duration: 0.6 }); // hold - explore the planets
    leg(WAYPOINTS.projectsIn, 1.2); // fly out to the station corridor
    leg(WAYPOINTS.projectsPan, 1.5); // pan past every station
    leg(WAYPOINTS.roadmap, 1.3); // dive to the trajectory constellation
    leg(WAYPOINTS.contact, 1.1); // return home for transmission
    ScrollTrigger.refresh();
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (reducedMotion) {
      camera.position.set(...WAYPOINTS.hero.position);
      camera.lookAt(smoothLook.current.set(...WAYPOINTS.hero.lookAt));
      return;
    }

    const focused = useStore.getState().focusedSkill;
    const planetPos = focused ? skillPositions.get(focused) : null;

    if (planetPos) {
      dockPos.current.set(
        planetPos.x + 2.5,
        planetPos.y + 1.8,
        planetPos.z + 4,
      );
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        dockPos.current.x,
        2.5,
        delta,
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        dockPos.current.y,
        2.5,
        delta,
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        dockPos.current.z,
        2.5,
        delta,
      );
      smoothLook.current.x = THREE.MathUtils.damp(
        smoothLook.current.x,
        planetPos.x,
        3,
        delta,
      );
      smoothLook.current.y = THREE.MathUtils.damp(
        smoothLook.current.y,
        planetPos.y,
        3,
        delta,
      );
      smoothLook.current.z = THREE.MathUtils.damp(
        smoothLook.current.z,
        planetPos.z,
        3,
        delta,
      );
      camera.lookAt(smoothLook.current);
      return;
    }

    const t = state.clock.elapsedTime;
    const px = pos.current.x + state.pointer.x * 1.1 + Math.sin(t * 0.1) * 0.35;
    const py =
      pos.current.y + state.pointer.y * 0.7 + Math.cos(t * 0.13) * 0.25;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, py, 2, delta);
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      pos.current.z,
      2,
      delta,
    );
    smoothLook.current.x = THREE.MathUtils.damp(
      smoothLook.current.x,
      look.current.x,
      3,
      delta,
    );
    smoothLook.current.y = THREE.MathUtils.damp(
      smoothLook.current.y,
      look.current.y,
      3,
      delta,
    );
    smoothLook.current.z = THREE.MathUtils.damp(
      smoothLook.current.z,
      look.current.z,
      3,
      delta,
    );
    camera.lookAt(smoothLook.current);
  });
  return null;
}
