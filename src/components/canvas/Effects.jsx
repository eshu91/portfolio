import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useStore } from '../../store/useStore'

/*
 * Post-processing stack.
 * Bloom threshold is tuned so only the #67E8F9 / #F8D866 emissives glow —
 * regular surfaces stay clean. Disabled entirely on the low quality tier.
 * ChromaticAberration on section transitions arrives with the CameraRig
 * waypoint timeline in the next phase.
 */
export default function Effects() {
  const quality = useStore((s) => s.quality)
  if (quality === 'low') return null
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom intensity={1.1} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
    </EffectComposer>
  )
}
