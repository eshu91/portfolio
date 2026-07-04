# 🌌 SNova Portfolio - Customization Guide

Everything you'll ever want to change, mapped to the exact file and line pattern.
Drop this file into the repo root as `CUSTOMIZATION.md` so it lives next to the code.

---

## 0. The Golden Rule

**Content lives in `src/data/` - components never hardcode content.**
If you're changing _what_ the site says (a project, a skill, a milestone, a link),
you only touch a data file. If you're changing _how_ it looks or moves
(colors, camera, sizes), you touch the specific component listed below.

```
src/
├─ data/          ← 95% of your future edits happen here
│  ├─ profile.js      name, alias, roles, tagline, About-class code
│  ├─ skills.js       planets, moons, dependency chains, asteroid belt
│  ├─ projects.js     stations, cards, locked slots, Lab 🧪 flag
│  ├─ roadmap.js      trajectory milestones
│  └─ socials.js      contact icons
├─ components/
│  ├─ canvas/     ← 3D: star, planets, stations, camera, effects
│  ├─ sections/   ← DOM: Hero, About, Skills, Projects, Roadmap, Contact
│  └─ ui/         ← Loader, FxOverlay (cursor/comet), Magnetic
├─ store/useStore.js   quality tier + reduced-motion detection
└─ hooks/              typing effect, smooth scroll, media query
```

After any edit: the dev server (`npm run dev`) hot-reloads instantly.
After pushing to GitHub: Vercel redeploys automatically.

---

## 1. Identity & Hero Text - `src/data/profile.js`

| What                                 | Field                                                        |
| ------------------------------------ | ------------------------------------------------------------ |
| Big title                            | `alias` (currently "SNova")                                  |
| Eyebrow line "ISHWARI RAUT // SNOVA" | `name` + `alias`                                             |
| Typing roles under the title         | `roles: [...]` - add/remove/reorder strings                  |
| Tagline paragraph                    | `tagline`                                                    |
| Email used by the contact form       | `email`                                                      |
| The Python class in the Observatory  | `aboutClass` (template string - edit the code inside freely) |

Typing speed lives in `src/hooks/useTyping.js` defaults:
`typeMs: 70` (typing), `deleteMs: 32` (erasing), `holdMs: 1400` (pause on full line).

Hero _sizing_ (title/button scale on the landing view) is in
`src/components/sections/Hero.jsx` - the Tailwind classes
`text-3xl md:text-5xl` on the `<h1>` are the main knob.

---

## 2. Skills - Planets, Moons & Chains - `src/data/skills.js`

Each object = one planet. Full schema:

```js
{
  id: 'go',                          // unique key
  label: 'Go',                       // shown on the hover card
  color: '#67E8F9',                  // atmosphere rim + orbit accent + fallback
  texture: '/textures/mars.png',     // any equirectangular map in public/textures/
  orbitRadius: 30,                   // semantic distance from the star (10–38 range)
  size: 1.1,                         // planet radius
  speed: 0.1,                        // orbit speed (outer planets = slower, like reality)
  level: 'Learning',                 // gold sub-line on the hover card
  moons: ['Gin', 'gRPC'],            // ORDER = dependency chain, drawn as arcs
}
```

**Add a planet:** append one object. Orbit ring, hover card, chain arcs,
and the mobile fallback grid all generate themselves.

**Remove a planet:** delete its object. Nothing else to clean up.

**Change a dependency chain:** reorder the `moons` array - the arcs follow
array order (`planet → moons[0] → moons[1] → …`).

**Swap a texture:** drop any equirectangular JPG/PNG into `public/textures/`
and point `texture:` at it. Free sources: solarsystemscope.com/textures
(CC BY 4.0 - keep the attribution line in the README if you redistribute).

**Asteroid belt tools:** edit `asteroidBelt.tools` in the same file (shown in
the mobile grid). Rock count is in `src/components/canvas/AsteroidBelt.jsx`
(`count = quality === 'high' ? 160 : 60`).

**Planet brightness:** `src/components/canvas/SkillPlanet.jsx` →
`emissiveIntensity={hovered || focused ? 0.55 : 0.3}` - raise `0.3` if planets
look too dark on your monitor.

**System size on screen:** `SCALE = 0.55` at the top of
`src/components/canvas/SolarSystem.jsx`. Bigger number = wider system.

---

## 3. Projects - Stations & Cards - `src/data/projects.js`

```js
{
  id: 'my-app',
  title: 'My App',
  blurb: 'One line description.',
  tech: ['React', 'MySQL'],          // palette-colored badges, cycle cyan/mid/gold
  github: 'https://github.com/...',  // '' hides the link
  demo: 'https://...',               // '' hides the link
  featured: true,                    // true → gets a 3D station in the corridor + ★
  category: 'fullstack',             // fullstack | mobile | automation | ai | infra | 3d
  ai: false,                         // true → appears under the LAB 🧪 filter tab
  locked: false,                     // true → amber wireframe "INCOMING TRANSMISSION"
}
```

**Ship a locked project:** find the `locked-1/2/3` entry, replace its fields
with the real project, set `locked: false`. (Or leave the slots and append the
real project as a new object - slots are just placeholders.)

**Add an AI build to the Lab tab:** set `ai: true`. That's the whole feature.

**Station corridor layout:** `src/components/canvas/ProjectStations.jsx` →
`CORRIDOR_X = 34` (where the corridor starts) and `GAP = 7.5` (spacing).
Only `featured` + `locked` entries get 3D stations; everything appears as a card.

---

## 4. Roadmap - `src/data/roadmap.js`

```js
{ year: 2027, title: 'AWS SAA', detail: 'Solutions Architect', status: 'planned' }
```

`status` drives the constellation: `'done'` = plasma star, `'current'` = pulsing
gold star (exactly one should be current at a time), `'planned'` = dim star.
When you pass a milestone, flip its status and set the next one to `current`.
The two unlabeled dim stars at the end are decorative placeholders - they move
automatically as the list grows (`TrajectoryMap.jsx` adds `+2` to the length).

---

## 5. Socials & Contact - `src/data/socials.js` + `Contact.jsx`

Add a link:

```js
{ id: 'twitter', label: 'Twitter/X', url: 'https://x.com/yourhandle' },
```

Then give it an icon character in `src/components/sections/Contact.jsx`:

```js
const SOCIAL_ICONS = { github: "⌥", linkedin: "in", email: "✉", twitter: "𝕏" };
```

**Contact form:** currently a zero-backend `mailto:` (opens the visitor's mail
app). To upgrade to real in-page sending: `npm i @emailjs/browser`, then in
`Contact.jsx` replace the body of `transmit()` with
`emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)` - keys go in a
`.env` file (`VITE_EMAILJS_KEY=...`, read via `import.meta.env.VITE_EMAILJS_KEY`).

**Résumé button:** drop `resume.pdf` into `public/` - the hero button already
points at `/resume.pdf`.

---

## 6. Colors - Changing the Palette

The palette lives in **two layers**:

**Layer 1 - Tailwind tokens** (`tailwind.config.js`): `space-deep`, `space-mid`,
`space-grad`, `plasma`, `plasma-mid`, `stargold`. Changing these restyles every
DOM element (cards, buttons, HUD panels, text).

**Layer 2 - hardcoded hex in the 3D layer** (WebGL can't read Tailwind).
If you ever change the palette, search-and-replace these hexes across
`src/components/canvas/` and `src/components/ui/FxOverlay.jsx`:

| Token      | Hex       | Appears in                                          |
| ---------- | --------- | --------------------------------------------------- |
| deep bg    | `#030f18` | Scene clear color + fog, Nebula shader              |
| gradient   | `#0e5268` | Nebula shader, AsteroidBelt material, Satellite     |
| plasma     | `#67E8F9` | SNovaStar, Starfield tint, halo shader, cursor glow |
| plasma-mid | `#22D3EE` | rings, chain arcs, orbit paths, station rings       |
| star gold  | `#F8D866` | comet, sparkles, milestone star, scroll comet       |

Note the Nebula/halo shaders use **normalized RGB** (`vec3(0.404, 0.910, 0.976)`
= `#67E8F9`); each is commented with its hex. Convert with `value / 255`.

---

## 7. Camera & Flight Path - `src/components/canvas/CameraRig.jsx`

The whole journey is the `WAYPOINTS` table + the `leg()` calls below it:

```js
export const WAYPOINTS = {
  hero: { position: [0, 16, 26], lookAt: [0, 0, 0] }, // tilted orrery landing
  about: { position: [7, 2.5, 9.5], lookAt: [1.5, 0.6, 0] },
  skills: { position: [0, 22, 30], lookAt: [0, 0, 0] },
  projectsIn: { position: [24, 2.5, 13], lookAt: [34, 0, 0] },
  projectsPan: { position: [72, 2.5, 13], lookAt: [82, 0, 0] },
  roadmap: { position: [0, -40, 22], lookAt: [0, -43, 0] },
  contact: { position: [0, 7, 11], lookAt: [0.5, 0, 0] },
};
```

Reads as: camera stands at `position`, points at `lookAt`. Higher `y` = more
top-down tilt; larger `z`/distance = wider framing.

**Change a view:** edit the row, save, scroll to that sector - hot reload
applies it live, so tuning is fast trial-and-error.

**Change pacing:** the `leg(WAYPOINTS.x, duration)` calls - durations are
_relative weights_ (the whole timeline is scrubbed across total page scroll).
A `tl.to({}, { duration: 0.6 })` line is a "hold" - the camera parks while the
user keeps scrolling (used at the solar system).

**Add a sector:** add a WAYPOINTS row + one `leg()` call + a DOM section in
`App.jsx`. Scroll runway length = the section's height class (see §9).

**Landing view:** if you change `WAYPOINTS.hero`, also update the initial
camera in `src/components/canvas/Scene.jsx` (`camera={{ position: [...] }}`)
so the first frame matches and there's no swoop on load.

**Focus docking** (clicking a planet): the offset the camera parks at is in
CameraRig's `dockPos.current.set(planetPos.x + 2.5, planetPos.y + 1.8, planetPos.z + 4)`.

---

## 8. The SNova Star - `src/components/canvas/SNovaStar.jsx`

| Knob                    | Where                                   | Default              |
| ----------------------- | --------------------------------------- | -------------------- |
| Core size               | `sphereGeometry args={[0.8, ...]}`      | 0.8                  |
| Glow halo size          | `<Halo size={5.5} />`                   | 5.5                  |
| Ring radius / thickness | `torusGeometry args={[2.8, 0.02, ...]}` | 2.8 / 0.02           |
| Pulse depth             | `Math.sin(t * 1.6) * 0.05`              | ±5%                  |
| Wobble/distortion       | `distort={0.28}`                        | 0.28                 |
| Gold sparkle count      | `Sparkles count={70/25}`                | 70 high / 25 low     |
| Sunlight reach          | `pointLight ... distance={48}`          | 48 (covers the belt) |

The halo is a shader billboard, so the glow works even with post-processing off.

---

## 9. Scroll Runways & Section Heights - `src/components/sections/*.jsx`

Each section's height decides how much scrolling its camera leg gets:

| Section                | Height class    | Feel                               |
| ---------------------- | --------------- | ---------------------------------- |
| Hero / About / Contact | `min-h-screen`  | one screen each                    |
| Skills                 | `h-[200vh]`     | long runway to explore planets     |
| Projects               | `min-h-[250vh]` | longest - corridor pan + card grid |
| Roadmap                | `h-[150vh]`     | medium                             |

Make a runway longer (e.g. `h-[300vh]`) and that camera leg plays out slower
relative to scrolling. Skills and Roadmap swap to `min-h-screen` automatically
in fallback (mobile / reduced-motion) mode.

---

## 10. Effects, Performance & Accessibility

**Post-processing** - `src/components/canvas/Effects.jsx`:
bloom strength `intensity={0.9}`, glow cutoff `luminanceThreshold={0.5}`
(lower = more things glow), film grain `opacity={0.35}`, and the scroll-velocity
chromatic aberration cap `0.0022` inside `ScrollAberration`.

**Quality tiers** - `src/store/useStore.js` → `detectQuality()`. Low tier
(≤4 cores or high-DPR touch device) drops to ~4k stars, DPR ≤ 1.5, and disables
post-processing. Force a tier while testing by returning `'low'`/`'high'`.

**Star counts** - `src/components/canvas/Starfield.jsx`, the three
`<StarLayer count={...}>` lines (6000/4000/2000 × tier multiplier).

**Reduced motion** - automatic via the OS setting; freezes orbits, twinkle,
typing, camera flights, and swaps Skills/Roadmap to static grids. Nothing to
configure, but test it once (macOS: Reduce Motion / Windows: Animation effects off).

**Micro-interactions** - `src/components/ui/FxOverlay.jsx` (cursor trail:
particle cap `70`, comet trigger `Math.abs(v) > 2`) and `ui/Magnetic.jsx`
(pull strength prop, default `0.35`).

---

## 11. Quick Recipe Index

| I want to…                             | Edit                                               |
| -------------------------------------- | -------------------------------------------------- |
| Change my roles / tagline / About code | `data/profile.js`                                  |
| Add / remove a skill planet            | `data/skills.js`                                   |
| Add a project or unlock a placeholder  | `data/projects.js`                                 |
| Mark AZ-900 done, AZ-104 current       | `data/roadmap.js` statuses                         |
| Add a social icon                      | `data/socials.js` + icon map in `Contact.jsx`      |
| Make planets brighter                  | `SkillPlanet.jsx` emissiveIntensity                |
| Reframe any camera view                | `CameraRig.jsx` WAYPOINTS (+ `Scene.jsx` for hero) |
| Resize the star / ring / glow          | `SNovaStar.jsx`                                    |
| Slow a sector down                     | its section height class                           |
| Change the whole palette               | `tailwind.config.js` + hex table in §6             |
| Add my résumé                          | drop `resume.pdf` in `public/`                     |
| Real email sending                     | EmailJS swap in `Contact.jsx` (§5)                 |

---

## 12. Workflow Reminders

```bash
npm run dev       # live preview at localhost:5173 (hot reload)
npm run build     # sanity-check before pushing - catches syntax errors
git add -A && git commit -m "update projects" && git push   # Vercel auto-deploys
```

If a 3D edit ever white-screens the page, open the browser console (F12) -
R3F errors name the exact component. And since every content change is one
data-file diff, `git log -p src/data/` doubles as your portfolio's changelog.
