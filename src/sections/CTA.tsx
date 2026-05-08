import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import logoMark from '../assets/logo-mark-teal.svg'
import HeroCanvas from '../components/HeroCanvas'

function MiniNetworkVisual() {
  return (
    <div
      style={{
        position: 'relative',
        width: 420,
        maxWidth: '100%',
        aspectRatio: '1',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <HeroCanvas variant="teal" />

      <div
        style={{
          position: 'absolute',
          inset: '50% auto auto 50%',
          transform: 'translate(-50%, -50%)',
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          border: '1px solid rgba(255,255,255,0.34)',
          display: 'grid',
          placeItems: 'center',
          backdropFilter: 'blur(10px)',
          zIndex: 2,
        }}
      >
        <img
          src={logoMark}
          alt=""
          style={{
            width: 52,
            height: 52,
            filter: 'brightness(0) invert(1)',
          }}
        />
      </div>
    </div>
  )
}
export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } })
      gsap.fromTo(rightRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' }, delay: 0.15 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: '#0BB3A4', padding: '118px 0', transition: 'background 0.3s ease', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '64px', alignItems: 'center' }}>
        <div ref={leftRef} style={{ opacity: 0 }}>
          <MiniNetworkVisual />
        </div>

        <div ref={rightRef} style={{ opacity: 0 }}>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(0,0,80,0.62)', marginBottom: '24px' }}>
            Agenda el diagnóstico
          </p>
          <h2 style={{ fontFamily: 'Raleway, Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.45rem)', lineHeight: 1.08, color: '#000050', marginBottom: '24px' }}>
            Ve exactamente qué está<br />
            <em style={{ fontStyle: 'italic', color: '#ffffff', fontWeight: 800 }}>frenando</em> a tu equipo —<br />
            en 30 minutos.
          </h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', lineHeight: 1.65, color: 'rgba(0,0,80,0.72)', maxWidth: '390px', marginBottom: '34px' }}>
            Te mostramos qué herramientas generan impacto y cómo implementarlas la semana siguiente.
          </p>
          <a
            href="#contacto"
            style={{ display: 'inline-flex', padding: '14px 28px', borderRadius: 999, background: '#000050', color: '#ffffff', fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 18px 42px rgba(0,0,80,0.22)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 24px 54px rgba(0,0,80,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 18px 42px rgba(0,0,80,0.22)' }}
          >
            Agendar diagnóstico gratuito →
          </a>
        </div>
      </div>
    </section>
  )
}
