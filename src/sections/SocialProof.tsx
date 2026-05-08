import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const TESTIMONIALS = [
  {
    quote: 'En menos de 3 meses, nuestro equipo pasó de usar Excel básico a automatizar reportes que antes tomaban días enteros. Sincero transformó nuestra forma de trabajar.',
    name: 'María González',
    role: 'Gerente de Operaciones',
    company: 'PEMEX',
    initials: 'MG',
    color: '#0BB3A4',
  },
  {
    quote: 'Lo que más valoramos fue que el programa fue 100% a medida. No teoría genérica, ejercicios reales con nuestros datos y los procesos del día a día.',
    name: 'Carlos Méndez',
    role: 'CEO',
    company: 'PayJoy',
    initials: 'CM',
    color: '#75C1E7',
  },
  {
    quote: 'El equipo adoptó las herramientas de IA mucho más rápido de lo que esperábamos. El acompañamiento post-capacitación marcó la diferencia.',
    name: 'Laura Torres',
    role: 'Directora de RRHH',
    company: 'IndusMX',
    initials: 'LT',
    color: '#B39DDB',
  },
  {
    quote: 'Teníamos resistencia interna al cambio. El enfoque práctico de Sincero convirtió a los más escépticos en embajadores digitales.',
    name: 'Andrés Palacios',
    role: 'Director Comercial',
    company: 'GrupoNorte',
    initials: 'AP',
    color: '#FFA07A',
  },
]

const CLIENTS = ['PEMEX', 'PayJoy', 'IndusMX', 'TechPyME', 'GrupoNorte']

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const isAnimating = useRef(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.82, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  function goTo(idx: number) {
    if (idx === active || isAnimating.current) return
    isAnimating.current = true
    const el = contentRef.current
    if (!el) { isAnimating.current = false; return }
    const dir = idx > active ? 1 : -1

    gsap.to(el, {
      opacity: 0,
      x: dir * -20,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        setActive(idx)
        gsap.fromTo(el, { opacity: 0, x: dir * 20 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out', onComplete: () => { isAnimating.current = false } })
      },
    })
  }

  useEffect(() => {
    const id = setInterval(() => setActive(prev => (prev + 1) % TESTIMONIALS.length), 5200)
    return () => clearInterval(id)
  }, [])

  const t = TESTIMONIALS[active]

  return (
    <section ref={sectionRef} style={{ background: 'var(--bg)', padding: '112px 0 128px', borderBottom: '1px solid var(--line-soft)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px' }}>
        <h2 style={{ fontFamily: 'Raleway, Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.08, color: 'var(--text-heading)', textAlign: 'center', marginBottom: '48px' }}>
          Lo que dicen nuestros <span style={{ color: '#0BB3A4' }}>clientes</span>
        </h2>

        <div ref={cardRef} style={{ background: '#0A0C1E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '22px', padding: '48px 52px 44px', marginBottom: '20px', opacity: 0 }}>
          <div ref={contentRef} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '60px', alignItems: 'center' }}>
            <blockquote style={{ margin: 0 }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 500, lineHeight: 1.55, color: '#ffffff' }}>
                "{t.quote}"
              </p>
            </blockquote>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '140px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}33, ${t.color}11)`, border: `2px solid ${t.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: t.color }}>
                {t.initials}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 2 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{t.role}</div>
                <div style={{ marginTop: 7, fontSize: 11, color: '#0BB3A4', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.company}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--line-soft)', paddingTop: '20px' }}>
          {CLIENTS.map(name => {
            const isActive = TESTIMONIALS[active]?.company === name
            return (
              <button key={name} onClick={() => { const idx = TESTIMONIALS.findIndex(item => item.company === name); if (idx >= 0) goTo(idx) }} style={{ background: isActive ? 'rgba(11,179,164,0.09)' : 'transparent', border: `1px solid ${isActive ? 'rgba(11,179,164,0.18)' : 'var(--line-soft)'}`, borderRadius: 999, padding: '10px 22px', cursor: 'pointer', color: isActive ? '#0BB3A4' : 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>
                {name}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
