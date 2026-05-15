export function ElmawkaaThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <defs>
        <clipPath id="rev-em-glass"><rect width="68" height="54" rx="6" /></clipPath>
        <clipPath id="rev-em-brick"><rect width="68" height="54" rx="6" /></clipPath>
      </defs>
      <rect width="400" height="200" fill="#0c0d14" />
      <g transform="translate(135, 38)">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <polygon key={i} points={`${10 + i * 17},0 ${4 + i * 17},14 ${16 + i * 17},14`}
            fill="rgba(240,197,66,0.18)" stroke="#F0C542" strokeWidth="1" />
        ))}
        <rect y="14" width="130" height="110" fill="rgba(240,197,66,0.04)" stroke="#F0C542" strokeWidth="1.8" />
        <text x="65" y="56" textAnchor="middle" fill="#F0C542" fontSize="13"
          fontFamily="monospace" fontWeight="bold" letterSpacing="3">MARKETPLACE</text>
        <line x1="20" y1="64" x2="110" y2="64" stroke="rgba(240,197,66,0.35)" strokeWidth="1" />
        <text x="65" y="76" textAnchor="middle" fill="rgba(248,248,248,0.4)" fontSize="8"
          fontFamily="monospace" letterSpacing="2">MENA · CONSTRUCTION</text>
        {[10, 49, 88].map((x, i) => (
          <g key={i}>
            <rect x={x} y="88" width="32" height="28" fill="rgba(248,248,248,0.05)" stroke="rgba(248,248,248,0.22)" strokeWidth="1" />
            <rect x={x + 11} y="98" width="10" height="18" fill="rgba(248,248,248,0.1)" stroke="rgba(248,248,248,0.15)" strokeWidth="0.6" />
            <rect x={x + 4} y="92" width="6" height="4" fill="rgba(240,197,66,0.18)" />
            <rect x={x + 22} y="92" width="6" height="4" fill="rgba(240,197,66,0.18)" />
          </g>
        ))}
      </g>
      <g transform="translate(14, 38)">
        <rect width="68" height="54" rx="6" fill="rgba(248,248,248,0.06)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.4" />
        {[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4, 5].map(c => (
          <circle key={`${r}-${c}`} cx={9 + c * 10} cy={9 + r * 9} r="1.6" fill="rgba(248,248,248,0.48)" />
        )))}
        <rect x="8" y="46" width="52" height="3.5" rx="1.5" fill="#F0C542" />
      </g>
      <g transform="translate(318, 38)">
        <rect width="68" height="54" rx="6" fill="rgba(248,248,248,0.06)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.4" />
        {[14, 22, 30, 38].map(y => <line key={y} x1="10" y1={y} x2="58" y2={y} stroke="rgba(248,248,248,0.5)" strokeWidth="2.2" />)}
        <rect x="8" y="46" width="52" height="3.5" rx="1.5" fill="#F0C542" fillOpacity="0.85" />
      </g>
      <g transform="translate(14, 108)">
        <rect width="68" height="54" rx="6" fill="rgba(248,248,248,0.06)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.4" />
        <g clipPath="url(#rev-em-glass)">
          {[-30, -15, 0, 15, 30, 45, 60, 75].map(x => (
            <line key={x} x1={x} y1="0" x2={x + 44} y2="54" stroke="rgba(77,208,225,0.55)" strokeWidth="1.5" />
          ))}
        </g>
        <rect x="8" y="46" width="52" height="3.5" rx="1.5" fill="#F0C542" fillOpacity="0.55" />
      </g>
      <g transform="translate(318, 108)">
        <rect width="68" height="54" rx="6" fill="rgba(248,248,248,0.06)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.4" />
        <g clipPath="url(#rev-em-brick)">
          {[10, 24, 38].map((y, r) => [0, 1, 2, 3].map(c => {
            const off = r % 2 === 0 ? 0 : 8;
            return <rect key={`${r}-${c}`} x={4 + c * 16 + off} y={y} width="14" height="10" rx="1.5"
              fill="rgba(217,119,6,0.42)" stroke="rgba(217,119,6,0.6)" strokeWidth="0.6" />;
          }))}
        </g>
        <rect x="8" y="46" width="52" height="3.5" rx="1.5" fill="#F0C542" fillOpacity="0.7" />
      </g>
      <g stroke="rgba(240,197,66,0.4)" strokeWidth="1.2" strokeDasharray="4,3" fill="none">
        <line x1="82" y1="64" x2="138" y2="76" />
        <line x1="318" y1="64" x2="262" y2="76" />
        <line x1="82" y1="134" x2="138" y2="120" />
        <line x1="318" y1="134" x2="262" y2="120" />
      </g>
    </svg>
  );
}
