import { DotGrid } from './dot-grid';

export function TwentyOneFarmerThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <defs>
        <radialGradient id="farmer-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
        <filter id="farmer-shadow">
          <feDropShadow dx="2" dy="4" stdDeviation="5" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <rect width="400" height="200" fill="#040e04" />
      <rect width="400" height="200" fill="url(#farmer-glow)" />
      <DotGrid />
      <g filter="url(#farmer-shadow)">
        <rect x="20" y="22" width="172" height="156" fill="none" stroke="rgba(248,248,248,0.18)" strokeWidth="1.2" />
        <rect x="20" y="22" width="172" height="48" fill="rgba(77,208,225,0.08)" />
        <rect x="20" y="70" width="172" height="56" fill="rgba(34,197,94,0.14)" />
        <rect x="20" y="126" width="172" height="52" fill="rgba(34,197,94,0.07)" />
      </g>
      <line x1="20" y1="70" x2="192" y2="70" stroke="rgba(34,197,94,0.35)" strokeWidth="1.2" />
      <line x1="20" y1="126" x2="192" y2="126" stroke="rgba(34,197,94,0.22)" strokeWidth="1" />
      <text x="106" y="50" textAnchor="middle" fill="rgba(77,208,225,0.5)" fontSize="8" fontFamily="monospace">ATMOSPHERE</text>
      <text x="106" y="100" textAnchor="middle" fill="rgba(34,197,94,0.6)" fontSize="8" fontFamily="monospace">TOPSOIL</text>
      <text x="106" y="156" textAnchor="middle" fill="rgba(34,197,94,0.36)" fontSize="8" fontFamily="monospace">SUBSOIL</text>
      {[60, 106, 152].map((cx, i) => (
        <g key={i} filter="url(#farmer-shadow)">
          <line className="thumb-signal" x1={cx} y1="22" x2={cx} y2="70" stroke="rgba(240,197,66,0.4)" strokeWidth="1" strokeDasharray="2,2" />
          <path className="thumb-wave w1" d={`M${cx - 8} 64 Q${cx} 56 ${cx + 8} 64`} fill="none" stroke="rgba(240,197,66,0.55)" strokeWidth="1.1" strokeLinecap="round" />
          <path className="thumb-wave w2" d={`M${cx - 12} 58 Q${cx} 44 ${cx + 12} 58`} fill="none" stroke="rgba(240,197,66,0.35)" strokeWidth="1.1" strokeLinecap="round" />
          <path className="thumb-wave w3" d={`M${cx - 15} 52 Q${cx} 34 ${cx + 15} 52`} fill="none" stroke="rgba(240,197,66,0.2)" strokeWidth="1" strokeLinecap="round" />
          <circle cx={cx} cy="70" r="6.5" fill="rgba(240,197,66,0.14)" stroke="#F0C542" strokeWidth="1.3" />
          <circle cx={cx} cy="70" r="3" fill="#F0C542" />
        </g>
      ))}
      <rect x="208" y="22" width="172" height="156" rx="4" fill="rgba(248,248,248,0.03)" stroke="rgba(248,248,248,0.12)" strokeWidth="1" filter="url(#farmer-shadow)" />
      <text x="216" y="36" fill="rgba(34,197,94,0.6)" fontSize="8" fontFamily="monospace">LIVE · SENSOR DATA</text>
      <circle className="thumb-live" cx="370" cy="33" r="2.8" fill="#22c55e" />
      <line x1="208" y1="42" x2="380" y2="42" stroke="rgba(248,248,248,0.08)" />
      {(() => {
        const barClass: Record<string, string> = { Soil: 'thumb-bar bSoil', Temp: 'thumb-bar bTemp', Yield: 'thumb-bar bYield', Humid: 'thumb-bar bHumid' };
        return [
          { l: 'Soil', v: 0.75, y: 52 },
          { l: 'Water', v: 0.55, y: 72 },
          { l: 'Temp', v: 0.88, y: 92 },
          { l: 'Yield', v: 0.65, y: 112 },
          { l: 'pH', v: 0.72, y: 132 },
          { l: 'Humid', v: 0.8, y: 152 },
        ].map(({ l, v, y }) => (
          <g key={l}>
            <text x="216" y={y + 9} fill="rgba(248,248,248,0.35)" fontSize="7.5" fontFamily="monospace">{l}</text>
            <rect x="248" y={y} width="100" height="11" rx="2" fill="rgba(34,197,94,0.1)" />
            <rect x="248" y={y} width={100 * v} height="11" rx="2" fill="rgba(34,197,94,0.5)" className={barClass[l]} />
            <text x="372" y={y + 9} textAnchor="end" fill="rgba(34,197,94,0.7)" fontSize="8" fontFamily="monospace">{Math.round(v * 100)}%</text>
          </g>
        ));
      })()}
    </svg>
  );
}
