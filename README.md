# 🌌 SNova - 3D Cosmic Portfolio

Immersive space & astronomy themed portfolio for **Ishwari Raut (SNova)** · React 18 + Vite · React Three Fiber · custom GLSL shaders · Cosmic Plasma Cyan palette.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Structure

```
src/
├─ data/                 ← ALL content lives here (edit these, never components)
│  ├─ profile.js         identity, roles, About-class
│  ├─ skills.js          solar-system planets + asteroid belt (schema documented inline)
│  ├─ projects.js        space stations, incl. locked placeholders + Lab 🧪 `ai` flag
│  ├─ roadmap.js         trajectory milestones (done | current | planned)
│  └─ socials.js         contact links
├─ components/
│  ├─ canvas/            every 3D object, prop-driven & reusable
│  │  ├─ Scene.jsx       THE single shared canvas (never mount a second one)
│  │  ├─ Starfield.jsx   3-layer parallax shader stars (~12k high / ~4k low tier)
│  │  ├─ Nebula.jsx      fbm/simplex plasma shader backdrop
│  │  ├─ SNovaStar.jsx   pulsar core + #22D3EE ring + gold comet trail
│  │  ├─ CameraRig.jsx   waypoint table + drift/parallax (GSAP scrub in phase 2)
│  │  └─ Effects.jsx     Bloom / Vignette / Noise, quality-gated
│  ├─ sections/          DOM layer (Hero now; About/Skills/Projects/Roadmap/Contact next)
│  └─ ui/                Loader etc.
├─ hooks/useTyping.js
└─ store/useStore.js     Zustand: quality tier, reduced motion, active section
```

## How to add a project in 30 seconds

Open `src/data/projects.js`, append one object:

```js
{ id: 'my-app', title: 'My App', blurb: 'One line.', tech: ['React'],
  github: 'https://github.com/eshu91/my-app', demo: '', featured: true,
  category: 'fullstack', ai: false, locked: false },
```

Cards, station meshes and the Lab 🧪 filter all pick it up automatically. Adding a skill planet works the same way in `skills.js` (schema commented at the top of each file).

## Planet textures

Surface maps live in `public/textures/` (Solar System Scope planet maps, [CC BY 4.0](https://www.solarsystemscope.com/textures/) - attribution required if you redistribute). Each planet's map is set per-entry in `src/data/skills.js` via the `texture` field, so a new skill planet just points at any equirectangular map you drop into `public/textures/`.

## Palette (strict - Tailwind tokens)

`space-deep #030f18` · `space-mid #083344` · `space-grad #0e5268` · `plasma #67E8F9` · `plasma-mid #22D3EE` · `stargold #F8D866`

## Performance notes

- Quality tiers via `hardwareConcurrency` + DPR (`store/useStore.js`): low tier drops to ~4k stars, DPR ≤1.5, post-processing off.
- `prefers-reduced-motion`: twinkle, distortion, comet, drift and typing all freeze.
- Stars are GPU points with size attenuation; single canvas; `depthWrite:false` + additive blending on particles; fog matches clear color.
- Keep frame budget: profile with `r3f-perf` if adding heavy meshes.

## Deploy to Vercel

```bash
npm run build
# Vercel: framework preset "Vite", build command `npm run build`, output `dist`
```

Drop `resume.pdf` into `public/` to activate the résumé button.

## Roadmap of the build itself

- ✅ Phase 1 - scaffold, shared canvas, starfield, nebula, SNova hero
- ✅ Phase 2 - Observatory HUD, Solar System skills (orbits, chain arcs, hover/focus), Lenis + GSAP camera scrub, scroll-velocity chromatic aberration
- ✅ Phase 3 - Deep Space Stations + Lab 🧪 filter, Trajectory Map constellation, Transmission form + satellite, cursor trail / magnetic buttons / scroll comet
