import { DotGrid } from './dot-grid';

export function HaktivThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <defs>
        <radialGradient id="rev-h-glow" cx="22%" cy="50%" r="38%">
          <stop offset="0%" stopColor="#F0C542" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F0C542" stopOpacity="0" />
        </radialGradient>
        <filter id="rev-h-sh">
          <feDropShadow dx="2" dy="4" stdDeviation="5" floodColor="rgba(0,0,0,0.6)" />
        </filter>
      </defs>
      <rect width="400" height="200" fill="#0c0d14" />
      <rect width="400" height="200" fill="url(#rev-h-glow)" />
      <DotGrid />
      <g transform="translate(86, 100)" filter="url(#rev-h-sh)">
        <ellipse cx="0" cy="-44" rx="22" ry="5" fill="#F0C542" />
        <path
          d="M-22 -44 Q-20 -30 -18 -12 Q-15 4 0 8 Q15 4 18 -12 Q20 -30 22 -44 Z"
          fill="rgba(240,197,66,0.92)"
          stroke="#F0C542"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <ellipse cx="0" cy="-44" rx="18" ry="3" fill="rgba(140,100,20,0.65)" />
        <path d="M-22 -34 Q-38 -30 -38 -18 Q-38 -6 -24 -6" fill="none" stroke="#F0C542" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 -34 Q38 -30 38 -18 Q38 -6 24 -6" fill="none" stroke="#F0C542" strokeWidth="3" strokeLinecap="round" />
        <path d="M-5 8 Q-7 14 -6 20 L6 20 Q7 14 5 8 Z" fill="#F0C542" />
        <rect x="-18" y="20" width="36" height="6" fill="#F0C542" />
        <rect x="-22" y="26" width="44" height="6" rx="1" fill="#F0C542" />
        <ellipse cx="0" cy="32" rx="22" ry="2.5" fill="rgba(140,100,20,0.7)" />
        <text x="0" y="-16" textAnchor="middle" fill="#1a0a04" fontSize="14" fontFamily="monospace" fontWeight="bold">$</text>
      </g>
      <rect x="172" y="38" width="212" height="126" rx="6"
        fill="rgba(248,248,248,0.03)" stroke="rgba(248,248,248,0.12)" strokeWidth="1" filter="url(#rev-h-sh)" />
      <line x1="172" y1="54" x2="384" y2="54" stroke="rgba(248,248,248,0.08)" />
      <text x="180" y="50" fill="rgba(248,248,248,0.4)" fontSize="8" fontFamily="monospace">TOP RESEARCHERS</text>
      {[
        { y: 62, amt: '$2,400', bar: 1 },
        { y: 86, amt: '$1,800', bar: 0.75 },
        { y: 110, amt: '$950', bar: 0.4 },
        { y: 134, amt: '$650', bar: 0.27 },
      ].map(({ y, amt, bar }, i) => (
        <g key={i}>
          <circle cx="188" cy={y + 10} r="6" fill="rgba(248,248,248,0.06)" stroke="rgba(248,248,248,0.22)" strokeWidth="1" />
          <rect x="202" y={y + 6} width={60 * bar + 20} height="3.5" rx="2" fill="rgba(248,248,248,0.2)" />
          <rect x="202" y={y + 13} width={40 * bar + 10} height="2.5" rx="1" fill="rgba(248,248,248,0.09)" />
          <text x="372" y={y + 14} textAnchor="end" fill="#F0C542" fontSize="11" fontFamily="monospace" fontWeight="bold">{amt}</text>
        </g>
      ))}
      <text x="372" y="180" textAnchor="end" fill="rgba(240,197,66,0.65)" fontSize="9" fontFamily="monospace" fontWeight="bold">TOTAL · $24,200</text>
    </svg>
  );
}
