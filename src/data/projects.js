/**
 * Projects = Deep Space Stations. Cards + 3D stations are driven ENTIRELY by this file.
 *
 * SCHEMA:
 *   id        string   unique key
 *   title     string
 *   blurb     string   one line
 *   tech      string[] palette-colored badges
 *   github    string   repo URL ('' if private)
 *   demo      string   live URL ('' if none)
 *   featured  boolean  featured stations dock the camera longer
 *   category  'fullstack' | 'mobile' | 'automation' | 'ai' | 'infra' | '3d'
 *   ai        boolean  true → appears under the "Lab 🧪" filter tab
 *   locked    boolean  true → wireframe "INCOMING TRANSMISSION" placeholder
 *   image     string?  optional screenshot path
 *   model     string?  optional GLTF path for a custom station mesh
 *
 * HOW TO ADD A PROJECT (30 seconds): append one object. Done.
 */
export const projects = [
  { id: 'service-platform', title: 'Online Service Platform', blurb: 'Full-stack services marketplace web application.', tech: ['PHP', 'Laravel', 'MySQL'], github: '', demo: '', featured: true, category: 'fullstack', ai: false, locked: false },
  { id: 'portfolio-3d', title: '3D Portfolio (this site)', blurb: 'React Three Fiber, custom GLSL shaders, scroll-driven camera.', tech: ['React', 'R3F', 'GLSL', 'GSAP'], github: 'https://github.com/eshu91', demo: '', featured: true, category: '3d', ai: false, locked: false },
  { id: 'ppt-tooling', title: 'PPT Generation Tooling', blurb: 'Automated slide generation pipeline.', tech: ['Node.js', 'PptxGenJS'], github: '', demo: '', featured: false, category: 'automation', ai: false, locked: false },
  { id: 'countdown', title: 'Countdown Dashboard', blurb: 'Personal Google Apps Script dashboard.', tech: ['Apps Script', 'Google Sheets'], github: '', demo: '', featured: false, category: 'automation', ai: false, locked: false },
  { id: 'camera-game', title: 'Browser Camera Game', blurb: 'Hand/gesture game with MediaPipe Tasks Vision.', tech: ['MediaPipe', 'JavaScript'], github: '', demo: '', featured: true, category: 'ai', ai: true, locked: false },
  { id: 'interview-coach', title: 'IT Interview Coach', blurb: 'Chrome extension powered by the Anthropic API.', tech: ['Chrome Extension', 'Anthropic API'], github: '', demo: '', featured: true, category: 'ai', ai: true, locked: false },
  { id: 'edoko', title: 'e-Doko', blurb: 'E-commerce app for the Nepali community, built @ Quality IT Solutions.', tech: ['Flutter', 'Dart', 'Firebase'], github: '', demo: '', featured: true, category: 'mobile', ai: false, locked: false },
  { id: 'sheets-suite', title: 'Sheets Automation Suite', blurb: 'Student Management System · Expense Tracker · Study Progress Tracker.', tech: ['Google Sheets', 'Apps Script'], github: '', demo: '', featured: false, category: 'automation', ai: false, locked: false },
  { id: 'it-lab', title: 'Enterprise IT Lab', blurb: 'Windows Server, AD, DNS/DHCP, Exchange, Cisco routing, VoIP.', tech: ['Windows Server', 'Cisco', 'VoIP'], github: '', demo: '', featured: false, category: 'infra', ai: false, locked: false },
  { id: 'locked-1', title: '🛰️ INCOMING TRANSMISSION', blurb: 'Full-Stack Build in Progress', tech: [], github: '', demo: '', featured: false, category: 'fullstack', ai: false, locked: true },
  { id: 'locked-2', title: '🤖 AI PROJECT — Classified', blurb: 'Launching soon', tech: [], github: '', demo: '', featured: false, category: 'ai', ai: true, locked: true },
  { id: 'locked-3', title: '🛰️ INCOMING TRANSMISSION', blurb: 'Signal acquired… decoding', tech: [], github: '', demo: '', featured: false, category: 'ai', ai: true, locked: true },
]
