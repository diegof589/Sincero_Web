import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

type IntroParticle = {
  angle: number;
  baseRadius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

type IntroAnimationProps = {
  onComplete: () => void;
};

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const leavingSetRef = useRef(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const safeCanvas = canvas;
    const ctx = context;
    const colors =
      theme === "dark"
        ? { bg: "#020314", text: "#f6ffff", node: "115,245,230", line: "70,100,255" }
        : { bg: "#f8fffe", text: "#000050", node: "11,179,164", line: "13,21,178" };

    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let frameId = 0;
    let start = performance.now();
    let completed = false;
    let particles: IntroParticle[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      safeCanvas.width = width * pixelRatio;
      safeCanvas.height = height * pixelRatio;
      safeCanvas.style.width = `${width}px`;
      safeCanvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      particles = Array.from({ length: 78 }, (_, index) => {
        const angle = (index / 78) * Math.PI * 2 + Math.random() * 0.8;
        const baseRadius = 44 + Math.random() * Math.min(width, height) * 0.2;

        return {
          angle,
          baseRadius,
          x: centerX + Math.cos(angle) * baseRadius,
          y: centerY + Math.sin(angle) * baseRadius,
          vx: 0,
          vy: 0,
          size: 1.8 + Math.random() * 2.4,
        };
      });
    }

    function drawLogo(alpha: number, pulse: number) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = colors.text;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 28 + pulse * 18;
      ctx.shadowColor = `rgba(${colors.node}, ${0.3 + pulse * 0.35})`;
      ctx.font = "700 52px Raleway, Arial, sans-serif";
      ctx.fillText("Sincero", centerX, centerY - 7);
      ctx.font = "500 15px Poppins, Arial, sans-serif";
      ctx.fillText("CONSULTING", centerX, centerY + 27);
      ctx.restore();
    }

    function animate(now: number) {
      const elapsed = reducedMotion ? 4600 : now - start;
      const energy = Math.min(elapsed / 2600, 1);
      const bang = Math.max(0, Math.min((elapsed - 2600) / 850, 1));
      const settle = Math.max(0, Math.min((elapsed - 3450) / 1200, 1));
      const fade = Math.max(0, Math.min((elapsed - 3900) / 700, 1));

      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, width, height);

      const pulse = 0.4 + Math.sin(elapsed * 0.007) * 0.5 * energy;
      const logoAlpha = 1 - bang * 0.92;
      const lineDistance = 156 + energy * 48;

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        const vibration = Math.sin(elapsed * 0.008 + i) * energy * 4;

        if (bang > 0) {
          const force = 7.5 * (1 - settle * 0.75);
          particle.vx += Math.cos(particle.angle) * force * 0.08;
          particle.vy += Math.sin(particle.angle) * force * 0.08;
        }

        particle.vx *= 0.972;
        particle.vy *= 0.972;

        if (bang === 0) {
          particle.x =
            centerX + Math.cos(particle.angle + elapsed * 0.00015) * (particle.baseRadius + vibration);
          particle.y =
            centerY + Math.sin(particle.angle + elapsed * 0.00015) * (particle.baseRadius + vibration);
        } else {
          particle.x += particle.vx;
          particle.y += particle.vy;
        }

        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);

          if (distance < lineDistance && bang < 0.72) {
            ctx.strokeStyle = `rgba(${colors.line}, ${(1 - distance / lineDistance) * (0.18 + energy * 0.28) * (1 - bang)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${colors.node}, ${0.42 + energy * 0.42 - fade * 0.35})`;
        ctx.shadowBlur = 20 + energy * 26;
        ctx.shadowColor = `rgba(${colors.node}, ${0.34 + pulse * 0.22})`;
        ctx.arc(particle.x, particle.y, particle.size + energy * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (bang > 0) {
        const radius = bang * Math.max(width, height) * 0.86;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, `rgba(${colors.node}, ${0.38 * (1 - bang)})`);
        gradient.addColorStop(0.42, `rgba(${colors.line}, ${0.18 * (1 - bang)})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      drawLogo(Math.max(0, logoAlpha), pulse);

      if (elapsed > 3900 && !leavingSetRef.current) {
        leavingSetRef.current = true;
        setIsLeaving(true);
      }

      if (elapsed > 4700 && !completed) {
        completed = true;
        onComplete();
        return;
      }

      frameId = requestAnimationFrame(animate);
    }

    resize();
    start = performance.now();
    frameId = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete, theme]);

  return (
    <div className={`intro-overlay ${isLeaving ? "intro-overlay--leaving" : ""}`}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
