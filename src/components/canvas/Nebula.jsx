import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { THEMES } from "../../lib/themes";

/*
 * Nebula backdrop - fbm (fractal Brownian motion) over 2D simplex noise,
 * drifting slowly, colored deep-space → #0e5268 → #67E8F9.
 * Rendered on a giant plane far behind everything, additive + very low opacity.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uAccent;
  varying vec2 vUv;

  // ---- 2D simplex noise (Ashima / IQ standard implementation) ----
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // fbm: 5 octaves of simplex, halving amplitude each octave
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p = p * 2.05 + vec2(13.7, 7.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv * 3.0;
    // two drifting fbm fields warped into each other → slow plasma churn
    float n1 = fbm(p + vec2(uTime * 0.015, uTime * 0.008));
    float n2 = fbm(p * 1.7 - vec2(uTime * 0.01, 0.0) + n1);
    float cloud = smoothstep(-0.2, 0.9, n1 + n2 * 0.5);

    vec3 col = mix(uDeep, uMid, cloud);
    col = mix(col, uAccent, pow(cloud, 3.5) * 0.5); // accent only in dense cores

    // fade edges so the plane never shows a border
    float edge = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x)
               * smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);

    gl_FragColor = vec4(col, cloud * edge * 0.22); // very low opacity
  }
`;

export default function Nebula() {
  const mat = useRef();
  const reducedMotion = useStore((s) => s.reducedMotion);
  const theme = useStore((s) => THEMES[s.theme]);

  useEffect(() => {
    if (!mat.current) return;
    mat.current.uniforms.uDeep.value.set(...theme.nebulaDeep);
    mat.current.uniforms.uMid.value.set(...theme.nebulaMid);
    mat.current.uniforms.uAccent.value.set(...theme.nebulaAccent);
  }, [theme]);

  useFrame((state) => {
    if (reducedMotion) return;
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={[0, 0, -90]} scale={[380, 220, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uDeep: { value: new THREE.Vector3(0.012, 0.059, 0.094) },
          uMid: { value: new THREE.Vector3(0.055, 0.322, 0.408) },
          uAccent: { value: new THREE.Vector3(0.404, 0.91, 0.976) },
        }}
      />
    </mesh>
  );
}
