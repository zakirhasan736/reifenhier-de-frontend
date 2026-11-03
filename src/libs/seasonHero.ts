import { currentTyreSeason } from '@/libs/season';

/**
 * Homepage hero background per tyre season.
 * To change a season's photo, drop the file in /public/images/hero/
 * and update `src` here. `wash` recolours the photo (colour blend), `tint` is the colour overlay laid on top so the
 * headline and filter card stay readable.
 */
export type HeroSeason = 'Winterreifen' | 'Sommerreifen' | 'Ganzjahresreifen';

export const SEASON_HERO: Record<
  HeroSeason,
  { src: string; position: string; wash: string; tint: string; glow: string }
> = {
  Winterreifen: {
    src: '/images/banner-image.jpg',
    position: '70% center',
    wash: '#7DB4FF',
    tint: 'linear-gradient(90deg, rgba(8,20,44,.92) 0%, rgba(14,40,80,.72) 45%, rgba(60,120,190,.38) 100%), linear-gradient(180deg, rgba(170,210,255,.18) 0%, rgba(8,20,44,.78) 100%)',
    glow: 'rgba(120, 180, 255, .45)',
  },
  Sommerreifen: {
    src: '/images/banner-image-3.png',
    position: '75% center',
    wash: '#FF9A3C',
    tint: 'linear-gradient(90deg, rgba(30,14,6,.9) 0%, rgba(60,28,10,.66) 45%, rgba(190,100,30,.3) 100%), linear-gradient(180deg, rgba(255,170,60,.16) 0%, rgba(30,14,6,.78) 100%)',
    glow: 'rgba(255, 150, 60, .4)',
  },
  Ganzjahresreifen: {
    src: '/images/home/banner-cover-image.png',
    position: '30% center',
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
