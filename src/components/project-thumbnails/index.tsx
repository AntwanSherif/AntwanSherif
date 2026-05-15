import type { ReactNode } from 'react';
import { DinneyThumbnail } from './dinney';
import { ElmawkaaThumbnail } from './elmawkaa';
import { HaktivThumbnail } from './haktiv';
import { InstaSuperEditThumbnail } from './insta-super-edit';
import { TwelveAmThumbnail } from './twelve-am';
import { TwentyOneFarmerThumbnail } from './twenty-one-farmer';

export { DinneyThumbnail, ElmawkaaThumbnail, HaktivThumbnail, InstaSuperEditThumbnail, TwelveAmThumbnail, TwentyOneFarmerThumbnail };

export const THUMBNAIL_MAP: Record<string, ReactNode> = {
  'HAKTIV': <HaktivThumbnail />,
  'ElMawkaa': <ElmawkaaThumbnail />,
  '21Farmer': <TwentyOneFarmerThumbnail />,
  'Dinney': <DinneyThumbnail />,
  '12AM Thoughts': <TwelveAmThumbnail />,
  'Insta Super Edit': <InstaSuperEditThumbnail />,
};
