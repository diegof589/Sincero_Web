import type { HeroParticle } from './HeroCanvas'

export type NetworkNode = HeroParticle & {
  id: number
  ox: number
  oy: number
}

const POINTS = [
  [0.08, 0.16], [0.15, 0.28], [0.07, 0.46], [0.16, 0.62], [0.09, 0.82],
  [0.25, 0.12], [0.31, 0.26], [0.24, 0.43], [0.30, 0.74], [0.22, 0.88],
  [0.42, 0.09], [0.48, 0.22], [0.40, 0.34], [0.42, 0.68], [0.50, 0.84],
  [0.58, 0.13], [0.62, 0.30], [0.59, 0.70], [0.62, 0.88],
  [0.73, 0.10], [0.78, 0.24], [0.72, 0.42], [0.80, 0.62], [0.72, 0.80],
  [0.90, 0.18], [0.86, 0.36], [0.92, 0.52], [0.86, 0.74], [0.94, 0.88],
  [0.36, 0.52], [0.64, 0.52], [0.52, 0.36], [0.52, 0.64],
]

export function createNetworkNodes(width: number, height: number): NetworkNode[] {
  return POINTS.map(([px, py], id) => {
    const x = px * width
    const y = py * height

    return {
      id,
      ox: px,
      oy: py,
      x,
      y,
      vx: 0,
      vy: 0,
      size: id % 5 === 0 ? 3.1 : 2.2,
      color: '#0BB3A4',
      opacity: id % 4 === 0 ? 0.76 : 0.55,
      twinkle: id * 0.63,
    }
  })
}

export function scaleNetworkNodes(nodes: NetworkNode[], width: number, height: number) {
  for (const node of nodes) {
    node.x = node.ox * width
    node.y = node.oy * height
  }
}

export function introRingOrder(nodes: NetworkNode[], width: number, height: number) {
  const cx = width / 2
  const cy = height / 2
  return [...nodes].sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx))
}
