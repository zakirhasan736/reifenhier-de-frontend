import Link from 'next/link';
import OptimizedImage from '@/components/elements/OptimizedImage';
import { productImageSrc } from '@/libs/productImage';
import { productCanonicalUrl, SITE_URL } from '@/libs/seo/site';
import { euro } from '@/libs/seo/landing';
import type { ListProduct } from '@/libs/seo/landingData';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';

export type LinkGroup = { title: string; links: { href: string; label: string; note?: string }[] };
export type Faq = { q: string; a: string };

type Props = {
  path: string; // e.g. /reifen/205-55-r16
  h1: string;
  intro: string[]; // paragraphs
  products: ListProduct[];
  total: number;
  crumbs: { name: string; url: string }[];
  faqs: Faq[];
  linkGroups: LinkGroup[];
  moreHref?: string; // full filter view
};

function productLabel(p: ListProduct) {
  return [p.brand_name, p.product_name].filter(Boolean).join(' ');
}

export default function LandingPage({
  path,
  h1,
  intro,
  products,
  total,
  crumbs,
  faqs,
  linkGroups,
  moreHref,
}: Props) {
  const url = `${SITE_URL}${path}`;

  return (
    <div className="landing-page pb-16">
      <Breadcrumbs crumbs={crumbs} />

      <section className="custom-container pt-2 pb-6">
        <h1 className="text-[26px] md:text-[34px] font-semibold font-primary text-[#16171A] leading-[120%]">
          {h1}
        </h1>
        <div className="mt-3 max-w-3xl space-y-3 text-[15px] md:text-[16px] leading-[160%] text-[#404042]">
          {intro.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      </section>

      <section className="custom-container" aria-labelledby="angebote-title">
        <div className="flex items-end justify-between gap-4 mb-4">
          <h2 id="angebote-title" className="text-[20px] md:text-[24px] font-semibold text-[#16171A]">
            Günstigste Angebote ({total.toLocaleString('de-DE')} Reifen)
          </h2>
          {moreHref ? (
            <Link href={moreHref} className="text-[14px] text-primary-100 underline whitespace-nowrap">
              Alle filtern
            </Link>
          ) : null}
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(p => {
            const img = productImageSrc(p.product_image, p.awin_image_url);
            const label = productLabel(p);
            return (
              <li
                key={p._id}
                className="rounded-2xl border border-[#E4E5EA] bg-white p-4 flex flex-col"
              >
                <Link href={`/produkte/${p.slug}`} className="flex flex-col h-full group">
                  <div className="flex h-36 items-center justify-center rounded-xl bg-[#F7F7F7] mb-3">
                    <OptimizedImage
                      src={img.src}
                      fallbacks={img.fallbacks}
                      alt={label}
                      width={140}
                      height={140}
                      className="h-32 w-32 object-contain"
                    />
                  </div>
                  <h3 className="text-[15px] font-semibold leading-snug text-[#16171A] group-hover:text-primary-100">
                    {label}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#5A5B61]">
                    {[p.merchant_product_third_category, p.lastIndex && p.speedIndex ? `${p.lastIndex}${p.speedIndex}` : '']
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  {p.fuel_class || p.wet_grip || p.noise_class ? (
                    <p className="mt-1 text-[12px] text-[#5A5B61]">
                      EU-Label:{' '}
                      {[p.fuel_class && `Rollw. ${p.fuel_class}`, p.wet_grip && `Nass ${p.wet_grip}`, p.noise_class && `Geräusch ${p.noise_class}`]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  ) : null}
                  <div className="mt-auto pt-3">
                    <span className="text-[20px] font-semibold text-[#16171A]">
                      ab {euro(p.cheapest_offer)} €
                    </span>
                    <span className="block text-[12px] text-[#5A5B61]">
                      {p.total_offers && p.total_offers > 1
                        ? `${p.total_offers} Shops im Vergleich`
                        : p.vendor_name
                          ? `bei ${p.vendor_name}`
                          : 'Preis inkl. MwSt.'}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        {moreHref && total > products.length ? (
          <div className="mt-6 text-center">
            <Link
              href={moreHref}
              className="inline-flex rounded-full bg-primary-100 px-6 py-3 text-[15px] font-semibold text-white hover:opacity-90"
            >
              Alle {total.toLocaleString('de-DE')} Reifen anzeigen
            </Link>
          </div>
        ) : null}
      </section>

      {faqs.length ? (
        <section className="custom-container mt-12 max-w-3xl" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-[20px] md:text-[24px] font-semibold text-[#16171A] mb-4">
            Häufige Fragen
          </h2>
          <div className="divide-y divide-[#E4E5EA] rounded-2xl border border-[#E4E5EA] bg-white">
            {faqs.map(f => (
              <details key={f.q} className="group p-4">
                <summary className="cursor-pointer list-none font-medium text-[#16171A] flex justify-between gap-4">
                  {f.q}
                  <span aria-hidden="true" className="transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-[15px] leading-[160%] text-[#404042]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {linkGroups
        .filter(g => g.links.length)
        .map(g => (
          <section key={g.title} className="custom-container mt-10">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-[#16171A] mb-3">{g.title}</h2>
            <ul className="flex flex-wrap gap-2">
              {g.links.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-1 rounded-full border border-[#E4E5EA] bg-white px-3 py-1.5 text-[14px] text-[#16171A] hover:border-primary-100 hover:text-primary-100"
                  >
                    {l.label}
                    {l.note ? <span className="text-[12px] text-[#9AA0A8]">{l.note}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

      <JsonLd
        id="ld-collection"
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          url,
          name: h1,
          description: intro[0],
          inLanguage: 'de-DE',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: total,
            itemListElement: products.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: productCanonicalUrl(p.slug),
              name: productLabel(p),
            })),
          },
        }}
      />
      <JsonLd
        id="ld-breadcrumb"
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: c.url,
          })),
        }}
      />
      {faqs.length ? (
        <JsonLd
          id="ld-faq"
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
      ) : null}
    </div>
  );
}
