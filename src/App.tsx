import { useCallback, useRef, useState } from 'react'
import './index.css'
import IntroAnimation from './components/IntroAnimation'
import Nav            from './components/Nav'
import Hero           from './sections/Hero'
import Pain           from './sections/Pain'
import Solution       from './sections/Solution'
import CTA            from './sections/CTA'
import SocialProof    from './sections/SocialProof'
import Footer         from './sections/Footer'
import type { HeroParticle } from './components/HeroCanvas'

export default function App() {
  const particlesRef = useRef<HeroParticle[]>([])
  const [particlesSnapshot, setParticlesSnapshot] = useState<HeroParticle[]>([])
  const [introDone, setIntroDone] = useState(false)

  const handleIntroComplete = useCallback(() => {
    setParticlesSnapshot([...particlesRef.current])
    setIntroDone(true)
  }, [])

  return (
    <>
      {!introDone && <IntroAnimation onComplete={handleIntroComplete} particlesRef={particlesRef} />}

      <main style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background 0.3s ease' }}>
        <Nav />
        <Hero initialParticles={particlesSnapshot} introDone={introDone} />
        <Pain />
        <Solution />
        <CTA />
        <SocialProof />
        <Footer />
      </main>
    </>
  )
}
