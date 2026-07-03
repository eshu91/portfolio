import Scene from './components/canvas/Scene'
import Loader from './components/ui/Loader'
import Hero from './components/sections/Hero'

/*
 * Single-canvas architecture: <Scene/> is fixed behind everything,
 * DOM sections scroll over it. Sectors land here as they're built:
 * Hero → About → Skills → Projects → Roadmap → Contact.
 */
export default function App() {
  return (
    <>
      <Loader />
      <Scene />
      <main>
        <Hero />
        {/* phase 2: <About/> <Skills/> — phase 3: <Projects/> <Roadmap/> <Contact/> */}
      </main>
    </>
  )
}
