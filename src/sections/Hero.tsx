import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import HeroCanvas, { type HeroParticle } from '../components/HeroCanvas'

const HEADLINE = ['Tu empresa,', 'potenciada con IA.']

const SUBTEXT =
  'Capacitamos a tu equipo en Excel, inteligencia artificial y herramientas digitales para que trabajen mejor, más rápido y con mayor impacto.'

const LOGOS = [
  'PEMEX',
  'PayJoy',
  'IndusMX',
  'GrupoNorte',
  'TechPyME',
  'Altura',
  'Norte Labs',
  'Vector AI',
]

type HeroProps = {
  initialParticles: HeroParticle[]
  introDone: boolean
}

export default function Hero({
  initialParticles,
  introDone,
}: HeroProps) {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<HTMLDivElement[]>([])
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!introDone) return

    const tl = gsap.timeline({ delay: 0.15 })

    tl.fromTo(
      eyebrowRef.current,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
      },
    )
      .fromTo(
        linesRef.current.filter(Boolean),
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.82,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.28',
      )
      .fromTo(
        subRef.current,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.62,
          ease: 'power2.out',
        },
        '-=0.36',
      )
      .fromTo(
        ctasRef.current,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.26',
      )
      .fromTo(
        carouselRef.current,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
        },
        '-=0.1',
      )

    return () => {
      tl.kill()
    }
  }, [introDone])

  return (
    <>
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          overflow: 'hidden',
          background: 'var(--hero-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '132px 0 72px',
        }}
      >
        <HeroCanvas initialParticles={initialParticles} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: 'min(980px, calc(100% - 48px))',
            textAlign: 'center',
          }}
        >
          <div
            ref={eyebrowRef}
            style={{
              opacity: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '30px',
              color: '#0BB3A4',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#0BB3A4',
                boxShadow: '0 0 12px rgba(11,179,164,0.6)',
              }}
            />

            Aliado tecnológico para PyMEs en Latam
          </div>

          <h1
            style={{
              fontFamily: 'Raleway, Poppins, sans-serif',
              fontWeight: 800,
              lineHeight: 0.96,
              margin: '0 0 28px',
              color: 'var(--hero-text)',
            }}
          >
            {HEADLINE.map((line, i) => (
              <div
                key={line}
                ref={(el) => {
                  if (el) linesRef.current[i] = el
                }}
                style={{
                  opacity: 0,
                  fontSize: 'clamp(3.6rem, 8vw, 7.2rem)',
                }}
              >
                {i === 1 ? (
                  <>
                    potenciada con{' '}
                    <span style={{ color: '#0BB3A4' }}>
                      IA.
                    </span>
                  </>
                ) : (
                  line
                )}
              </div>
            ))}
          </h1>

          <p
            ref={subRef}
            style={{
              opacity: 0,
              maxWidth: 650,
              margin: '0 auto 36px',
              color: 'var(--text-muted)',
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              lineHeight: 1.8,
            }}
          >
            {SUBTEXT}
          </p>

          <div
            ref={ctasRef}
            style={{
              opacity: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <a
              href="#contacto"
              style={{
                display: 'inline-flex',
                padding: '14px 28px',
                borderRadius: 999,
                background: '#0BB3A4',
                color: '#000050',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow:
                  '0 16px 45px rgba(11,179,164,0.24)',
              }}
            >
              Agendar demo →
            </a>

            <a
              href="#proceso"
              style={{
                display: 'inline-flex',
                padding: '14px 26px',
                borderRadius: 999,
                border: '1px solid var(--line-soft)',
                color: 'var(--text-heading)',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.28)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Ver cómo funciona
            </a>
          </div>
        </div>
      </section>

      <section
        style={{
          position: 'relative',
          zIndex: 3,
          background: 'var(--hero-bg)',
          padding: '48px 0 34px',
          borderTop: '1px solid var(--line-soft)',
          borderBottom: '1px solid var(--line-soft)',
        }}
      >
        <div
          style={{
            width: 'min(980px, calc(100% - 48px))',
            margin: '0 auto',
          }}
        >
          <LogoCarousel carouselRef={carouselRef} />
        </div>
      </section>
    </>
  )
}

function LogoCarousel({
  carouselRef,
}: {
  carouselRef: React.RefObject<HTMLDivElement | null>
}) {
  const items = [...LOGOS, ...LOGOS]

  return (
    <div
      ref={carouselRef}
      style={{
        opacity: 0,
        marginTop: '0px',
        overflow: 'hidden',
        padding: '10px 0',
      }}
    >
      <style>{`
        @keyframes sinceroMarquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation:
            'sinceroMarquee 28s linear infinite',
        }}
      >
        {items.map((logo, index) => (
          <span
            key={`${logo}-${index}`}
            style={{
              minWidth: 170,
              textAlign: 'center',
              color: 'var(--text-muted)',
              opacity: 0.52,
              fontFamily:
                'Raleway, Poppins, sans-serif',
              fontWeight: 800,
              letterSpacing: '0.06em',
              fontSize: 14,
              filter: 'grayscale(1)',
            }}
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  )
}