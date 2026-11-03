'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BadgeCheck, RefreshCw, ShieldCheck } from 'lucide-react';
import FilterForm from './BannerFilter';
import {
  HeroSeason,
  SEASON_HERO,
  initialHeroSeason,
  isHeroSeason,
} from '@/libs/seasonHero';

const TRUST_POINTS = [
  { icon: RefreshCw, label: 'Preise mehrmals täglich aktualisiert' },
  { icon: BadgeCheck, label: 'Top-Marken & Händler im Vergleich' },
  { icon: ShieldCheck, label: '100 % kostenlos' },
];

type BannerSectionProps = {
  /** Season the admin chose for the featured "sessions" slider. */
  season?: string;
};

const BannerSection = ({ season }: BannerSectionProps) => {
  const [startSeason] = useState<HeroSeason>(() => initialHeroSeason(season));
  const [kategorie, setKategorie] = useState<string>(startSeason);
  // Keep the last chosen season's background when a tab is deselected.
  const [bgSeason, setBgSeason] = useState<HeroSeason>(startSeason);
  // Only download a season's photo once it is needed: the first one on load
  // (it is the LCP image), the others when the visitor switches to them.
  const [loaded, setLoaded] = useState<HeroSeason[]>([startSeason]);

  const handleKategorie = (value: string) => {
    setKategorie(value);
    if (isHeroSeason(value)) {
      setBgSeason(value);
      setLoaded(prev => (prev.includes(value) ? prev : [...prev, value]));
    }
  };

  return (
    <section
      className="banner-section hero-v2 relative font-primary overflow-visible"
      data-season={bgSeason}
    >
      {/* one layer per season, cross-faded */}
      <div className="absolute inset-0 overflow-hidden z-[98]">
        {loaded.map(key => {
          const cfg = SEASON_HERO[key];
          const active = key === bgSeason;
          const first = key === startSeason;
          return (
            <div
              key={key}
              aria-hidden={!active}
              className={`hero-v2-bg absolute inset-0 transition-opacity duration-700 ease-out ${
                active ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                className="object-cover"
                style={{ objectPosition: cfg.position }}
                src={cfg.src}
                alt={active ? 'Bannerbild Reifexa.de' : ''}
                fill
                sizes="100vw"
                priority={first}
                fetchPriority={first ? 'high' : 'low'}
                quality={60}
              />
              <div
                className="absolute inset-0 mix-blend-color opacity-35"
                style={{ background: cfg.wash }}
              />
              <div className="absolute inset-0" style={{ background: cfg.tint }} />
              <div
                className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 w-[900px] max-w-full h-[320px] blur-[20px]"
                style={{
                  background: `radial-gradient(50% 60% at 50% 70%, ${cfg.glow} 0%, transparent 100%)`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="custom-container relative z-999 h-full">
        <div className="banner-content w-full lg:pt-[72px] md:pt-14 pt-10 lg:pb-[72px] md:pb-12 pb-8">
          <div className="text-center mx-auto max-w-[820px] lg:mb-10 md:mb-8 mb-6">
            <span className="hero-v2-eyebrow inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 md:mb-5 text-[12px] md:text-[13px] font-medium tracking-wide text-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ADE80]" />
              </span>
              Über 40.000 Reifen im Live-Preisvergleich
            </span>

            <h1 className="text-mono-0 font-primary font-semibold leading-[112%] tracking-[-0.02em] text-[28px] md:text-[42px] lg:text-[54px] mb-3 md:mb-4">
              Der perfekte Reifen{' '}
              <br className="max-sm:hidden" />
              <span className="hero-v2-highlight">zum besten Preis.</span>
            </h1>

            <p className="!text-[#FFFFFFCC] text-[15px] md:text-[18px] lg:text-[19px] font-normal leading-[150%] max-w-[600px] mx-auto">
              Reifengröße eingeben, Angebote vergleichen und direkt beim
              günstigsten Händler bestellen.
            </p>
          </div>

          <FilterForm kategorie={kategorie} onKategorieChange={handleKategorie} />

          <ul className="hero-v2-trust flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 md:mt-8">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-[13px] md:text-[14px] text-white/85"
              >
                <Icon size={16} strokeWidth={2} className="text-white/70" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
