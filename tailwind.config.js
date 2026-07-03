/** Cosmic Plasma Cyan palette registered as named tokens (strict — do not substitute) */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'space-deep': '#030f18',   // page bg, canvas clear, fog
        'space-mid': '#083344',    // cards, panels, nav
        'space-grad': '#0e5268',   // gradient stops, borders
        plasma: '#67E8F9',         // headings, links, glow
        'plasma-mid': '#22D3EE',   // hover, orbit rings
        stargold: '#F8D866',       // icons, highlights
      },
      fontFamily: {
        code: ['"Fira Code"', 'monospace'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
