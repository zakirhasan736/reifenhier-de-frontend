import { currentTyreSeason } from '@/libs/season';

/**
 * Homepage hero background per tyre season.
 * Photos are free Unsplash images (Unsplash License — free for commercial
 * use, no attribution required). To change one, swap `src` for another
 * images.unsplash.com URL or a file in /public.
 *  - Winter: Sergey Kuznetsov — unsplash.com/photos/G6H-gH1DEfc
 *  - Summer: Kahl Orr — unsplash.com/photos/MPdl02hySb0
 *  - All-season: Zac Nielson — unsplash.com/photos/m5g2IFRouCs
 * `wash` recolours the photo (colour blend), `tint` is the colour overlay laid on top so the
 * headline and filter card stay readable.
 */
export type HeroSeason = 'Winterreifen' | 'Sommerreifen' | 'Ganzjahresreifen';

export const SEASON_HERO: Record<
  HeroSeason,
  { src: string; position: string; wash: string; tint: string; glow: string }
> = {
  Winterreifen: {
    src: 'https://images.unsplash.com/photo-1759477444237-5cbcc866147a?auto=format&fit=crop&w=2400&q=80',
    position: 'center',
    wash: '#7DB4FF',
    tint: 'linear-gradient(90deg, rgba(8,20,44,.92) 0%, rgba(14,40,80,.72) 45%, rgba(60,120,190,.38) 100%), linear-gradient(180deg, rgba(170,210,255,.18) 0%, rgba(8,20,44,.78) 100%)',
    glow: 'rgba(120, 180, 255, .45)',
  },
  Sommerreifen: {
    src: 'https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?auto=format&fit=crop&w=2400&q=80',
    position: 'center',
    wash: '#FF9A3C',
    tint: 'linear-gradient(90deg, rgba(30,14,6,.9) 0%, rgba(60,28,10,.66) 45%, rgba(190,100,30,.3) 100%), linear-gradient(180deg, rgba(255,170,60,.16) 0%, rgba(30,14,6,.78) 100%)',
    glow: 'rgba(255, 150, 60, .4)',
  },
  Ganzjahresreifen: {
    src: 'https://images.unsplash.com/photo-1708805283017-c662be2c7a44?auto=format&fit=crop&w=2400&q=80',
    position: 'center',
    wash: '#38C9A6',
    tint: 'linear-gradient(90deg, rgba(6,26,26,.9) 0%, rgba(10,50,50,.68) 45%, rgba(40,150,130,.32) 100%), linear-gradient(180deg, rgba(120,230,200,.14) 0%, rgba(6,26,26,.78) 100%)',
    glow: 'rgba(60, 200, 170, .4)',
  },
};

export const isHeroSeason = (v?: string | null): v is HeroSeason =>
  !!v && v in SEASON_HERO;

/** Season the admin set for the featured slider, else the calendar season. */
export function initialHeroSeason(adminCategory?: string | null): HeroSeason {
  return isHeroSeason(adminCategory) ? adminCategory : currentTyreSeason();
}
