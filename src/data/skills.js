/**
 * Skills = Solar System.
 * Each entry is a PLANET orbiting the SNova star; `moons` are the frameworks -
 * their order IS the dependency chain (language → framework → tools), rendered
 * as visible connection arcs.
 *
 * HOW TO ADD A PLANET (30 seconds):
 *   { id: 'go', label: 'Go', color: '#67E8F9', texture: '/textures/mars.png',
 *     orbitRadius: 30, size: 1.1,
 *     speed: 0.1, level: 'Learning', moons: ['Gin', 'gRPC'] }
 * Append it below - orbit, hover card and fallback grid all pick it up.
 */
export const skills = [
  {
    id: "php",
    texture: "/textures/mercury.jpg",
    label: "PHP",
    color: "#67E8F9",
    orbitRadius: 7,
    size: 0.85,
    speed: 0.38,
    level: "Advanced",
    moons: ["Laravel"],
  },
  {
    id: "python",
    texture: "/textures/venus.jpg",
    label: "Python",
    color: "#F8D866",
    orbitRadius: 10,
    size: 1.05,
    speed: 0.30,
    level: "Advanced",
    moons: ["Django", "Flask", "NumPy"],
  },
  {
    id: "js",
    texture: "/textures/earth.jpg",
    label: "JavaScript",
    color: "#22D3EE",
    orbitRadius: 14,
    size: 1.12,
    speed: 0.25,
    level: "Advanced",
    moons: ["Node", "React", "TypeScript", "Next.js"],
  },
  {
    id: "dart",
    texture: "/textures/mars.png",
    label: "Dart",
    color: "#67E8F9",
    orbitRadius: 19,
    size: 0.95,
    speed: 0.20,
    level: "Advanced",
    moons: ["Flutter", "Android", "Firebase"],
  },
  {
    id: "csharp",
    texture: "/textures/jupiter.png",
    label: "C# / Java / C",
    color: "#F8D866",
    orbitRadius: 28,
    size: 2.15,
    speed: 0.11,
    level: "Intermediate",
    moons: [".NET", "Java", "C → Arduino"],
  },
  {
    id: "markup",
    texture: "/textures/saturn.jpg",
    label: "HTML + CSS",
    color: "#22D3EE",
    orbitRadius: 37,
    size: 1.85,
    speed: 0.08,
    level: "Advanced",
    moons: ["Bootstrap", "Tailwind"],
  },
  {
    id: "db",
    texture: "/textures/uranus.jpg",
    label: "Databases",
    color: "#67E8F9",
    orbitRadius: 46,
    size: 1.55,
    speed: 0.06,
    level: "Advanced",
    moons: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "SQLite",
      "Oracle",
      "MariaDB",
      "MSSQL",
    ],
  },
  {
    id: "cloud",
    texture: "/textures/neptune.png",
    label: "Cloud",
    color: "#F8D866",
    orbitRadius: 56,
    size: 1.45,
    speed: 0.045,
    level: "Growing · AZ-900 → AZ-104",
    moons: ["AWS", "Azure", "Firebase", "🎖 AZ-900 → AZ-104"],
  },
];

/**
 * Asteroid belts - proportionally distributed rock rings.
 *   inner: the main belt, between the rocky planets and the gas giants
 *          (dev tools - the rocks you build with)
 *   outer: Kuiper-style ring beyond the last orbit (viz / science / design)
 * Rock count auto-scales with each belt's circumference, so visual density
 * stays even. Add a belt = append one object.
 */
export const asteroidBelts = [
  {
    id: "inner",
    label: "Dev Tools Belt",
    radius: 23.5,
    spread: 1.5,
    thickness: 1,
    tools: ["Git", "Linux", "Figma", "Arduino", "Unity"],
  },
  {
    id: "outer",
    label: "Viz & Science Belt",
    radius: 63,
    spread: 3,
    thickness: 2,
    tools: ["MATLAB", "OpenCV", "Chart.js", "CanvasJS", "Photoshop"],
  },
];
