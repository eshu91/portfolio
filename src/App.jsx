import { useRef } from 'react'
import Scene from './components/canvas/Scene'
import Loader from './components/ui/Loader'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import { useSmoothScroll } from './hooks/useSmoothScroll'

/*
 * Single-canvas architecture: <Scene/> is fixed behind everything,
 * DOM sections scroll over it. Lenis smooth scroll drives the GSAP
 * camera scrub. rootRef feeds R3F's eventSource so planet raycasting
 * works through the DOM layer.
 * Sectors: Hero → About → Skills  (phase 3: Projects → Roadmap → Contact)
 */
export default function App() {
  useSmoothScroll()
  const rootRef = useRef(null)
  return (
    <div ref={rootRef}>
      <Loader />
      <Scene eventSource={rootRef} />
      <main>
        <Hero />
        <About />
        <Skills />
        {/* phase 3: <Projects/> <Roadmap/> <Contact/> */}
      </main>
    </div>
  )
}
