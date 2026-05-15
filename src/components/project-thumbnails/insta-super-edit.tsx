import { DotGrid } from './dot-grid';

export function InstaSuperEditThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <defs>
        <radialGradient id="rev-ise-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        <filter id="rev-ise-sh">
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.6)" />
        </filter>
      </defs>
      <rect width="400" height="200" fill="#08000e" />
      <rect width="400" height="200" fill="url(#rev-ise-glow)" />
      <DotGrid />
      <g transform="translate(10, 0)">
        <polygon points="30,28 38,28 60,142 50,142" fill="rgba(236,72,153,0.24)" />
        <polygon points="48,28 56,28 80,142 66,142" fill="rgba(168,85,247,0.22)" />
        <polygon points="66,28 74,28 96,142 82,142" fill="rgba(77,208,225,0.2)" />
        <polygon points="14,142 102,142 92,160 24,160" fill="rgba(248,248,248,0.07)" stroke="rgba(248,248,248,0.2)" strokeWidth="1" />
        <g transform="translate(58, 104)">
          <circle cx="0" cy="-22" r="7" fill="rgba(248,248,248,0.85)" />
          <path d="M-9 -12 L-11 18 L-7 38 L7 38 L11 18 L9 -12 Z" fill="rgba(248,248,248,0.85)" />
          <path d="M-9 -10 L-22 -14 L-22 -10 L-7 -6 Z" fill="rgba(248,248,248,0.85)" />
        </g>
        <line x1="36" y1="80" x2="36" y2="142" stroke="rgba(248,248,248,0.4)" strokeWidth="1.1" />
        <ellipse cx="36" cy="80" rx="3" ry="4" fill="#F0C542" />
        <ellipse cx="36" cy="80" rx="1.5" ry="2.5" fill="rgba(240,197,66,0.65)" />
        {[18, 30, 42, 54, 66, 78, 90, 102].map((x, i) => (
          <ellipse key={i} cx={x} cy={176} rx={i % 2 === 0 ? 5.5 : 4.5} ry={i % 2 === 0 ? 10 : 8}
            fill="rgba(0,0,0,0.65)" stroke="rgba(248,248,248,0.22)" strokeWidth="0.7" />
        ))}
        <g filter="url(#rev-ise-sh)" transform="rotate(-10 90 50)">
          <rect x="78" y="42" width="26" height="18" rx="2" fill="rgba(248,248,248,0.12)" stroke="rgba(236,72,153,0.55)" strokeWidth="1.2" />
          <rect x="84" y="48" width="14" height="8" rx="1" fill="none" stroke="rgba(236,72,153,0.85)" strokeWidth="0.9" />
          <circle cx="91" cy="52" r="2.2" fill="none" stroke="rgba(236,72,153,0.85)" strokeWidth="0.9" />
          <circle cx="86.5" cy="49.5" r="0.6" fill="rgba(236,72,153,0.85)" />
        </g>
        <g filter="url(#rev-ise-sh)" transform="rotate(8 100 78)">
          <rect x="86" y="68" width="26" height="18" rx="2" fill="rgba(248,248,248,0.12)" stroke="rgba(168,85,247,0.55)" strokeWidth="1.2" />
          <polygon points="94,73 94,82 102,77.5" fill="rgba(168,85,247,0.85)" />
        </g>
      </g>
      <g stroke="rgba(248,248,248,0.3)" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <line x1="122" y1="100" x2="150" y2="100" />
        <path d="M145 94 L152 100 L145 106" />
      </g>
      <rect x="158" y="38" width="84" height="124" rx="8"
        fill="rgba(240,197,66,0.1)" stroke="#F0C542" strokeWidth="1.6" filter="url(#rev-ise-sh)" />
      <text x="200" y="76" textAnchor="middle" fill="#F0C542" fontSize="16" fontFamily="monospace" fontWeight="bold">AI</text>
      <line x1="172" y1="84" x2="228" y2="84" stroke="rgba(240,197,66,0.18)" strokeWidth="0.8" />
      {[
        { l: 'Quality', v: 0.88, y: 100 },
        { l: 'Rank', v: 0.72, y: 120 },
        { l: 'Curate', v: 0.95, y: 140 },
      ].map(({ l, v, y }) => (
        <g key={l}>
          <text x="170" y={y + 6} fill="rgba(240,197,66,0.55)" fontSize="7" fontFamily="monospace">{l}</text>
          <rect x="200" y={y} width="32" height="8" rx="2" fill="rgba(240,197,66,0.1)" />
          <rect x="200" y={y} width={32 * v} height="8" rx="2" fill="rgba(240,197,66,0.6)" />
        </g>
      ))}
      <g stroke="rgba(248,248,248,0.3)" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <line x1="248" y1="100" x2="276" y2="100" />
        <path d="M271 94 L278 100 L271 106" />
      </g>
      <g filter="url(#rev-ise-sh)">
        <rect x="284" y="30" width="44" height="110" rx="6" fill="#0a0a0f" stroke="rgba(236,72,153,0.6)" strokeWidth="1.4" />
        <rect x="296" y="34" width="20" height="3" rx="1.5" fill="rgba(248,248,248,0.15)" />
        <rect x="288" y="42" width="36" height="9" fill="rgba(0,0,0,0.5)" />
        <rect x="290" y="44" width="6" height="5" rx="1" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.7" />
        <circle cx="293" cy="46.5" r="1.4" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.6" />
        <rect x="316" y="44" width="6" height="5" rx="1.2" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.7" />
        <circle cx="319" cy="46.5" r="1.2" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.6" />
        <circle cx="320.5" cy="44.8" r="0.5" fill="rgba(248,248,248,0.8)" />
        <rect x="288" y="54" width="36" height="56" rx="2" fill="rgba(236,72,153,0.4)" />
        <path d="M293 122 Q290 119 293 116 Q296 119 293 122 Z" fill="rgba(248,248,248,0.7)" />
        <circle cx="302" cy="119" r="2" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.7" />
        <path d="M310 116 L316 119 L310 122" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.7" strokeLinejoin="round" />
      </g>
      <g filter="url(#rev-ise-sh)">
        <rect x="336" y="44" width="44" height="110" rx="6" fill="#0a0a0f" stroke="rgba(168,85,247,0.55)" strokeWidth="1.4" />
        <rect x="348" y="48" width="20" height="3" rx="1.5" fill="rgba(248,248,248,0.15)" />
        <rect x="340" y="56" width="36" height="80" rx="2" fill="rgba(168,85,247,0.4)" />
        <circle cx="358" cy="96" r="9" fill="rgba(0,0,0,0.45)" />
        <polygon points="355,91 355,101 364,96" fill="rgba(248,248,248,0.9)" />
        <rect x="342" y="58" width="9" height="9" rx="1.5" fill="none" stroke="rgba(248,248,248,0.6)" strokeWidth="0.7" />
      </g>
    </svg>
  );
}
