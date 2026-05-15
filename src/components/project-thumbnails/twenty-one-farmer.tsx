import { DotGrid } from './dot-grid';

export function TwentyOneFarmerThumbnail() {
  return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="rev-f-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
        <filter id="rev-f-sh">
          <feDropShadow dx="2" dy="4" stdDeviation="5" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <rect width="400" height="200" fill="#040e04" />
      <rect width="400" height="200" fill="url(#rev-f-glow)" />
      <DotGrid />
      <g filter="url(#rev-f-sh)">
        <rect x="20" y="22" width="172" height="156" fill="none" stroke="rgba(248,248,248,0.18)" strokeWidth="1.2" />
        <rect x="20" y="22" width="172" height="48" fill="rgba(77,208,225,0.08)" />
        <rect x="20" y="70" width="172" height="56" fill="rgba(34,197,94,0.14)" />
        <rect x="20" y="126" width="172" height="52" fill="rgba(34,197,94,0.07)" />
      </g>
      <line x1="20" y1="70" x2="192" y2="70" stroke="rgba(34,197,94,0.35)" strokeWidth="1.2" />
      <line x1="20" y1="126" x2="192" y2="126" stroke="rgba(34,197,94,0.22)" strokeWidth="1" />
      <g transform="translate(36, 42)">
        <circle r="5" fill="rgba(77,208,225,0.6)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const rad = (a * Math.PI) / 180;
          return (
            <line key={a}
              x1={7 * Math.cos(rad)} y1={7 * Math.sin(rad)}
              x2={10 * Math.cos(rad)} y2={10 * Math.sin(rad)}
              stroke="rgba(77,208,225,0.55)" strokeWidth="1.1" />
          );
        })}
      </g>
      <g transform="translate(74, 46)" fill="rgba(77,208,225,0.45)">
        <ellipse cx="0" cy="0" rx="10" ry="4" />
        <ellipse cx="-5" cy="-2" rx="5" ry="3" />
        <ellipse cx="5" cy="-1" rx="6" ry="3" />
      </g>
      <g transform="translate(140, 50)" fill="rgba(77,208,225,0.35)">
        <ellipse cx="0" cy="0" rx="9" ry="3.5" />
        <ellipse cx="-4" cy="-2" rx="5" ry="3" />
      </g>
      <g transform="translate(40, 110)" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M0 0 Q-2 -5 -4 -10" />
        <path d="M0 0 Q0 -7 -1 -12" />
        <path d="M0 0 Q3 -5 4 -10" />
      </g>
      <g transform="translate(140, 110)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M0 0 Q-2 -5 -3 -9" />
        <path d="M0 0 Q0 -6 -1 -11" />
        <path d="M0 0 Q3 -4 4 -8" />
      </g>
      <g transform="translate(50, 152)">
        <ellipse cx="0" cy="0" rx="5" ry="3" fill="rgba(34,197,94,0.4)" />
        <ellipse cx="11" cy="-2" rx="4" ry="2.5" fill="rgba(34,197,94,0.32)" />
        <ellipse cx="-7" cy="3" rx="3.5" ry="2.2" fill="rgba(34,197,94,0.35)" />
      </g>
      <g transform="translate(140, 154)">
        <ellipse cx="0" cy="0" rx="4" ry="2.5" fill="rgba(34,197,94,0.36)" />
        <ellipse cx="9" cy="-2" rx="3.5" ry="2" fill="rgba(34,197,94,0.3)" />
        <ellipse cx="-6" cy="2" rx="3" ry="2" fill="rgba(34,197,94,0.32)" />
      </g>
      {[80, 124, 168].map((cx, i) => (
        <g key={i} filter="url(#rev-f-sh)">
          <line x1={cx} y1="22" x2={cx} y2="70" stroke="rgba(240,197,66,0.4)" strokeWidth="1" strokeDasharray="2,2" />
          <path d={`M${cx - 8} 64 Q${cx} 56 ${cx + 8} 64`} fill="none" stroke="rgba(240,197,66,0.55)" strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M${cx - 12} 58 Q${cx} 44 ${cx + 12} 58`} fill="none" stroke="rgba(240,197,66,0.35)" strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M${cx - 15} 52 Q${cx} 32 ${cx + 15} 52`} fill="none" stroke="rgba(240,197,66,0.2)" strokeWidth="1" strokeLinecap="round" />
          <circle cx={cx} cy="70" r="6.5" fill="rgba(240,197,66,0.14)" stroke="#F0C542" strokeWidth="1.3" />
          <circle cx={cx} cy="70" r="3" fill="#F0C542" />
        </g>
      ))}
      <rect x="208" y="22" width="172" height="156" rx="4"
        fill="rgba(248,248,248,0.03)" stroke="rgba(248,248,248,0.12)" strokeWidth="1" filter="url(#rev-f-sh)" />
      <text x="216" y="36" fill="rgba(34,197,94,0.6)" fontSize="8" fontFamily="monospace">LIVE · SENSOR DATA</text>
      <circle cx="370" cy="33" r="2.8" fill="#22c55e" />
      <line x1="208" y1="42" x2="380" y2="42" stroke="rgba(248,248,248,0.08)" />
      {[
        { l: 'Soil', v: 0.75, y: 52 },
        { l: 'Water', v: 0.55, y: 72 },
        { l: 'Temp', v: 0.88, y: 92 },
        { l: 'Yield', v: 0.65, y: 112 },
        { l: 'pH', v: 0.72, y: 132 },
        { l: 'Humid', v: 0.80, y: 152 },
      ].map(({ l, v, y }) => (
        <g key={l}>
          <text x="216" y={y + 9} fill="rgba(248,248,248,0.35)" fontSize="7.5" fontFamily="monospace">{l}</text>
          <rect x="248" y={y} width="100" height="11" rx="2" fill="rgba(34,197,94,0.1)" />
          <rect x="248" y={y} width={100 * v} height="11" rx="2" fill="rgba(34,197,94,0.5)" />
          <text x="372" y={y + 9} textAnchor="end" fill="rgba(34,197,94,0.7)" fontSize="8" fontFamily="monospace">{Math.round(v * 100)}%</text>
        </g>
      ))}
    </svg>
  );
}
