"use client";

// Animated plasma background for the hero / full page. A single full-screen fragment
// shader: interfering sine waves constrained to the brand palette (colors read from
// --accent-1 / --accent-2, so it's gold/cyan in dark, deep gold/teal in light, and
// re-reads on theme toggle). A soft center vignette keeps the copy area calm.
//
// Perf + a11y: DPR capped at 1.5, the loop pauses when the tab is hidden, and
// prefers-reduced-motion renders a single static frame (no animation loop).

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const FRAG = `
  precision highp float;
  uniform vec2 u_res;
  uniform float u_time;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform float u_alpha;

  void main(){
    vec2 uv = gl_FragCoord.xy / u_res;
    vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

    float t = u_time * 0.4;
    float v = sin(p.x * 3.0 + t)
            + sin(p.y * 3.5 - t)
            + sin((p.x + p.y) * 2.5 + t * 1.3)
            + sin(length(p) * 4.0 - t);
    v *= 0.25;

    float m = smoothstep(-0.2, 0.85, v);
    vec3 col = mix(u_c1, u_c2, 0.5 + 0.5 * sin(v * 3.0));

    // soft vignette: calmer through the centre, fuller toward the edges
    float vig = smoothstep(0.15, 1.1, length(p * vec2(0.85, 1.15)));
    float a = m * 0.6 * mix(0.35, 1.0, vig) * u_alpha;
    gl_FragColor = vec4(col, a);
  }
`;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

function hex01(hex: string): [number, number, number] {
  const h = hex.trim().replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255) as [number, number, number];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function PlasmaField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true, antialias: true });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uC1 = gl.getUniformLocation(prog, "u_c1");
    const uC2 = gl.getUniformLocation(prog, "u_c2");
    const uAlpha = gl.getUniformLocation(prog, "u_alpha");

    const applyTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      gl.uniform3fv(uC1, hex01(cs.getPropertyValue("--accent-1") || "#f0c542"));
      gl.uniform3fv(uC2, hex01(cs.getPropertyValue("--accent-2") || "#4dd0e1"));
      const isDark = document.documentElement.classList.contains("dark");
      // light needs much more presence — deep ink at low alpha on near-white washes out
      gl.uniform1f(uAlpha, isDark ? 0.6 : 0.9);
    };
    applyTheme();
    const themeObs = new MutationObserver(applyTheme);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(canvas.offsetWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.offsetHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let hidden = false;
    const start = performance.now();

    const loop = (now: number) => {
      if (hidden) return;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      gl.uniform1f(uTime, 8.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onVis = () => {
      hidden = document.hidden;
      if (!hidden && !reduce) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      themeObs.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("block", className)} />;
}
