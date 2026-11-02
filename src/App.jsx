import { useSmoothScroll } from './hooks/useSmoothScroll'
import Cursor from './components/Cursor'
import Hud from './components/Hud'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Journey from './components/Journey'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  useSmoothScroll()

  return (
    <div className="min-h-screen bg-ink text-bone font-sans selection:bg-signal selection:text-ink">
      <Cursor />
      <Hud />
      <main>
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
