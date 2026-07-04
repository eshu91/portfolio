/**
 * Live world positions of skill planets, written each frame by SkillPlanet
 * and read by CameraRig when a planet is focused. A plain Map keeps this
 * out of React state — it changes 60×/second.
 */
export const skillPositions = new Map()
