import { DotGrid } from './dot-grid';

export function DinneyThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <rect width="400" height="200" fill="#0A0A0F" />
      <DotGrid />
      <rect x="20" y="22" width="190" height="156" fill="none" stroke="rgba(248,248,248,0.2)" strokeWidth="1.2" />
      {[
        { cx: 80, cy: 60, res: false },
        { cx: 160, cy: 60, res: true },
        { cx: 80, cy: 110, res: true },
        { cx: 160, cy: 110, res: false },
        { cx: 120, cy: 160, res: false },
      ].map(({ cx, cy, res }, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="22" fill="none"
            stroke={res ? 'rgba(240,197,66,0.55)' : 'rgba(248,248,248,0.16)'} strokeWidth="1.2" />
          <circle cx={cx} cy={cy} r="13"
            fill={res ? 'rgba(240,197,66,0.1)' : 'rgba(248,248,248,0.04)'}
            stroke={res ? 'rgba(240,197,66,0.4)' : 'rgba(248,248,248,0.1)'} strokeWidth="1" />
          {res && (
            <g>
              <line x1={cx - 4.5} y1={cy - 2} x2={cx - 4.5} y2={cy + 6} stroke="#F0C542" strokeWidth="1.4" strokeLinecap="round" />
              <line x1={cx - 6.5} y1={cy - 6} x2={cx - 6.5} y2={cy - 2} stroke="#F0C542" strokeWidth="1" strokeLinecap="round" />
              <line x1={cx - 4.5} y1={cy - 7} x2={cx - 4.5} y2={cy - 2} stroke="#F0C542" strokeWidth="1" strokeLinecap="round" />
              <line x1={cx - 2.5} y1={cy - 6} x2={cx - 2.5} y2={cy - 2} stroke="#F0C542" strokeWidth="1" strokeLinecap="round" />
              <line x1={cx + 4.5} y1={cy + 1} x2={cx + 4.5} y2={cy + 6} stroke="#F0C542" strokeWidth="1.4" strokeLinecap="round" />
              <path d={`M${cx + 3} ${cy - 7} L${cx + 3} ${cy} L${cx + 6} ${cy} Z`} fill="#F0C542" />
            </g>
          )}
        </g>
      ))}
      <rect x="224" y="22" width="156" height="120" rx="4" fill="rgba(248,248,248,0.02)" stroke="rgba(248,248,248,0.1)" strokeWidth="1" />
      <text x="232" y="36" fill="rgba(248,248,248,0.4)" fontSize="8" fontFamily="monospace">RESERVATIONS</text>
      <line x1="224" y1="42" x2="380" y2="42" stroke="rgba(248,248,248,0.08)" />
      {Array.from({ length: 7 }).map((_, d) =>
        Array.from({ length: 5 }).map((_, t) => {
          const filled = [[0, 2], [1, 1], [2, 3], [3, 0], [4, 2], [5, 4], [6, 1], [2, 0]].some(([dd, tt]) => dd === d && tt === t);
          return (
            <rect key={`${d}-${t}`} x={232 + d * 20} y={50 + t * 16} width="16" height="12" rx="2"
              fill={filled ? 'rgba(240,197,66,0.5)' : 'rgba(248,248,248,0.05)'}
              stroke={filled ? '#F0C542' : 'rgba(248,248,248,0.1)'} strokeWidth="0.7" />
          );
        })
      )}
      <rect x="224" y="152" width="156" height="26" rx="4" fill="rgba(248,248,248,0.02)" stroke="rgba(248,248,248,0.1)" strokeWidth="1" />
      <text x="232" y="170" fill="rgba(248,248,248,0.4)" fontSize="9" fontFamily="monospace">PARTY</text>
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(${288 + i * 22}, 165)`}>
          <circle cx="0" cy="-2" r="3" fill="#F0C542" />
          <path d="M-4.5 5 Q0 0 4.5 5 L4.5 7 L-4.5 7 Z" fill="#F0C542" />
        </g>
      ))}
      <text x="372" y="170" textAnchor="end" fill="#F0C542" fontSize="14" fontFamily="monospace" fontWeight="bold">× 3</text>
    </svg>
  );
}
