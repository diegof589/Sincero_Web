import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const CHIPS = [
  'Excel manual',
  'Sin IA',
  'Datos caóticos',
  'Sin tiempo',
  'Procesos lentos',
  'Resistencia digital',
  'Sin resultados',
  'Capacitación genérica',
  'Herramientas sin uso',
  'Reuniones infinitas',
]

/* Highlight colors that cycle with each active chip */
const COLORS = [
  { bg: '#0BB3A4', text: '#000050', glow: 'rgba(11,179,164,0.45)' },
  { bg: '#FFA07A', text: '#2A0A00', glow: 'rgba(255,160,122,0.45)' },
  { bg: '#75C1E7', text: '#000050', glow: 'rgba(117,193,231,0.45)' },
  { bg: '#B39DDB', text: '#1A0038', glow: 'rgba(179,157,219,0.45)' },
  { bg: '#6BCB77', text: '#002010', glow: 'rgba(107,203,119,0.45)' },
]

export default function Pain() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)
  const chipsRef   = useRef<HTMLDivElement>(null)

  const [activeIdx, setActiveIdx] = useState(0)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [colorIdx,  setColorIdx]  = useState(0)

  /* Cycle active chip pseudo-randomly (never repeats same index twice) */
  useEffect(() => {
    if (hoverIdx !== null) return
    const id = setInterval(() => {
      setActiveIdx(prev => {
        let next
        do { next = Math.floor(Math.random() * CHIPS.length) } while (next === prev)
        return next
      })
      setColorIdx(prev => {
        let next
        do { next = Math.floor(Math.random() * COLORS.length) } while (next === prev)
        return next
      })
    }, 1800)
    return () => clearInterval(id)
  }, [hoverIdx])

  /* Entry animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
      })
      .fromTo(leftRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
      )
      .fromTo(rightRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.55'
      )

      if (chipsRef.current) {
        gsap.fromTo(
          chipsRef.current.querySelectorAll<HTMLElement>('[data-chip]'),
          { y: 14, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.055, duration: 0.3, ease: 'power2.out',
            scrollTrigger: { trigger: chipsRef.current, start: 'top 75%' },
            delay: 0.25,
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const activeColor = COLORS[colorIdx]

  return (
    <section
      ref={sectionRef}
      style={{ background: 'var(--bg)', padding: '112px 0', transition: 'background 0.3s ease', borderBottom: '1px solid var(--line-soft)' }}
    >
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px',
        alignItems: 'center',
      }}>

        {/* ── Left ── */}
        <div ref={leftRef} style={{ opacity: 0 }}>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#0BB3A4', marginBottom: '24px',
          }}>
            Reconocemos el problema
          </p>

          <h2 style={{
            fontFamily: 'Raleway, Poppins, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
            lineHeight: 1.1, letterSpacing: '-0.02em',
            color: 'var(--text-heading)', marginBottom: '28px',
          }}>
            Mucho trabajo.<br />
            Pocas herramientas.
          </h2>

          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '15px', fontWeight: 400,
            lineHeight: 1.75, color: 'var(--text-muted)', maxWidth: '420px',
          }}>
            Las PyMEs de Latam tienen equipos con talento, pero sin las herramientas
            ni el conocimiento para aprovechar la tecnología disponible. No es falta
            de voluntad. Es falta de acompañamiento.
          </p>
        </div>

        {/* ── Right card ── */}
        <div ref={rightRef} style={{ opacity: 0 }}>
          <div style={{
            background: '#050816',
            borderRadius: '18px',
            padding: '28px 32px 32px',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
            backdropFilter: 'blur(10px)',
          }}>
            <p style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#ffffff',
              marginBottom: '20px',
              lineHeight: 1.4,
            }}>
              Lo que escuchamos de equipos como el tuyo:
            </p>

            <div ref={chipsRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
              {CHIPS.map((label, idx) => {
                const effectiveIdx = hoverIdx !== null ? hoverIdx : activeIdx
                const isActive = idx === effectiveIdx

                return (
                  <span
                    key={label}
                    data-chip
                    onMouseEnter={() => setHoverIdx(idx)}
                    onMouseLeave={() => setHoverIdx(null)}
                    style={{
                      display: 'inline-block',
                      padding: '7px 15px',
                      borderRadius: '9999px',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'default',
                      transition:
                        'background 0.45s ease, border-color 0.45s ease, color 0.45s ease, box-shadow 0.45s ease',

                      background: isActive
                        ? activeColor.bg
                        : 'rgba(255,255,255,0.05)',

                      color: isActive
                        ? activeColor.text
                        : 'rgba(255,255,255,0.78)',

                      border: `1.5px solid ${
                        isActive
                          ? activeColor.bg
                          : 'rgba(255,255,255,0.08)'
                      }`,

                      boxShadow: isActive
                        ? `0 0 18px ${activeColor.glow}`
                        : 'none',
                    }}
                  >
                    {label}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
