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
    orbitRadius: 10,
    size: 0.7,
    speed: 0.22,
    level: "Advanced",
    moons: ["Laravel"],
  },
  {
    id: "python",
    texture: "/textures/venus.jpg",
    label: "Python",
    color: "#F8D866",
    orbitRadius: 13.5,
    size: 1.4,
    speed: 0.18,
    level: "Advanced",
    moons: ["Django", "Flask", "NumPy"],
  },
  {
    id: "js",
    texture: "/textures/earth.jpg",
    label: "JavaScript",
    color: "#22D3EE",
    orbitRadius: 17,
    size: 1.5,
    speed: 0.15,
    level: "Advanced",
    moons: ["Node", "React", "TypeScript", "Next.js"],
  },
  {
    id: "dart",
    texture: "/textures/mars.png",
    label: "Dart",
    color: "#67E8F9",
    orbitRadius: 20.5,
    size: 1.3,
    speed: 0.13,
    level: "Advanced",
    moons: ["Flutter", "Android", "Firebase"],
  },
  {
    id: "csharp",
    texture: "/textures/jupiter.png",
    label: "C# / Java / C",
    color: "#F8D866",
    orbitRadius: 24,
    size: 1.2,
    speed: 0.11,
    level: "Intermediate",
    moons: [".NET", "Java", "C → Arduino"],
  },
  {
    id: "markup",
    texture: "/textures/saturn.jpg",
    label: "HTML + CSS",
    color: "#22D3EE",
    orbitRadius: 27,
    size: 1.0,
    speed: 0.1,
    level: "Advanced",
    moons: ["Bootstrap", "Tailwind"],
  },
  {
    id: "db",
    texture: "/textures/uranus.jpg",
    label: "Databases",
    color: "#67E8F9",
    orbitRadius: 30.5,
    size: 1.6,
    speed: 0.085,
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
    orbitRadius: 34,
    size: 1.5,
    speed: 0.07,
    level: "Growing · AZ-900 → AZ-104",
    moons: ["AWS", "Azure", "Firebase", "🎖 AZ-900 → AZ-104"],
  },
];

/** Tools asteroid belt - small instanced rocks between the outer orbits. */
export const asteroidBelt = {
  radius: 38,
  spread: 2.5,
  tools: [
    "Git",
    "Linux",
    "Figma",
    "Arduino",
    "Unity",
    "MATLAB",
    "OpenCV",
    "Chart.js",
    "CanvasJS",
    "Photoshop",
  ],
};
