/** Cosmic Plasma Cyan palette registered as named tokens (strict - do not substitute) */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // themeable via CSS variables - see :root / [data-theme] in index.css
        "space-deep": "rgb(var(--deep) / <alpha-value>)",
        "space-mid": "rgb(var(--mid) / <alpha-value>)",
        "space-grad": "rgb(var(--grad) / <alpha-value>)",
        plasma: "rgb(var(--accent) / <alpha-value>)",
        "plasma-mid": "rgb(var(--accent2) / <alpha-value>)",
        stargold: "rgb(var(--gold) / <alpha-value>)",
      },
      fontFamily: {
        code: ['"Fira Code"', "monospace"],
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
