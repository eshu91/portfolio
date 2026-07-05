/*
 * Theme definitions - the single source of truth for the 3D layer.
 * (The DOM layer reads the same palettes via CSS variables in index.css.)
 *
 * Each theme provides: hex colors for materials/canvas, and normalized
 * vec3 arrays for the GLSL shaders (nebula + halo).
 * Adding a theme = one object here + one [data-theme] block in index.css.
 */
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const THEMES = {
  plasma: {
    id: "plasma",
    label: "PLASMA CYAN",
    deep: "#030f18",
    mid: "#083344",
    grad: "#0e5268",
    accent: "#67E8F9",
    accent2: "#22D3EE",
    gold: "#F8D866",
    hot: "#e0fbff",
    nebulaDeep: rgb("#030f18"),
    nebulaMid: rgb("#0e5268"),
    nebulaAccent: rgb("#67E8F9"),
  },
  void: {
    id: "void",
    label: "CYBERPUNK VOID",
    deep: "#020014",
    mid: "#0a0118",
    grad: "#3b0f66",
    accent: "#00FFF7",
    accent2: "#FF10F0",
    gold: "#FFB627",
    hot: "#d9fffe",
    nebulaDeep: rgb("#020014"),
    nebulaMid: rgb("#3b0f66"),
    nebulaAccent: rgb("#B026FF"),
  },
};

export const THEME_ORDER = ["plasma", "void"];

/**
 * Translate a Plasma-palette hex (as stored in data files, e.g. skill.color)
 * into the active theme's equivalent. Identity for the plasma theme.
 */
export function mapColor(theme, hex) {
  if (theme.id === "plasma") return hex;
  const m = {
    "#67E8F9": theme.accent,
    "#22D3EE": theme.accent2,
    "#F8D866": theme.gold,
    "#0e5268": theme.grad,
    "#083344": theme.mid,
    "#030f18": theme.deep,
  };
  return m[hex] || hex;
}
