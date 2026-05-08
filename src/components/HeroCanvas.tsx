import { useEffect, useRef } from 'react'

export interface HeroParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  twinkle: number
}

type Node = HeroParticle & {
  baseX: number
  baseY: number
}

type HeroCanvasProps = {
  initialParticles?: HeroParticle[]
  variant?: 'page' | 'teal'
}

const TEAL = '#0BB3A4'

function createFallbackNodes(w: number, h: number, variant: 'page' | 'teal'): Node[] {
  const nodes: Node[] = []

  const cols = variant === 'teal' ? 9 : 18
  const rows = variant === 'teal' ? 9 : 10
  const cx = w / 2
  const cy = h / 2
  const hole = Math.min(w, h) * (variant === 'teal' ? 0.11 : 0.17)

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = (x + 0.5) * (w / cols)
      const py = (y + 0.5) * (h / rows)

      const dx = px - cx
      const dy = py - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < hole) continue

      const jitterX = Math.sin(x * 12.989 + y * 78.233) * 22
      const jitterY = Math.cos(x * 4.42 + y * 19.17) * 22

      const finalX = px + jitterX
      const finalY = py + jitterY

      nodes.push({
        x: finalX,
        y: finalY,
        baseX: finalX,
        baseY: finalY,
        vx: 0,
        vy: 0,
        size: variant === 'teal' ? 2.5 : 3.5,
        color: variant === 'teal' ? '#ffffff' : TEAL,
        opacity: variant === 'teal' ? 0.8 : 0.65,
        twinkle: (x * 0.73 + y * 1.17) % 6.28,
      })
    }
  }

  return nodes
}

function createNodesFromIntro(particles: HeroParticle[]): Node[] {
  return particles.map((p) => ({
    ...p,
    baseX: p.x,
    baseY: p.y,
    vx: 0,
    vy: 0,
  }))
}

export default function HeroCanvas({
  initialParticles = [],
  variant = 'page',
}: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const w = rect.width || window.innerWidth
      const h = rect.height || window.innerHeight

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!nodesRef.current.length) {
        nodesRef.current = initialParticles.length
          ? createNodesFromIntro(initialParticles)
          : createFallbackNodes(w, h, variant)
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      }
    }

    const onMouseLeave = () => {
      mouseRef.current.active = false
    }

    const drawBaseNetwork = (nodes: Node[]) => {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]

        const nearby = nodes
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

          const b = nodes[item.index]
          const alpha = 1 - item.dist / 145

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle =
            variant === 'teal'
              ? `rgba(255,255,255,${0.26 * alpha})`
              : `rgba(11,179,164,${0.12 * alpha})`
          ctx.lineWidth = variant === 'teal' ? 1 : 1.5
          ctx.stroke()
        }
      }
    }
    const drawHoverNetwork = (nodes: Node[]) => {
      const mouse = mouseRef.current
      if (!mouse.active) return

      const hoverDistance = variant === 'teal' ? 125 : 145
      const nodeDistance = variant === 'teal' ? 105 : 125
      const maxConnections = variant === 'teal' ? 1 : 3
      const lineColor = variant === 'teal' ? '255,255,255' : '76,86,255'

      let count = 0

      for (let i = 0; i < nodes.length; i++) {
        if (count >= maxConnections) break

        const a = nodes[i]
        const da = Math.hypot(a.x - mouse.x, a.y - mouse.y)

        if (da > hoverDistance) continue

        for (let j = i + 1; j < nodes.length; j++) {
          if (count >= maxConnections) break

          const b = nodes[j]
          const db = Math.hypot(b.x - mouse.x, b.y - mouse.y)
          const ab = Math.hypot(a.x - b.x, a.y - b.y)

          if (db < hoverDistance && ab < nodeDistance) {
            const alpha = Math.min(
              1 - da / hoverDistance,
              1 - db / hoverDistance,
            )

            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${lineColor},${0.18 + alpha * 0.34})`
            ctx.lineWidth = variant === 'teal' ? 1.25 : 2.5
            ctx.stroke()

            count++
          }
        }
      }
    }

    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width || window.innerWidth
      const h = rect.height || window.innerHeight
      const nodes = nodesRef.current

      ctx.clearRect(0, 0, w, h)

      for (const node of nodes) {
        node.x =
          node.baseX +
          Math.sin(time * 0.001 + node.baseY * 0.01 + node.twinkle) * 3

        node.y =
          node.baseY +
          Math.cos(time * 0.001 + node.baseX * 0.01 + node.twinkle) * 3
      }

      drawBaseNetwork(nodes)
      drawHoverNetwork(nodes)

      for (const node of nodes) {
        const pulse = 0.8 + Math.sin(time * 0.001 + node.twinkle) * 0.2
        const rgb = variant === 'teal' ? '255,255,255' : '11,179,164'

        ctx.beginPath()
        ctx.fillStyle = `rgba(${rgb},${node.opacity * pulse})`
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [initialParticles, variant])

  return (
    <canvas
      ref={canvasRef}
      data-no-transition
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'auto',
      }}
    />
  )
}