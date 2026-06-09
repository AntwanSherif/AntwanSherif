"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Ambient particle wash for the hero background. Particles drift continuously on a
// slowly-rotating global flow (no attractors, so it never converges/settles into a
// blob) — a living shimmer across the whole field. Color + opacity are theme-aware:
// they read --spotlight-rgb (bright gold in dark, deep gold in light) so the wash
// stays visible on the light surface instead of washing out.

const COLS = 60;
const ROWS = 34;
const NUM_PARTICLES = 48;   // sparse — a loose shimmer, not a full grid
const DECAY = 0.9;          // short trails so cells twinkle off rather than saturate
const WANDER = 0.035;       // small random jitter on top of the flow
const FLOW = 0.045;         // pull along the LOCAL flow-field angle (position-dependent)
const DAMP = 0.86;
const MAX_SPEED = 0.34;     // calmer drift — was racing before
const PARTICLE_ALPHA = 0.55; // per-particle brightness multiplier
const TIME_STEP = 0.0016;   // how fast the swirl pattern itself evolves

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Theme-aware color + element opacity, re-read whenever the theme class flips.
    const color = { r: 240, g: 180, b: 60 };
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      const rgb = cs.getPropertyValue("--spotlight-rgb").trim().split(/\s+/).map(Number);
      if (rgb.length === 3 && rgb.every((n) => !Number.isNaN(n))) {
        [color.r, color.g, color.b] = rgb;
      }
      // deep gold on a near-white surface needs more presence than bright gold on black
      const isDark = document.documentElement.classList.contains("dark");
      canvas.style.opacity = isDark ? "0.5" : "0.85";
    };
    readTheme();
    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const field = new Float32Array(COLS * ROWS);
    const particles: Particle[] = Array.from({ length: NUM_PARTICLES }, () => ({
      x: rand(0, COLS),
      y: rand(0, ROWS),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.2, 0.2),
    }));

    let flowTime = rand(0, 1000);
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

      // evolve the flow field over time so the swirl pattern keeps changing
      flowTime += TIME_STEP;

      for (const p of particles) {
        // local flow angle depends on the particle's POSITION (so neighbours head
        // different ways → organic swirls, not one global marching direction) and on
        // time (so it never repeats). Cheap summed-sine pseudo-noise — no noise lib.
        const a =
          Math.sin(p.x * 0.18 + flowTime) +
          Math.cos(p.y * 0.16 - flowTime * 0.8) +
          Math.sin((p.x + p.y) * 0.09 + flowTime * 1.3);
        const ang = a * Math.PI;
        p.vx += Math.cos(ang) * FLOW + (Math.random() * 2 - 1) * WANDER;
        p.vy += Math.sin(ang) * FLOW + (Math.random() * 2 - 1) * WANDER;
        p.vx *= DAMP;
        p.vy *= DAMP;
        // clamp so the wash drifts rather than races
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > MAX_SPEED) {
          p.vx = (p.vx / sp) * MAX_SPEED;
          p.vy = (p.vy / sp) * MAX_SPEED;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.x = ((p.x % COLS) + COLS) % COLS;
        p.y = ((p.y % ROWS) + ROWS) % ROWS;

        gaussianStamp(field, p.x, p.y);
      }

      for (let i = 0; i < field.length; i++) field[i] *= DECAY;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cellW = w / COLS;
      const cellH = h / ROWS;

      ctx.clearRect(0, 0, w, h);

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const brightness = Math.min(field[row * COLS + col], 1);
          if (brightness < 0.01) continue;
          const r = Math.round(color.r * brightness);
          const g = Math.round(color.g * brightness);
          const b = Math.round(color.b * brightness);
          ctx.fillStyle = `rgba(${r},${g},${b},${brightness * PARTICLE_ALPHA})`;
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
      themeObserver.disconnect();
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
