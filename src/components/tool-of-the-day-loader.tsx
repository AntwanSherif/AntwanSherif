'use client';

import dynamic from 'next/dynamic';

const ToolOfTheDay = dynamic(
  () => import('@/components/tool-of-the-day').then((m) => ({ default: m.ToolOfTheDay })),
  { ssr: false }
);

export { ToolOfTheDay };
