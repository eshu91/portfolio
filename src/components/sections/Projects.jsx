import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../../data/projects'
import { sfx } from '../../lib/soundEngine'

/*
 * Deep Space Stations — DOM layer. The 3D station corridor drifts past in
 * the background while these HUD cards carry the details. Filter tabs are
 * derived from the data: the Lab 🧪 tab auto-collects every `ai: true`
 * entry, so future AI builds file themselves.
 */
const ACCENTS = ['#67E8F9', '#22D3EE', '#F8D866']
const FILTERS = [
  { id: 'all', label: 'ALL' },
  { id: 'featured', label: '★ FEATURED' },
  { id: 'lab', label: 'LAB 🧪' },
]

function ProjectCard({ p, i }) {
  if (p.locked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: (i % 3) * 0.08 }}
        className="flex min-h-[170px] flex-col justify-center rounded-lg border border-dashed border-stargold/40 bg-space-deep/60 p-5 text-center backdrop-blur-sm"
      >
        <p className="font-code text-sm tracking-widest text-stargold/90">{p.title}</p>
        <p className="mt-2 font-code text-[11px] text-white/50">{p.blurb}</p>
        <p className="mt-3 animate-pulse font-code text-[10px] tracking-[0.3em] text-stargold/50">
          ● ● ●
        </p>
      </motion.div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: (i % 3) * 0.08 }}
      className="group flex min-h-[170px] flex-col rounded-lg border border-space-grad bg-space-deep/70 p-5 backdrop-blur-sm transition hover:border-plasma-mid/70 hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-code text-sm text-plasma">{p.title}</p>
        {p.featured && <span className="font-code text-[10px] text-stargold">★</span>}
      </div>
      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-white/70">{p.blurb}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.tech.map((t, ti) => (
          <span
            key={t}
            className="rounded border px-2 py-0.5 font-code text-[10px]"
            style={{ borderColor: `${ACCENTS[ti % 3]}55`, color: ACCENTS[ti % 3] }}
          >
            {t}
          </span>
        ))}
      </div>
      {(p.github || p.demo) && (
        <div className="mt-3 flex gap-4 font-code text-[11px]">
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" className="text-plasma-mid hover:text-plasma">
              ⌥ github
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" className="text-stargold/80 hover:text-stargold">
              ⏵ live demo
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const list = useMemo(() => {
    if (filter === 'featured') return projects.filter((p) => p.featured && !p.locked)
    if (filter === 'lab') return projects.filter((p) => p.ai)
    return projects
  }, [filter])

  return (
    <section id="projects" className="dom-layer min-h-[250vh] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-code text-sm tracking-[0.3em] text-plasma md:text-base">
          🛰️ DEEP SPACE STATIONS
        </h2>
        <p className="mt-2 text-center font-code text-[11px] text-white/50">
          missions launched · transmissions incoming
        </p>

        <div className="mt-8 flex justify-center gap-3">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => { sfx.click(); setFilter(f.id) }}
              className={`rounded-full border px-4 py-1.5 font-code text-[11px] tracking-wider transition ${
                filter === f.id
                  ? 'border-plasma bg-space-mid text-plasma shadow-[0_0_16px_rgba(103,232,249,0.35)]'
                  : 'border-space-grad text-white/60 hover:border-plasma-mid/60 hover:text-plasma-mid'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
