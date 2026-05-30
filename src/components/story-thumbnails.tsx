"use client";

const RANGE_STYLE = `
  @keyframes rtDrop{0%,100%{opacity:0;transform:translateY(-76px)}14%,83%{opacity:1;transform:translateY(0)}}
  @keyframes rtBadge{0%,38%,100%{opacity:0;transform:scale(0.4)}50%{opacity:1;transform:scale(1.1)}62%,85%{opacity:1;transform:scale(1)}}
  @keyframes rtGlow{0%,34%,100%{opacity:0}50%,83%{opacity:1}}
  .rt-p1{transform-box:fill-box;transform-origin:center;animation:rtDrop 5.2s ease-in-out infinite}
  .rt-p2{transform-box:fill-box;transform-origin:center;animation:rtDrop 5.2s ease-in-out infinite 0.5s}
  .rt-p3{transform-box:fill-box;transform-origin:center;animation:rtDrop 5.2s ease-in-out infinite 1s}
  .rt-badge{transform-box:fill-box;transform-origin:center;animation:rtBadge 5.2s ease-in-out infinite 1.5s}
  .rt-cglow{animation:rtGlow 5.2s ease-in-out infinite}
`;

function RangeProducts() {
  return <>
    <g className="rt-p1"><image href="/illustrations/pepsi-bottle.png"    x="159" y="105" width="20" height="60"/></g>
    <g className="rt-p2"><image href="/illustrations/coca-cola-bottle.png" x="204" y="113" width="20" height="60"/></g>
    <g className="rt-p3"><image href="/illustrations/redbull-can.png"      x="244" y="105" width="19" height="62"/></g>
  </>;
}

function RangeBadge({ cx = 282, cy = 118 }: { cx?: number; cy?: number }) {
  return (
    <g className="rt-badge">
      <circle cx={cx} cy={cy} r="20" fill="var(--accent-ai)"/>
      <circle cx={cx} cy={cy} r="20" fill="none" stroke="white" strokeOpacity=".25" strokeWidth="1"/>
      <text x={cx} y={cy - 3} fontSize="9" fontWeight="800" textAnchor="middle" fill="white" fontFamily="system-ui">30%</text>
      <text x={cx} y={cy + 8} fontSize="7" fontWeight="700" textAnchor="middle" fill="white" fontFamily="system-ui">OFF</text>
    </g>
  );
}

function PrismThumbB3() {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{`
        @keyframes b3Wave{0%{r:0;opacity:0.7}75%{r:230;opacity:0}100%{r:230;opacity:0}}
        @keyframes b3OldOut{0%,25%{opacity:0.45;transform:translateY(0)}45%,100%{opacity:0;transform:translateY(-9px)}}
        @keyframes b3NewIn{0%,35%{opacity:0;transform:translateY(9px)}55%,100%{opacity:1;transform:translateY(0)}}
        @keyframes b3Box{0%,100%{opacity:0.1}25%,45%{opacity:0.35}}
        @keyframes b3Idle{0%,100%{opacity:0.7}50%{opacity:0.9}}
        .b3w{animation:b3Wave 4s ease-out infinite}
        .b3ol{transform-box:fill-box;transform-origin:center;animation:b3OldOut 4s ease-in-out infinite}
        .b3ni{transform-box:fill-box;transform-origin:center;animation:b3NewIn 4s ease-in-out infinite}
        .b3bx{animation:b3Box 4s ease-in-out infinite}
        .b3ti{animation:b3Idle 2.8s ease-in-out infinite}
      `}</style>
      <rect width="400" height="200" fill="currentColor" className="fill-muted"/>
      <circle cx="200" cy="100" r="0" fill="none" stroke="var(--accent-ai)" strokeWidth="1.5" strokeOpacity=".5" className="b3w"/>
      {[{cy:55,lbl:"€4.99"},{cy:100,lbl:"€2.49"},{cy:145,lbl:"€9.99"}].map((t,i)=>(
        <g key={i} className="b3ti" style={{animationDelay:`${i*0.25}s`}}>
          <path d={`M30,${t.cy-22} L74,${t.cy-22} L80,${t.cy} L74,${t.cy+22} L30,${t.cy+22} Z`}
            fill="currentColor" className="fill-foreground" opacity=".1"/>
          <circle cx={75} cy={t.cy} r="4" fill="currentColor" className="fill-muted" opacity=".8"/>
          <text x={51} y={t.cy+5} fontSize="9" textAnchor="middle" fill="currentColor"
            className="fill-muted-foreground" opacity=".45" fontFamily="monospace">{t.lbl}</text>
        </g>
      ))}
      {[55,100,145].map((y,i)=>(
        <g key={i} opacity=".18">
          <line x1="90" y1={y} x2="156" y2={y} stroke="currentColor" className="stroke-muted-foreground" strokeWidth="1" strokeDasharray="4 3"/>
          <line x1="248" y1={y} x2="308" y2={y} stroke="var(--accent-ai)" strokeWidth="1" strokeDasharray="4 3"/>
        </g>
      ))}
      <rect x="162" y="68" width="76" height="64" rx="10" fill="var(--accent-ai)" className="b3bx"/>
      <rect x="162" y="68" width="76" height="64" rx="10" fill="none" stroke="var(--accent-ai)" strokeOpacity=".3" strokeWidth="1.5"/>
      <text x="200" y="94" fontSize="9" fontWeight="700" textAnchor="middle" fill="var(--accent-ai)" opacity=".85" fontFamily="system-ui">PRISM</text>
      <text x="200" y="108" fontSize="7" textAnchor="middle" fill="currentColor" className="fill-muted-foreground" opacity=".45">broadcasting</text>
      <text x="200" y="120" fontSize="7" textAnchor="middle" fill="currentColor" className="fill-muted-foreground" opacity=".35">update</text>
      {[
        {cy:55,old:"€4.99",neo:"€3.49",delay:"0.4s"},
        {cy:100,old:"€2.49",neo:"€1.49",delay:"0.55s"},
        {cy:145,old:"€9.99",neo:"€6.99",delay:"0.7s"},
      ].map((t,i)=>(
        <g key={i}>
          <path d={`M318,${t.cy-22} L362,${t.cy-22} L368,${t.cy} L362,${t.cy+22} L318,${t.cy+22} Z`}
            fill="var(--accent-ai)" opacity=".13"/>
          <path d={`M318,${t.cy-22} L362,${t.cy-22} L368,${t.cy} L362,${t.cy+22} L318,${t.cy+22} Z`}
            fill="none" stroke="var(--accent-ai)" strokeOpacity=".3" strokeWidth="1"/>
          <circle cx={363} cy={t.cy} r="4" fill="currentColor" className="fill-muted" opacity=".8"/>
          <text x={340} y={t.cy+3} fontSize="9" textAnchor="middle" fill="currentColor"
            className="fill-muted-foreground b3ol" fontFamily="monospace"
            textDecoration="line-through" style={{animationDelay:t.delay}}>{t.old}</text>
          <text x={340} y={t.cy+9} fontSize="11" fontWeight="700" textAnchor="middle"
            fill="var(--accent-ai)" fontFamily="monospace" className="b3ni"
            style={{animationDelay:t.delay}}>{t.neo}</text>
        </g>
      ))}
      <text x="51" y="192" fontSize="8" textAnchor="middle" fill="currentColor" className="fill-muted-foreground" opacity=".3">current</text>
      <text x="343" y="192" fontSize="8" textAnchor="middle" fill="var(--accent-ai)" opacity=".35">updated</text>
    </svg>
  );
}

function MdqThumbA2() {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{`
        @keyframes ma2In{0%{opacity:0;transform:translateX(-22px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes ma2CapDraw{0%{stroke-dashoffset:150}100%{stroke-dashoffset:0}}
        @keyframes ma2CapPulse{0%,100%{opacity:0.35}50%{opacity:0.85}}
        @keyframes ma2Badge{0%{opacity:0;transform:scale(0)}70%{transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
        @keyframes ma2Price{0%,100%{opacity:0.22}50%{opacity:0.48}}
        .ma2-d{transform-box:fill-box;transform-origin:center;animation:ma2In 0.45s ease-out forwards;opacity:0}
        .ma2-f{transform-box:fill-box;transform-origin:center;animation:ma2In 0.45s ease-out forwards;opacity:0}
        .ma2-cap{stroke-dasharray:150;stroke-dashoffset:150;animation:ma2CapDraw 0.5s ease-out 1s forwards,ma2CapPulse 2.4s ease-in-out infinite 1.6s}
        .ma2-badge{transform-box:fill-box;transform-origin:center;animation:ma2Badge 0.35s ease-out forwards;opacity:0}
        .ma2-price{animation:ma2Price 3s ease-in-out infinite}
      `}</style>
      <rect width="400" height="200" fill="currentColor" className="fill-muted"/>
      <text x="90" y="32" fontSize="8" textAnchor="middle" fill="var(--accent-ai)" opacity=".65"
        fontWeight="600" letterSpacing="0.08em" fontFamily="system-ui">DISCOUNTED</text>
      <text x="298" y="32" fontSize="8" textAnchor="middle" fill="currentColor"
        className="fill-muted-foreground" opacity=".4" fontWeight="600" letterSpacing="0.08em" fontFamily="system-ui">FULL PRICE</text>
      {[20,72,124].map((x,i) => (
        <g key={i} className="ma2-d" style={{animationDelay:`${i*0.14}s`}}>
          <rect x={x} y={58} width="44" height="58" rx="7" fill="var(--accent-ai)" opacity=".18"/>
          <rect x={x} y={58} width="44" height="58" rx="7" fill="none" stroke="var(--accent-ai)" strokeOpacity=".45" strokeWidth="1.5"/>
          <rect x={x+8} y={72} width="24" height="5" rx="2" fill="var(--accent-ai)" opacity=".4"/>
          <rect x={x+8} y={82} width="16" height="4" rx="2" fill="var(--accent-ai)" opacity=".3"/>
          <g className="ma2-badge" style={{animationDelay:`${0.55+i*0.1}s`}}>
            <circle cx={x+38} cy={62} r="10" fill="var(--accent-ai)"/>
            <text x={x+38} y={66} fontSize="9" fontWeight="800" textAnchor="middle" fill="white">%</text>
          </g>
        </g>
      ))}
      <line x1="183" y1="44" x2="183" y2="150" stroke="var(--accent-ai)" strokeWidth="1.5"
        strokeDasharray="150" className="ma2-cap"/>
      <text x="183" y="40" fontSize="7" textAnchor="middle" fill="var(--accent-ai)" opacity=".75"
        fontWeight="700" fontFamily="system-ui">CAP</text>
      <text x="183" y="163" fontSize="7" textAnchor="middle" fill="var(--accent-ai)" opacity=".5" fontFamily="monospace">max: 3</text>
      {[200,252,304].map((x,i) => (
        <g key={i} className="ma2-f" style={{animationDelay:`${0.42+i*0.14}s`}}>
          <rect x={x} y={58} width="44" height="58" rx="7" fill="currentColor" className="fill-foreground" opacity=".07"/>
          <rect x={x} y={58} width="44" height="58" rx="7" fill="none" stroke="currentColor"
            className="stroke-foreground" strokeOpacity=".12" strokeWidth="1"/>
          <rect x={x+8} y={72} width="24" height="5" rx="2" fill="currentColor" className="fill-foreground" opacity=".15"/>
          <rect x={x+8} y={82} width="16" height="4" rx="2" fill="currentColor" className="fill-foreground" opacity=".1"/>
          <text x={x+22} y={110} fontSize="8" textAnchor="middle" fill="currentColor"
            className="fill-muted-foreground ma2-price" fontFamily="monospace">€2.49</text>
        </g>
      ))}
      <text x="90" y="182" fontSize="8" textAnchor="middle" fill="var(--accent-ai)" opacity=".4">units 1–3 → discounted</text>
      <text x="283" y="182" fontSize="8" textAnchor="middle" fill="currentColor"
        className="fill-muted-foreground" opacity=".3">unit 4+ → full price</text>
    </svg>
  );
}

function RangeThumbCartB() {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="rtGlow2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-ai)" stopOpacity="0"/>
          <stop offset="100%" stopColor="var(--accent-ai)" stopOpacity="0.15"/>
        </linearGradient>
        <clipPath id="v2cartClip">
          <path d="M143,128 L149,174 L154,178 L268,178 L273,174 L279,128 Z"/>
        </clipPath>
      </defs>
      <style>{RANGE_STYLE}</style>
      <rect width="400" height="200" fill="currentColor" className="fill-muted"/>
      <g transform="translate(0, -50)">
        <path d="M143,128 L149,174 Q149,178 154,178 L268,178 Q273,178 273,174 L279,128 Z"
          fill="url(#rtGlow2)" className="rt-cglow"/>
        <RangeProducts />
        <g clipPath="url(#v2cartClip)" stroke="currentColor" className="stroke-foreground" strokeOpacity=".1" strokeWidth="1">
          <line x1="128" y1="128" x2="168" y2="178"/>
          <line x1="158" y1="128" x2="198" y2="178"/>
          <line x1="188" y1="128" x2="228" y2="178"/>
          <line x1="218" y1="128" x2="258" y2="178"/>
          <line x1="248" y1="128" x2="288" y2="178"/>
          <line x1="278" y1="128" x2="318" y2="178"/>
          <line x1="142" y1="178" x2="182" y2="128"/>
          <line x1="172" y1="178" x2="212" y2="128"/>
          <line x1="202" y1="178" x2="242" y2="128"/>
          <line x1="232" y1="178" x2="272" y2="128"/>
          <line x1="262" y1="178" x2="302" y2="128"/>
        </g>
        <path d="M143,128 L149,174 Q149,178 154,178 L268,178 Q273,178 273,174 L279,128 Z"
          fill="none" stroke="currentColor" className="stroke-foreground" strokeOpacity=".3" strokeWidth="2"/>
        <path d="M162,128 L162,112 Q162,107 167,107 L255,107 Q260,107 260,112 L260,128"
          fill="none" stroke="currentColor" className="stroke-foreground" strokeOpacity=".22" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="157" y1="178" x2="154" y2="190" stroke="currentColor" className="stroke-foreground" strokeOpacity=".18" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="265" y1="178" x2="268" y2="190" stroke="currentColor" className="stroke-foreground" strokeOpacity=".18" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="152" cy="195" r="5" fill="none" stroke="currentColor" className="stroke-foreground" strokeOpacity=".2" strokeWidth="1.5"/>
        <circle cx="270" cy="195" r="5" fill="none" stroke="currentColor" className="stroke-foreground" strokeOpacity=".2" strokeWidth="1.5"/>
        <RangeBadge cx={288} cy={118} />
      </g>
    </svg>
  );
}

export function StoryThumbnail({ slug }: { slug: string }) {
  if (slug === "prism") return <PrismThumbB3 />;
  if (slug === "range-promotions") return <RangeThumbCartB />;
  if (slug === "mdq") return <MdqThumbA2 />;
  return null;
}
