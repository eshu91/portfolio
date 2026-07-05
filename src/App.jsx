import { useRef } from 'react'
import Scene from './components/canvas/Scene'
import Loader from './components/ui/Loader'
import FxOverlay from './components/ui/FxOverlay'
import SoundToggle from './components/ui/SoundToggle'
import SectorRail from './components/ui/SectorRail'
import ThemeToggle from './components/ui/ThemeToggle'
import Void404 from './components/ui/Void404'
import { Analytics } from '@vercel/analytics/react'
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
const notFound =
  typeof window !== 'undefined' &&
  !['/', '/index.html'].includes(window.location.pathname)

export default function App() {
  useSmoothScroll()
  const rootRef = useRef(null)
  if (notFound) {
    return (
      <>
        <Void404 />
        <Analytics />
      </>
    )
  }
  return (
    <div ref={rootRef}>
      <Loader />
      <Scene eventSource={rootRef} />
      <FxOverlay />
      <SoundToggle />
      <ThemeToggle />
      <SectorRail />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Roadmap />
        <Contact />
      </main>
      <Analytics />
    </div>
  )
}
