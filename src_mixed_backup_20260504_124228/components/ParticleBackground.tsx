import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

type ParticleBackgroundProps = {
  className?: string;
};

const palette = {
  light: {
    node: "11, 179, 164",
    line: "13, 21, 178",
    glow: "0, 0, 80",
  },
  dark: {
    node: "115, 245, 230",
    line: "85, 125, 255",
    glow: "11, 179, 164",
  },
};

export default function ParticleBackground({ className = "" }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const safeCanvas = canvas;
    const ctx = context;
    let width = 0;
    let height = 0;
    let frameId = 0;
    let particles: Particle[] = [];
    const colors = palette[theme];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const rect = safeCanvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      safeCanvas.width = width * pixelRatio;
      safeCanvas.height = height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const targetCount = Math.max(44, Math.min(92, Math.round((width * height) / 15500)));
      particles = Array.from({ length: targetCount }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = reducedMotion ? 0.03 : 0.12 + Math.random() * 0.18;

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.2 + Math.random() * 1.8,
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let index = 0; index < particles.length; index += 1) {
        const point = particles[index];
        const mouse = mouseRef.current;

        if (mouse.active) {
          const dx = mouse.x - point.x;
          const dy = mouse.y - point.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 170 && distance > 0.01) {
            const force = (1 - distance / 170) * 0.018;
            point.vx += (dx / distance) * force;
            point.vy += (dy / distance) * force;
          }
        }

        point.vx *= 0.992;
        point.vy *= 0.992;
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < -20) point.x = width + 20;
        if (point.x > width + 20) point.x = -20;
        if (point.y < -20) point.y = height + 20;
        if (point.y > height + 20) point.y = -20;

        for (let j = index + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = point.x - other.x;
          const dy = point.y - other.y;
          const distance = Math.hypot(dx, dy);
          const maxDistance = 128;

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.22;
            ctx.strokeStyle = `rgba(${colors.line}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${colors.node}, 0.74)`;
        ctx.shadowBlur = 16;
        ctx.shadowColor = `rgba(${colors.glow}, 0.34)`;
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frameId = requestAnimationFrame(draw);
    }

    function handleMouseMove(event: MouseEvent) {
      const rect = safeCanvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    }

    function handleMouseLeave() {
      mouseRef.current.active = false;
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    safeCanvas.addEventListener("mousemove", handleMouseMove);
    safeCanvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      safeCanvas.removeEventListener("mousemove", handleMouseMove);
      safeCanvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={`particle-canvas ${className}`} aria-hidden="true" />;
}
