import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { skills, asteroidBelts } from '../../data/skills'
import SkillPlanet from './SkillPlanet'
import AsteroidBelt from './AsteroidBelt'

/*
 * Skills = Solar System, centered on the SNova star (the sun of this system).
 * Entirely data-driven: appending a planet to data/skills.js adds its orbit
 * ring, planet, moons and chain arcs automatically.
 * SCALE compresses the semantic orbit radii (10–38) into camera frame.
 */
const SCALE = 0.65

// preload every surface map (+ shared moon map) during the loader screen
skills.forEach((s) => useTexture.preload(s.texture))
useTexture.preload('/textures/moon.png')

export default function SolarSystem() {
  return (
    <group position={[0, 0, 0]}>
      {skills.map((skill) => (
        <group key={skill.id}>
          {/* orbit path ring */}
          <mesh rotation-x={-Math.PI / 2}>
            <ringGeometry args={[skill.orbitRadius * SCALE - 0.03, skill.orbitRadius * SCALE + 0.03, 128]} />
            <meshBasicMaterial color="#22D3EE" transparent opacity={0.13} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <SkillPlanet skill={skill} scale={SCALE} />
        </group>
      ))}
      {asteroidBelts.map((b) => (
        <AsteroidBelt key={b.id} radius={b.radius} spread={b.spread} thickness={b.thickness} scale={SCALE} />
      ))}
    </group>
  )
}
