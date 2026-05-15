export function TwelveAmThumbnail() {
  const stars: [number, number][] = [
    [42, 18], [88, 12], [150, 28], [280, 8], [340, 32], [58, 86], [170, 72], [300, 62],
    [22, 40], [114, 52], [200, 18], [248, 46], [180, 108], [320, 98], [365, 160], [138, 148], [268, 118],
  ];
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <defs>
        <filter id="rev-12-sh"><feDropShadow dx="4" dy="8" stdDeviation="8" floodColor="rgba(0,0,0,0.9)" /></filter>
        <filter id="rev-12-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="13" /></filter>
        <mask id="moon-body" maskUnits="userSpaceOnUse" x="220" y="24" width="160" height="140">
          <circle cx="290" cy="92" r="60" fill="#fff" />
          <circle cx="308" cy="80" r="54" fill="#000" />
        </mask>
        <mask id="moon-glow-mask" maskUnits="userSpaceOnUse" x="210" y="14" width="180" height="160">
          <circle cx="290" cy="92" r="66" fill="#fff" />
          <circle cx="308" cy="80" r="54" fill="#000" />
        </mask>
      </defs>
      <rect width="400" height="200" fill="#06061a" />
      <g className="thumb-stars">
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 1.4 : 0.9} fill="white" fillOpacity={0.32 + (i % 3) * 0.12} />
        ))}
      </g>
      <g className="thumb-moon">
        <g className="thumb-moonglow" filter="url(#rev-12-glow)">
          <g mask="url(#moon-glow-mask)">
            <circle cx="290" cy="92" r="66" fill="rgba(200,200,240,0.5)" />
          </g>
        </g>
        <g mask="url(#moon-body)">
          <circle cx="290" cy="92" r="60" fill="#e0deed" filter="url(#rev-12-sh)" />
          <circle cx="266" cy="78" r="8" fill="rgba(0,0,0,0.07)" />
          <circle cx="304" cy="102" r="14" fill="rgba(0,0,0,0.06)" />
          <circle cx="284" cy="118" r="6" fill="rgba(0,0,0,0.07)" />
        </g>
      </g>
      <g filter="url(#rev-12-sh)" transform="rotate(-3 110 110)">
        <rect x="40" y="60" width="140" height="100" rx="10" fill="#16162a" stroke="rgba(129,140,248,0.32)" strokeWidth="1.5" />
        <circle cx="58" cy="78" r="6" fill="rgba(129,140,248,0.4)" />
        <rect x="70" y="74" width="34" height="4" rx="2" fill="rgba(255,255,255,0.16)" />
        <rect x="70" y="83" width="22" height="3" rx="1.5" fill="rgba(255,255,255,0.08)" />
        <rect x="52" y="104" width="116" height="4" rx="2" fill="rgba(255,255,255,0.13)" />
        <rect x="52" y="116" width="100" height="4" rx="2" fill="rgba(255,255,255,0.13)" />
        <rect x="52" y="128" width="80" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
        <path d="M58 152 Q52 146 58 142 Q64 146 58 152 Z" fill="rgba(129,140,248,0.55)" />
        <rect x="68" y="146" width="16" height="4" rx="1.5" fill="rgba(129,140,248,0.35)" />
      </g>
    </svg>
  );
}
