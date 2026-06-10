import type { ReactNode } from 'react';
import { DinneyThumbnail } from './dinney';
import { ElmawkaaThumbnail } from './elmawkaa';
import { HaktivThumbnail } from './haktiv';
import { EncoreShotThumbnail } from './encoreshot';
import { TwelveAmThumbnail } from './twelve-am';
import { TwentyOneFarmerThumbnail } from './twenty-one-farmer';

export { DinneyThumbnail, EncoreShotThumbnail, ElmawkaaThumbnail, HaktivThumbnail, TwelveAmThumbnail, TwentyOneFarmerThumbnail };

// Light-mode "lift" color per thumbnail. A mix-blend-lighten overlay raises the
// near-black SVG background to this tone (leaving the neon art untouched) so the
// dark thumbnails don't read as harsh black blocks on the light card. Applied in
// light mode only — in dark mode the thumbnails blend into the dark card as-is.
// Tuned per art: '#13131a' = subtle (surface), '#1e1e28' = softer (muted).
export const THUMB_LIFT: Record<string, string> = {
  'EncoreShot': '#13131a',
  'HAKTIV': '#1e1e28',
  '21Farmer': '#1e1e28',
  // defaulted to subtle (B) pending in-context review:
  'ElMawkaa': '#13131a',
  '12AM Thoughts': '#13131a',
  'Dinney': '#13131a',
};

export const THUMBNAIL_MAP: Record<string, ReactNode> = {
  'HAKTIV': <HaktivThumbnail />,
  'ElMawkaa': <ElmawkaaThumbnail />,
  '21Farmer': <TwentyOneFarmerThumbnail />,
  'Dinney': <DinneyThumbnail />,
  '12AM Thoughts': <TwelveAmThumbnail />,
  'EncoreShot': <EncoreShotThumbnail />,
};
