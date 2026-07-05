/*
 * Theme definitions — the single source of truth for the 3D layer.
 * (The DOM layer reads the same palettes via CSS variables in index.css.)
 *
 * Each theme provides: hex colors for materials/canvas, and normalized
 * vec3 arrays for the GLSL shaders (nebula + halo).
 * Adding a theme = one object here + one [data-theme] block in index.css.
 */
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export const THEMES = {
  plasma: {
    id: 'plasma',
    label: 'PLASMA CYAN',
    deep: '#030f18',
    mid: '#083344',
    grad: '#0e5268',
    accent: '#67E8F9',
    accent2: '#22D3EE',
    gold: '#F8D866',
    hot: '#e0fbff',
    nebulaDeep: rgb('#030f18'),
    nebulaMid: rgb('#0e5268'),
    nebulaAccent: rgb('#67E8F9'),
  },
  void: {
    id: 'void',
    label: 'CYBERPUNK VOID',
    deep: '#020014',
    mid: '#0a0118',
    grad: '#3b0f66',
    accent: '#00FFF7',
    accent2: '#FF10F0',
    gold: '#FFB627',
    hot: '#d9fffe',
    nebulaDeep: rgb('#020014'),
    nebulaMid: rgb('#3b0f66'),
    nebulaAccent: rgb('#B026FF'),
  },
  solar: {
    id: 'solar',
    label: 'SOLAR FLARE',
    deep: '#1a0e02',
    mid: '#443008',
    grad: '#684a0e',
    accent: '#F9A825',
    accent2: '#FF6B35',
    gold: '#7DF9FF', // the "spark" role — ice blue so comets pop against warm tones
    hot: '#fff3dc',
    nebulaDeep: rgb('#1a0e02'),
    nebulaMid: rgb('#684a0e'),
    nebulaAccent: rgb('#F9A825'),
  },
  emerald: {
    id: 'emerald',
    label: 'EMERALD DRIFT',
    deep: '#02120c',
    mid: '#06392b',
    grad: '#0e6849',
    accent: '#6EF9C0',
    accent2: '#22EE9C',
    gold: '#F8D866',
    hot: '#eafff5',
    nebulaDeep: rgb('#02120c'),
    nebulaMid: rgb('#0e6849'),
    nebulaAccent: rgb('#6EF9C0'),
  },
  crimson: {
    id: 'crimson',
    label: 'CRIMSON NOVA',
    deep: '#14020a',
    mid: '#3a0a1e',
    grad: '#68102e',
    accent: '#F967A0',
    accent2: '#EE2255',
    gold: '#FFC94A',
    hot: '#ffe9f2',
    nebulaDeep: rgb('#14020a'),
    nebulaMid: rgb('#68102e'),
    nebulaAccent: rgb('#F967A0'),
  },
  mono: {
    id: 'mono',
    label: 'STARLIGHT MONO',
    deep: '#0a0a0f',
    mid: '#1c1c26',
    grad: '#33334a',
    accent: '#E8EAF9',
    accent2: '#9aa3c9',
    gold: '#F8D866',
    hot: '#ffffff',
    nebulaDeep: rgb('#0a0a0f'),
    nebulaMid: rgb('#33334a'),
    nebulaAccent: rgb('#9aa3c9'),
  },
}

export const THEME_ORDER = ['plasma', 'void', 'solar', 'emerald', 'crimson', 'mono']

/**
 * Translate a Plasma-palette hex (as stored in data files, e.g. skill.color)
 * into the active theme's equivalent. Identity for the plasma theme.
 */
export function mapColor(theme, hex) {
  if (theme.id === 'plasma') return hex
  const m = {
    '#67E8F9': theme.accent,
    '#22D3EE': theme.accent2,
    '#F8D866': theme.gold,
    '#0e5268': theme.grad,
    '#083344': theme.mid,
    '#030f18': theme.deep,
  }
  return m[hex] || hex
}
