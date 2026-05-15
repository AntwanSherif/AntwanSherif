import { DotGrid } from './dot-grid';

function IGPost({ x, y }: { x: number; y: number }) {
  const W = 96;
  const PH = W;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={W} height={W + 60} rx="6" fill="#0a0a0f" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
      <circle cx="14" cy="14" r="6" fill="rgba(168,85,247,0.55)" stroke="rgba(168,85,247,0.7)" strokeWidth="0.8" />
      <rect x="24" y="10" width="28" height="3.5" rx="1.5" fill="rgba(255,255,255,0.35)" />
      <rect x="24" y="16" width="18" height="2.5" rx="1" fill="rgba(255,255,255,0.18)" />
      <rect x={W - 18} y="7" width="13" height="13" rx="3.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
      <circle cx={W - 11.5} cy="13.5" r="3.8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
      <circle cx={W - 7.5} cy="9.5" r="1" fill="rgba(255,255,255,0.8)" />
      <line x1="0" y1="28" x2={W} y2="28" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <rect x="0" y="28" width={W} height={PH} fill="rgba(168,85,247,0.28)" />
      <polygon points={`${W * 0.4},28 ${W * 0.6},28 ${W * 0.75},${28 + PH} ${W * 0.25},${28 + PH}`} fill="rgba(236,72,153,0.18)" />
      <line x1="0" y1={28 + PH} x2={W} y2={28 + PH} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <path d={`M10 ${28 + PH + 9} Q8 ${28 + PH + 6} 10 ${28 + PH + 3} Q12 ${28 + PH + 6} 10 ${28 + PH + 9} Z`} fill="rgba(255,255,255,0.6)" />
      <circle cx="22" cy={28 + PH + 6} r="3.5" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
      <path
        d={`M32 ${28 + PH + 3} L42 ${28 + PH + 6} L32 ${28 + PH + 9}`}
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <rect x="6" y={28 + PH + 16} width="50" height="2.5" rx="1" fill="rgba(255,255,255,0.22)" />
      <rect x="6" y={28 + PH + 22} width="35" height="2.5" rx="1" fill="rgba(255,255,255,0.14)" />
    </g>
  );
}

export function InstaSuperEditThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <defs>
        <radialGradient id="ise-glow" cx="28%" cy="40%" r="45%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        <filter id="ise-shadow">
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.6)" />
        </filter>
      </defs>
      <rect width="400" height="200" fill="#08000e" />
      <rect width="400" height="200" fill="url(#ise-glow)" />
      <DotGrid />
      <g transform="translate(8,0)">
        <polygon points="12,142 102,142 92,160 22,160" fill="rgba(248,248,248,0.08)" stroke="rgba(248,248,248,0.22)" strokeWidth="1" />
        <g className="thumb-freddie"><image href="/thumbnails/freddie-nobg.png" x="8" y="37" width="98" height="112" preserveAspectRatio="xMidYMax meet" /></g>
        <g filter="url(#ise-shadow)" transform="rotate(-10 95 50)">
          <rect x="80" y="40" width="28" height="20" rx="2.5" fill="rgba(248,248,248,0.1)" stroke="rgba(236,72,153,0.6)" strokeWidth="1.2" />
          <rect x="86" y="44" width="16" height="12" rx="1" fill="none" stroke="rgba(236,72,153,0.85)" strokeWidth="0.9" />
          <circle cx="94" cy="50" r="2.8" fill="none" stroke="rgba(236,72,153,0.85)" strokeWidth="0.9" />
          <circle cx="89" cy="46.5" r="0.7" fill="rgba(236,72,153,0.85)" />
        </g>
        <g filter="url(#ise-shadow)" transform="rotate(8 100 78)">
          <rect x="86" y="68" width="26" height="20" rx="2.5" fill="rgba(248,248,248,0.1)" stroke="rgba(168,85,247,0.6)" strokeWidth="1.2" />
          <polygon points="94.8,73.8 94.8,83.8 104.8,78.8" fill="rgba(168,85,247,0.9)" />
        </g>
        <polygon className="thumb-beam b1" points="28,26 36,26 58,142 48,142" fill="rgba(236,72,153,0.24)" />
        <polygon className="thumb-beam b2" points="46,26 54,26 78,142 64,142" fill="rgba(168,85,247,0.22)" />
        <polygon className="thumb-beam b3" points="64,26 72,26 92,142 78,142" fill="rgba(77,208,225,0.2)" />
      </g>
      <g stroke="rgba(248,248,248,0.32)" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <line x1="132" y1="100" x2="162" y2="100" />
        <path d="M157 94 L164 100 L157 106" />
      </g>
      <rect x="170" y="44" width="76" height="112" rx="8" fill="rgba(240,197,66,0.1)" stroke="#F0C542" strokeWidth="1.6" filter="url(#ise-shadow)" />
      <text x="208" y="75" textAnchor="middle" fill="#F0C542" fontSize="16" fontFamily="monospace" fontWeight="bold">AI</text>
      <line x1="180" y1="87" x2="236" y2="87" stroke="rgba(240,197,66,0.18)" strokeWidth="0.8" />
      {[
        { l: 'Quality', v: 0.88, y: 98 },
        { l: 'Rank', v: 0.72, y: 116 },
        { l: 'Curate', v: 0.95, y: 134 },
      ].map(({ l, v, y }) => (
        <g key={l}>
          <text x="178" y={y + 7} fill="rgba(240,197,66,0.55)" fontSize="7" fontFamily="monospace">{l}</text>
          <rect x="210" y={y} width="28" height="8" rx="2" fill="rgba(240,197,66,0.1)" />
          <rect x="210" y={y} width={28 * v} height="8" rx="2" fill="rgba(240,197,66,0.6)" />
        </g>
      ))}
      <g stroke="rgba(248,248,248,0.32)" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <line x1="252" y1="100" x2="282" y2="100" />
        <path d="M277 94 L284 100 L277 106" />
      </g>
      <IGPost x={290} y={24} />
    </svg>
  );
}
