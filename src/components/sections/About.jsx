import { motion } from "framer-motion";
import { profile } from "../../data/profile";

/*
 * Observatory sector - holographic HUD terminal rendering the SNova Python
 * class from data/profile.js. Lightweight token highlighter (no dep):
 * keywords → plasma-mid, strings → star gold.
 */
const KEYWORDS = new Set(["class", "def", "return", "self"]);
const TOKEN_RE = /("(?:[^"\\]|\\.)*"|\b(?:class|def|return|self)\b)/g;

function Highlighted({ code }) {
  return code.split(TOKEN_RE).map((part, i) => {
    if (part.startsWith('"'))
      return (
        <span key={i} className="text-stargold">
          {part}
        </span>
      );
    if (KEYWORDS.has(part))
      return (
        <span key={i} className="text-plasma-mid">
          {part}
        </span>
      );
    return <span key={i}>{part}</span>;
  });
}

export default function About() {
  return (
    <section
      id="about"
      className="dom-layer min-h-screen flex items-center justify-center px-4 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="scanlines relative w-full max-w-2xl rounded-xl border border-plasma-mid/40 bg-space-deep/75 shadow-[0_0_40px_rgb(var(--accent2)/0.18)] backdrop-blur-md overflow-hidden"
      >
        {/* HUD title bar */}
        <div className="flex items-center gap-2 border-b border-space-grad/70 bg-space-mid/50 px-4 py-2.5 font-code text-xs">
          <span className="h-2.5 w-2.5 rounded-full bg-plasma-mid/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-stargold/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-space-grad" />
          <span className="ml-2 text-plasma/80 tracking-wider">
            observatory://snova.profile
          </span>
          <span className="ml-auto text-plasma-mid/60">◉ LIVE</span>
        </div>
        <pre className="overflow-x-auto p-5 font-code text-[12px] md:text-[13px] leading-relaxed text-white/85">
          <Highlighted code={profile.aboutClass} />
        </pre>
      </motion.div>
    </section>
  );
}
