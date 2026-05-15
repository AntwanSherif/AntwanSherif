export function ElmawkaaThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <defs>
        <clipPath id="elmawkaa-glass">
          <rect width="58" height="42" rx="4" />
        </clipPath>
        <clipPath id="elmawkaa-brick">
          <rect width="58" height="42" rx="4" />
        </clipPath>
      </defs>
      <rect width="400" height="200" fill="#0c0d14" />
      <g transform="translate(130, 30)">
        <path
          d="M0 20 Q9 30 18 20 Q27 30 36 20 Q45 30 54 20 Q63 30 72 20 Q81 30 90 20 Q99 30 108 20 Q117 30 126 20 Q135 30 140 20 L140 0 L0 0 Z"
          fill="rgba(240,197,66,0.22)"
          stroke="#F0C542"
          strokeWidth="1.2"
        />
        <rect y="20" width="140" height="130" rx="3" fill="rgba(240,197,66,0.04)" stroke="rgba(240,197,66,0.55)" strokeWidth="1.6" />
        <text x="70" y="64" textAnchor="middle" fill="#F0C542" fontSize="15" fontFamily="monospace" fontWeight="bold" letterSpacing="2">MARKET</text>
        <text x="70" y="84" textAnchor="middle" fill="#F0C542" fontSize="15" fontFamily="monospace" fontWeight="bold" letterSpacing="2">PLACE</text>
        {[10, 54, 98].map((x, i) => (
          <g key={i}>
            <rect x={x} y="102" width="32" height="42" rx="2" fill="rgba(248,248,248,0.04)" stroke="rgba(248,248,248,0.2)" strokeWidth="0.9" />
            <rect x={x + 3} y="106" width="10" height="8" rx="1" fill="rgba(240,197,66,0.2)" stroke="rgba(240,197,66,0.4)" strokeWidth="0.6" />
            <rect x={x + 19} y="106" width="10" height="8" rx="1" fill="rgba(240,197,66,0.2)" stroke="rgba(240,197,66,0.4)" strokeWidth="0.6" />
            <rect x={x + 9} y="118" width="14" height="26" rx="1" fill="rgba(248,248,248,0.07)" stroke="rgba(248,248,248,0.12)" strokeWidth="0.6" />
          </g>
        ))}
      </g>
      <g transform="translate(10, 30)">
        <rect width="58" height="42" rx="4" fill="rgba(248,248,248,0.05)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.2" />
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3, 4].map(c => (
            <circle key={`${r}-${c}`} cx={7 + c * 11} cy={7 + r * 8} r="1.7" fill="rgba(248,248,248,0.48)" />
          ))
        )}
        <rect x="0" y="34" width="58" height="8" rx="0 0 4 4" fill="rgba(240,197,66,0.2)" />
        <text x="29" y="41" textAnchor="middle" fill="#F0C542" fontSize="7.5" fontFamily="monospace" fontWeight="bold">CONCRETE</text>
      </g>
      <g transform="translate(332, 30)">
        <rect width="58" height="42" rx="4" fill="rgba(248,248,248,0.05)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.2" />
        {[12, 20, 28].map(y => (
          <line key={y} x1="8" y1={y} x2="50" y2={y} stroke="rgba(248,248,248,0.52)" strokeWidth="3.5" />
        ))}
        <rect x="0" y="34" width="58" height="8" rx="0 0 4 4" fill="rgba(240,197,66,0.2)" />
        <text x="29" y="41" textAnchor="middle" fill="#F0C542" fontSize="7.5" fontFamily="monospace" fontWeight="bold">STEEL</text>
      </g>
      <g transform="translate(10, 128)">
        <rect width="58" height="42" rx="4" fill="rgba(248,248,248,0.05)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.2" />
        <g clipPath="url(#elmawkaa-glass)">
          {[-20, -8, 4, 16, 28, 40, 52].map(x => (
            <line key={x} x1={x} y1="0" x2={x + 38} y2="42" stroke="rgba(77,208,225,0.58)" strokeWidth="1.8" />
          ))}
        </g>
        <rect x="0" y="34" width="58" height="8" rx="0 0 4 4" fill="rgba(77,208,225,0.2)" />
        <text x="29" y="41" textAnchor="middle" fill="#4dd0e1" fontSize="7.5" fontFamily="monospace" fontWeight="bold">GLASS</text>
      </g>
      <g transform="translate(332, 128)">
        <rect width="58" height="42" rx="4" fill="rgba(248,248,248,0.05)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.2" />
        <g clipPath="url(#elmawkaa-brick)">
          {[8, 19, 30].map((y, r) =>
            [0, 1, 2, 3].map(c => {
              const off = r % 2 === 0 ? 0 : 8;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={3 + c * 14 + off}
                  y={y}
                  width="12"
                  height="9"
                  rx="1.5"
                  fill="rgba(217,119,6,0.45)"
                  stroke="rgba(217,119,6,0.65)"
                  strokeWidth="0.5"
                />
              );
            })
          )}
        </g>
        <rect x="0" y="34" width="58" height="8" rx="0 0 4 4" fill="rgba(217,119,6,0.22)" />
        <text x="29" y="41" textAnchor="middle" fill="rgba(217,119,6,0.9)" fontSize="7.5" fontFamily="monospace" fontWeight="bold">BRICK</text>
      </g>
      <g stroke="rgba(240,197,66,0.35)" strokeWidth="1.1" strokeDasharray="4,3" fill="none">
        <line x1="70" y1="52" x2="131" y2="72" />
        <line x1="330" y1="52" x2="270" y2="72" />
        <line x1="70" y1="148" x2="131" y2="130" />
        <line x1="330" y1="148" x2="270" y2="130" />
      </g>
    </svg>
  );
}
