import Link from 'next/link';
import { ArrowRight, CloudSun, Ruler, Snowflake, Sun, Tag } from 'lucide-react';
import { brandPath, euro, SEASONS, sizeLabel, sizePath } from '@/libs/seo/landing';
import { fetchLandings } from '@/libs/seo/landingData';
import SizeFinder from './SizeFinder';
import BrandTiles from './BrandTiles';

const SEASON_STYLE: Record<
  string,
  { icon: typeof Sun; card: string; disc: string; color: string; ring: string }
> = {
  sommerreifen: {
    icon: Sun,
    card: 'from-[#FFF8EC] via-[#FFF1DA] to-[#FFE2B8]',
    disc: 'bg-gradient-to-br from-[#FDBA4D] to-[#F59E0B]',
    color: '#B45309',
    ring: 'hover:ring-[#F8C98A]',
  },
  winterreifen: {
    icon: Snowflake,
    card: 'from-[#F1F6FF] via-[#E4EEFF] to-[#CFE0FF]',
    disc: 'bg-gradient-to-br from-[#60A5FA] to-[#2563EB]',
    color: '#1D4ED8',
    ring: 'hover:ring-[#A9C6FF]',
  },
  ganzjahresreifen: {
    icon: CloudSun,
    card: 'from-[#EEFBF5] via-[#DDF6EA] to-[#C3EEDB]',
    disc: 'bg-gradient-to-br from-[#34D399] to-[#059669]',
    color: '#047857',
    ring: 'hover:ring-[#9EE2C6]',
  },
};

/**
 * Crawlable hub of the most-searched sizes, brands and seasons. Links from
 * the homepage are what make Google discover and rank the landing pages.
 */
export default async function PopularLinks() {
  const { sizes, brands, seasons } = await fetchLandings();
  if (!sizes.length && !brands.length) return null;

  const seasonStats = new Map(seasons.map(s => [s.name, s]));
  const sizeItems = sizes.slice(0, 24).map(s => ({
    href: sizePath(s),
    label: sizeLabel(s),
    diameter: String(s.diameter),
    price: euro(s.minPrice),
    count: Number(s.count) || 0,
  }));
  const totalTyres = seasons.reduce((n, s) => n + (Number(s.count) || 0), 0);

  return (
    <section className="popular-links-v3 relative overflow-hidden bg-[#F6F8FC] py-14 lg:py-[88px]" aria-labelledby="beliebt-title">
      <span className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-[#DCE5FF] opacity-50 blur-[100px]" aria-hidden />
      <div className="custom-container relative">
        {/* ---------- Heading ---------- */}
        <div className="mb-8 flex flex-col gap-5 md:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[640px]">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] !text-[#2F4FD8] shadow-sm ring-1 ring-[#E4E7F0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2F4FD8]" /> Schnell finden
            </span>
            <h2 id="beliebt-title" className="text-[28px] font-bold leading-[115%] tracking-[-0.015em] !text-[#16171A] md:text-[36px] lg:text-[44px]">
              Beliebte Reifengrößen und Marken
            </h2>
            <p className="mt-3 !text-[15px] !leading-[160%] !tracking-normal !text-[#5A6072] md:!text-[17px]">
              Die meistgesuchten Größen und Marken mit dem aktuell günstigsten Händlerpreis – ein Klick, und Sie sehen alle Angebote.
            </p>
          </div>
          {totalTyres > 0 && (
            <div className="flex gap-2">
              {[
                [totalTyres.toLocaleString('de-DE'), 'Reifen im Vergleich'],
                [String(sizes.length), 'Größen'],
                [String(brands.length), 'Marken'],
              ].map(([v, l]) => (
                <div key={l} className="rounded-[14px] bg-white px-4 py-3 shadow-sm ring-1 ring-[#E4E7F0]">
                  <p className="!text-[18px] font-bold !leading-none !tracking-normal !text-[#16171A] tabular-nums md:!text-[20px]">{v}</p>
                  <p className="mt-1 !text-[12px] !leading-tight !tracking-normal !text-[#6B7280]">{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Seasons ---------- */}
        <ul className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 md:mb-10 md:gap-4">
          {SEASONS.map(s => {
            const st = SEASON_STYLE[s.slug];
            const Icon = st.icon;
            const stat = seasonStats.get(s.category);
            return (
              <li key={s.slug}>
                <Link
                  href={`/${s.slug}`}
                  className={`group relative flex h-full items-center gap-4 overflow-hidden rounded-[20px] bg-gradient-to-br ${st.card} p-5 ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(16,24,40,0.35)] md:p-6 ${st.ring}`}
                >
                  <Icon size={120} strokeWidth={1.2} color={st.color} className="pointer-events-none absolute -bottom-6 -right-5 opacity-[0.09] transition-transform duration-500 group-hover:rotate-12" aria-hidden />
                  <span className={`relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.35)] ${st.disc}`}>
                    <Icon size={26} strokeWidth={2.2} color="#fff" />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block text-[17px] font-bold !text-[#16171A] md:text-[19px]">{s.label}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
                      {stat?.count ? (
                        <span className="!text-[#4B5163] tabular-nums">{stat.count.toLocaleString('de-DE')} Reifen</span>
                      ) : (
                        <span className="!text-[#4B5163]">Alle Angebote</span>
                      )}
                      {stat?.minPrice ? (
                        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[12px] font-bold tabular-nums" style={{ color: st.color }}>
                          ab {euro(stat.minPrice)} €
                        </span>
                      ) : null}
                    </span>
                  </span>
                  <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:translate-x-1">
                    <ArrowRight size={18} strokeWidth={2.4} color={st.color} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="grid gap-5 md:gap-6">
          {sizes.length ? (
            <div className="rounded-[24px] bg-white p-4 shadow-[0_12px_40px_-28px_rgba(16,24,40,0.25)] ring-1 ring-[#E4E7F0] sm:p-6 md:p-7">
              <h3 className="mb-4 flex items-center gap-3 text-[18px] font-bold !text-[#16171A] md:text-[20px]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EEF2FF]">
                  <Ruler size={20} color="#2F4FD8" />
                </span>
                <span className="flex-1 !text-[#16171A]">Reifen nach Größe</span>
                <Link href="/reifen" className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] px-4 py-2 text-[13px] font-semibold shadow-[0_8px_18px_-10px_rgba(47,79,216,0.8)] transition-transform hover:-translate-y-0.5 sm:inline-flex">
                  <span className="!text-white">Alle Größen</span>
                  <ArrowRight size={14} strokeWidth={2.4} color="#fff" className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </h3>
              <SizeFinder items={sizeItems} />
            </div>
          ) : null}

          {brands.length ? (
            <div className="rounded-[24px] bg-white p-4 shadow-[0_12px_40px_-28px_rgba(16,24,40,0.25)] ring-1 ring-[#E4E7F0] sm:p-6 md:p-7">
              <h3 className="mb-4 flex items-center gap-3 text-[18px] font-bold !text-[#16171A] md:text-[20px]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EEF2FF]">
                  <Tag size={20} color="#2F4FD8" />
                </span>
                <span className="flex-1 !text-[#16171A]">Reifen nach Marke</span>
                <Link href="/marken" className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] px-4 py-2 text-[13px] font-semibold shadow-[0_8px_18px_-10px_rgba(47,79,216,0.8)] transition-transform hover:-translate-y-0.5 sm:inline-flex">
                  <span className="!text-white">Alle Marken</span>
                  <ArrowRight size={14} strokeWidth={2.4} color="#fff" className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </h3>
              <BrandTiles
                items={brands.slice(0, 20).map(b => ({
                  href: brandPath(b.name),
                  name: b.name,
                  price: euro(b.minPrice),
                  count: Number(b.count) || 0,
                }))}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
