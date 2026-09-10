"use client";

import { useEffect, useRef } from "react";

type Particle = {
  /** Resting grid X (CSS pixels). */
  ox: number;
  /** Resting grid Y (CSS pixels). */
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  /** Brand tint: 0 primary, 1 growth, 2 gold. */
  tint: 0 | 1 | 2;
};

const COLORS = [
  "30, 58, 95", // primary navy
  "46, 125, 50", // growth green
  "255, 193, 7", // gold
] as const;

/**
 * Full-bleed interactive particle field.
 * Ambient drift + gentle mouse repulsion, capped for ~60fps.
 * Uses raw canvas (no library) and listens on window so UI stays clickable.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      canvas.style.display = "none";
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let last = performance.now();
    const mouse = { x: -9999, y: -9999, active: false };

    const REPEL_RADIUS = 140;
    const REPEL_STRENGTH = 0.85;
    const SPRING = 0.035;
    const DAMPING = 0.86;
    const MAX_LINK = 110;

    function buildGrid() {
      const cols = Math.max(8, Math.floor(width / 72));
      const rows = Math.max(6, Math.floor(height / 72));
      const cellW = width / cols;
      const cellH = height / rows;
      const next: Particle[] = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ox = col * cellW + cellW * 0.5 + (Math.random() - 0.5) * cellW * 0.35;
          const oy = row * cellH + cellH * 0.5 + (Math.random() - 0.5) * cellH * 0.35;
          next.push({
            ox,
            oy,
            x: ox,
            y: oy,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            r: 1.2 + Math.random() * 1.8,
            phase: Math.random() * Math.PI * 2,
            tint: (Math.random() < 0.12 ? 2 : Math.random() < 0.35 ? 1 : 0) as 0 | 1 | 2,
          });
        }
      }
      particles = next;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    function onMouseMove(event: MouseEvent) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    }

    function onMouseLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onVisibility() {
      running = document.visibilityState === "visible";
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    function frame(now: number) {
      if (!running) return;

      // Cap delta so tab-switches don't explode the simulation.
      const dt = Math.min(32, now - last) / 16.6667;
      last = now;

      ctx!.clearRect(0, 0, width, height);

      const t = now * 0.001;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Soft ambient drift around the grid rest point.
        const driftX = Math.sin(t * 0.45 + p.phase) * 0.35;
        const driftY = Math.cos(t * 0.38 + p.phase * 1.3) * 0.35;

        // Spring back toward rest so the grid always reforms.
        p.vx += (p.ox + driftX * 8 - p.x) * SPRING * dt;
        p.vy += (p.oy + driftY * 8 - p.y) * SPRING * dt;

        // Gentle mouse repulsion of nearby particles.
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const radiusSq = REPEL_RADIUS * REPEL_RADIUS;
          if (distSq < radiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH;
            p.vx += (dx / dist) * force * dt;
            p.vy += (dy / dist) * force * dt;
          }
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      // Soft links between neighbors — keep sparse for performance.
      ctx!.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        // Only check a short window ahead in the flat grid array.
        const limit = Math.min(particles.length, i + 14);
        for (let j = i + 1; j < limit; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > MAX_LINK * MAX_LINK) continue;
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / MAX_LINK) * 0.18;
          ctx!.strokeStyle = `rgba(30, 58, 95, ${alpha})`;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const rgb = COLORS[p.tint];
        const alpha = p.tint === 2 ? 0.55 : 0.42;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
