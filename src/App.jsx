import { useRef } from 'react'
import Scene from './components/canvas/Scene'
import Loader from './components/ui/Loader'
import FxOverlay from './components/ui/FxOverlay'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Roadmap from './components/sections/Roadmap'
import Contact from './components/sections/Contact'
import { useSmoothScroll } from './hooks/useSmoothScroll'

/*
 * Single-canvas architecture: <Scene/> fixed behind, DOM sections scroll
 * over it, FxOverlay (cursor trail + scroll comet) floats above both.
 * Full flight path: Launch → Observatory → Solar System → Stations →
 * Trajectory Map → Transmission.
 */
export default function App() {
  useSmoothScroll()
  const rootRef = useRef(null)
  return (
    <div ref={rootRef}>
      <Loader />
      <Scene eventSource={rootRef} />
      <FxOverlay />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Roadmap />
        <Contact />
      </main>
    </div>
  )
}
