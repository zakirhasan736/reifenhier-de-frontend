import Link from 'next/link';
import { ArrowRight, CloudSun, Ruler, Snowflake, Sun, Tag } from 'lucide-react';
import { brandPath, euro, SEASONS, sizeLabel, sizePath } from '@/libs/seo/landing';
import { fetchLandings } from '@/libs/seo/landingData';
import SizeFinder from './SizeFinder';
import BrandTiles from './BrandTiles';

const SEASON_STYLE: Record<string, { icon: typeof Sun; tint: string; iconBg: string; iconColor: string }> = {
  sommerreifen: { icon: Sun, tint: 'hover:border-[#F8C98A]', iconBg: 'bg-[#FFF4E5]', iconColor: 'text-[#D97706]' },
  winterreifen: { icon: Snowflake, tint: 'hover:border-[#B9D3FF]', iconBg: 'bg-[#EAF2FF]', iconColor: 'text-[#2563EB]' },
  ganzjahresreifen: { icon: CloudSun, tint: 'hover:border-[#A7E3D2]', iconBg: 'bg-[#E7F7F1]', iconColor: 'text-[#0F8A6B]' },
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

  return (
    <section className="popular-links-v2 bg-[#F6F8FC] lg:py-[80px] py-14" aria-labelledby="beliebt-title">
      <div className="custom-container">
        <div className="max-w-[640px] mb-8">
          <span className="inline-block rounded-full bg-[#EEF2FF] text-primary-100 text-[12px] md:text-[13px] font-semibold tracking-[0.08em] uppercase px-3 py-1 mb-3">
            Schnell finden
          </span>
          <h2 id="beliebt-title" className="text-[26px] md:text-[32px] lg:text-[40px] font-semibold leading-[118%] tracking-[-0.01em] text-[#16171A]">
            Beliebte Reifengrößen und Marken
          </h2>
        </div>

        {/* Seasons */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {SEASONS.map(s => {
            const st = SEASON_STYLE[s.slug];
            const Icon = st.icon;
            const stat = seasonStats.get(s.category);
            return (
              <li key={s.slug}>
                <Link
                  href={`/${s.slug}`}
                  className={`group flex items-center gap-4 rounded-[16px] border border-[#E9ECF3] bg-mono-0 p-4 md:p-5 transition-all hover:-translate-y-0.5 ${st.tint}`}
                >
                  <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] ${st.iconBg} ${st.iconColor}`}>
                    <Icon size={24} strokeWidth={2} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[16px] md:text-[17px] font-semibold text-[#16171A]">{s.label}</span>
                    <span className="block text-[13px] text-[#6B6E76] font-secondary">
                      {stat?.count ? `${stat.count.toLocaleString('de-DE')} Reifen` : 'Alle Angebote'}
                      {stat?.minPrice ? ` · ab ${euro(stat.minPrice)} €` : ''}
                    </span>
                  </span>
                  <ArrowRight size={18} className="text-[#9AA0A8] transition-transform group-hover:translate-x-0.5 group-hover:text-primary-100" />
                </Link>
              </li>
            );
          })}
        </ul>

        {sizes.length ? (
          <div className="mb-10">
            <h3 className="flex items-center gap-2 mb-4 text-[18px] md:text-[20px] font-semibold text-[#16171A]">
              <Ruler size={20} className="text-primary-100" /> Reifen nach Größe
            </h3>
            <SizeFinder items={sizeItems} />
          </div>
        ) : null}

        {brands.length ? (
          <div>
            <h3 className="flex items-center gap-2 mb-4 text-[18px] md:text-[20px] font-semibold text-[#16171A]">
              <Tag size={20} className="text-primary-100" /> Reifen nach Marke
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
    </section>
  );
}
