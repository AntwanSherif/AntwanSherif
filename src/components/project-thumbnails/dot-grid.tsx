import type { ReactNode } from 'react';

export function DotGrid() {
  const dots: ReactNode[] = [];
  for (let x = 0; x <= 400; x += 22)
    for (let y = 0; y <= 200; y += 22)
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="rgba(255,255,255,0.05)" />);
  return <g>{dots}</g>;
}
