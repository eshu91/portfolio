import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useStore } from '../../store/useStore'

/*
 * Post-processing stack. Bloom threshold 0.5 — only the toneMapped:false
 * emissives (#67E8F9 / #22D3EE / #F8D866) exceed it and glow.
 * ChromaticAberration is driven by Lenis scroll velocity → the promised
 * subtle fringe on section transitions, zero at rest.
 * Whole stack disabled on the low quality tier.
 */
function ScrollAberration() {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current?.offset) return
    const v = Math.min(Math.abs(useStore.getState().scrollVelocity) * 0.00006, 0.0022)
    ref.current.offset.x = THREE.MathUtils.lerp(ref.current.offset.x, v, 0.08)
    ref.current.offset.y = ref.current.offset.x
  })
  return (
    <ChromaticAberration
      ref={ref}
      offset={new THREE.Vector2(0, 0)}
      radialModulation={false}
      modulationOffset={0}
    />
  )
}

export default function Effects() {
  const quality = useStore((s) => s.quality)
  if (quality === 'low') return null
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom intensity={0.9} luminanceThreshold={0.5} luminanceSmoothing={0.25} mipmapBlur />
      <ScrollAberration />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
    </EffectComposer>
  )
}
