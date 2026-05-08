import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import logoMark from '../assets/logo-mark-teal.svg'
import type { HeroParticle } from './HeroCanvas'

type IntroParticle = HeroParticle & {
  baseX: number
  baseY: number
}

type IntroAnimationProps = {
  onComplete: () => void
  particlesRef: React.MutableRefObject<HeroParticle[]>
}

const TEAL = '#0BB3A4'
const WAVE_LINE = 'rgba(11,179,164,0.75)'

function createParticles(w: number, h: number): IntroParticle[] {
  const cx = w / 2
  const cy = h / 2
  const hole = Math.min(w, h) * 0.18
  const particles: IntroParticle[] = []

  const cols = 18
  const rows = 10

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = (x + 0.5) * (w / cols)
      const py = (y + 0.5) * (h / rows)

      const dx = px - cx
      const dy = py - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < hole) continue

      const jitterX = Math.sin(x * 12.989 + y * 78.233) * 24
      const jitterY = Math.cos(x * 4.42 + y * 19.17) * 24

      particles.push({
        x: px + jitterX,
        y: py + jitterY,
        baseX: px + jitterX,
        baseY: py + jitterY,
        vx: 0,
        vy: 0,
        size: 1.5 + ((x + y) % 3) * 0.75,
        color: TEAL,
        opacity: 0.55 + ((x + y) % 4) * 0.1,
        twinkle: Math.random() * Math.PI * 2,
      })
    }
  }

  return particles
}

function drawBaseNetwork(ctx: CanvasRenderingContext2D, particles: IntroParticle[]) {
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]

    const nearby = particles
      .map((b, index) => {
        const dx = a.x - b.x
        const dy = a.y - b.y
        return { index, dist: Math.sqrt(dx * dx + dy * dy) }
      })
      .filter(item => item.index !== i && item.dist < 145)
      .sort((p, q) => p.dist - q.dist)
      .slice(0, 2)

    for (const item of nearby) {
      if (item.index < i) continue

      const b = particles[item.index]
      const alpha = 1 - item.dist / 145

      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.strokeStyle = `rgba(11,179,164,${0.12 * alpha})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  progress: number,
) {
  const total = 42
  const visibleTrail = 0.22

  for (let i = 0; i < total; i++) {
    const start = i / total
    const end = (i + 1) / total

    const distanceFromHead = progress - start

    if (distanceFromHead < 0 || distanceFromHead > visibleTrail) continue

    const fade = 1 - distanceFromHead / visibleTrail
    const a1 = start * Math.PI * 2 - Math.PI / 2
    const a2 = end * Math.PI * 2 - Math.PI / 2

    ctx.beginPath()
    ctx.arc(cx, cy, radius, a1, a2)
    ctx.strokeStyle = `rgba(11,179,164,${0.2 + fade * 0.65})`
    ctx.lineWidth = 2.2 + fade * 1.8
    ctx.shadowBlur = 12
    ctx.shadowColor = WAVE_LINE
    ctx.stroke()
    ctx.shadowBlur = 0

    const px = cx + Math.cos(a2) * radius
    const py = cy + Math.sin(a2) * radius

    ctx.beginPath()
    ctx.fillStyle = `rgba(11,179,164,${0.55 + fade * 0.45})`
    ctx.arc(px, py, 3.2, 0, Math.PI * 2)
    ctx.fill()
  }
}

export default function IntroAnimation({ onComplete, particlesRef }: IntroAnimationProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const particlesLocalRef = useRef<IntroParticle[]>([])
  const rafRef = useRef<number>(0)

  const stateRef = useRef({
    particlesOpacity: 0,
    baseLinesOpacity: 0,
    waveProgress: 0,
    logoOpacity: 0,
    logoScale: 0.85,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      particlesLocalRef.current = createParticles(window.innerWidth, window.innerHeight)
    }

    const draw = (time: number) => {
      const W = window.innerWidth
      const H = window.innerHeight
      const cx = W / 2
      const cy = H / 2
      const radius = Math.min(W, H) * 0.19
      const state = stateRef.current
      const particles = particlesLocalRef.current

      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, W, H)

      ctx.save()
      ctx.globalAlpha = state.baseLinesOpacity
      drawBaseNetwork(ctx, particles)
      ctx.restore()

      for (const p of particles) {
        p.twinkle += 0.015

        const driftX =
          Math.sin(time * 0.00022 + p.baseY * 0.01 + p.twinkle) * 1.5

        const driftY =
          Math.cos(time * 0.00018 + p.baseX * 0.01 + p.twinkle) * 1.5

        p.x = p.baseX + driftX
        p.y = p.baseY + driftY

        const pulse = 0.8 + Math.sin(time * 0.001 + p.twinkle) * 0.2
        ctx.beginPath()
        ctx.fillStyle = `rgba(11,179,164,${p.opacity * pulse * state.particlesOpacity})`
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      drawWave(ctx, cx, cy, radius, state.waveProgress)

      if (logoRef.current) {
        logoRef.current.style.opacity = `${state.logoOpacity}`
        logoRef.current.style.transform = `translate(-50%, -50%) scale(${state.logoScale})`
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(draw)

    const tl = gsap.timeline({
      onComplete: () => {
        particlesRef.current = particlesLocalRef.current.map(p => ({
          x: p.x,
          y: p.y,
          vx: 0,
          vy: 0,
          size: p.size,
          color: p.color,
          opacity: p.opacity,
          twinkle: p.twinkle,
        }))

        onComplete()
      },
    })

    tl
      .to(stateRef.current, {
        particlesOpacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      })
      .to(stateRef.current, {
        baseLinesOpacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.25)
      .to(stateRef.current, {
        waveProgress: 1.25,
        duration: 2.15,
        ease: 'power1.inOut',
      }, 0.8)
      .to(stateRef.current, {
        logoOpacity: 1,
        logoScale: 1,
        duration: 1,
        ease: 'power3.out',
      }, 1.55)
      .to(stateRef.current, {
        logoOpacity: 0,
        logoScale: 0.96,
        duration: 0.55,
        ease: 'power2.inOut',
      }, 3.1)
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.65,
        ease: 'power2.out',
      }, 3.45)

    return () => {
      tl.kill()
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [onComplete, particlesRef])

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#ffffff',
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        data-no-transition
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      <img
        ref={logoRef}
        src={logoMark}
        alt=""
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '90px',
          height: '90px',
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.85)',
          filter: 'drop-shadow(0 0 22px rgba(11,179,164,0.35))',
        }}
      />
    </div>
  )
}