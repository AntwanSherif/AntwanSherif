"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const COLS = 60;
const ROWS = 34;
const NUM_PARTICLES = 120;
const DECAY = 0.97;
const ATTRACTOR_RADIUS = 8;
const ATTRACTOR_STRENGTH = 0.12;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function gaussianStamp(field: Float32Array, px: number, py: number) {
  const cx = Math.floor(px);
  const cy = Math.floor(py);
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
      const dist2 = dx * dx + dy * dy;
      field[ny * COLS + nx] += Math.exp(-dist2 / 1.5);
    }
  }
}

interface SourceFieldProps {
  className?: string;
}

export default function SourceField({ className }: SourceFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const field = new Float32Array(COLS * ROWS);

    const particles: Particle[] = Array.from({ length: NUM_PARTICLES }, () => ({
      x: rand(0, COLS),
      y: rand(0, ROWS),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
    }));

    // Two attractors that orbit the center
    let angle = 0;

    let rafId: number;
    let hidden = false;

    const onVisibility = () => {
      hidden = document.hidden;
      if (!hidden) rafId = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function tick() {
      if (hidden || !canvas || !ctx) return;

      angle += 0.008;
      const cx = COLS / 2;
      const cy = ROWS / 2;
      const attractors = [
        { x: cx + Math.cos(angle) * ATTRACTOR_RADIUS, y: cy + Math.sin(angle) * ATTRACTOR_RADIUS },
        { x: cx + Math.cos(angle + Math.PI) * ATTRACTOR_RADIUS, y: cy + Math.sin(angle + Math.PI) * ATTRACTOR_RADIUS },
      ];

      // Update particles
      for (const p of particles) {
        for (const att of attractors) {
          const dx = att.x - p.x;
          const dy = att.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.5;
          p.vx += (dx / dist) * ATTRACTOR_STRENGTH;
          p.vy += (dy / dist) * ATTRACTOR_STRENGTH;
        }
        // Dampen
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;
        // Wrap
        p.x = ((p.x % COLS) + COLS) % COLS;
        p.y = ((p.y % ROWS) + ROWS) % ROWS;

        gaussianStamp(field, p.x, p.y);
      }

      // Decay field
      for (let i = 0; i < field.length; i++) field[i] *= DECAY;

      // Render
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cellW = w / COLS;
      const cellH = h / ROWS;

      ctx.clearRect(0, 0, w, h);

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const brightness = Math.min(field[row * COLS + col], 1);
          if (brightness < 0.01) continue;
          // Gold tinted glow
          const r = Math.round(240 * brightness);
          const g = Math.round(180 * brightness);
          const b = Math.round(60 * brightness);
          ctx.fillStyle = `rgba(${r},${g},${b},${brightness * 0.8})`;
          const size = Math.max(1, cellW * 0.4 * brightness);
          ctx.fillRect(
            col * cellW + cellW / 2 - size / 2,
            row * cellH + cellH / 2 - size / 2,
            size,
            size
          );
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("w-full h-full", className)}
    />
  );
}
