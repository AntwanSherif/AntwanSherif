import type { ReactNode } from 'react';
import { DinneyThumbnail } from './dinney';
import { ElmawkaaThumbnail } from './elmawkaa';
import { HaktivThumbnail } from './haktiv';
import { EncoreShotThumbnail } from './encoreshot';
import { TwelveAmThumbnail } from './twelve-am';
import { TwentyOneFarmerThumbnail } from './twenty-one-farmer';

export { DinneyThumbnail, EncoreShotThumbnail, ElmawkaaThumbnail, HaktivThumbnail, TwelveAmThumbnail, TwentyOneFarmerThumbnail };

export const THUMBNAIL_MAP: Record<string, ReactNode> = {
  'HAKTIV': <HaktivThumbnail />,
  'ElMawkaa': <ElmawkaaThumbnail />,
  '21Farmer': <TwentyOneFarmerThumbnail />,
  'Dinney': <DinneyThumbnail />,
  '12AM Thoughts': <TwelveAmThumbnail />,
  'EncoreShot': <EncoreShotThumbnail />,
};
