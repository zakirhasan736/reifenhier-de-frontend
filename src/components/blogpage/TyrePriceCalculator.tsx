'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CAR_TYRE_SIZES, parseSizeLabel } from '@/libs/carTyreSizes';
import { currentTyreSeason } from '@/libs/season';
import { buildVendorExitUrl, onVendorExitClick } from '@/libs/analytics/vendorExit';

const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

type Offer = {
  _id: string;
  slug: string;
  brand_name: string;
  product_name: string;
  cheapest_offer: number;
  total_offers?: number;
  wet_grip?: string;
  fuel_class?: string;
  noise_class?: string;
  cheapest_vendor?: {
    vendor?: string;
    vendor_id?: string;
    affiliate_product_cloak_url?: string;
    in_stock?: boolean;
  };
  vendor_name?: string;
};

const SEASON_OPTIONS = [
  { value: 'Winterreifen', label: 'Winterreifen' },
  { value: 'Sommerreifen', label: 'Sommerreifen' },
  { value: 'Ganzjahresreifen', label: 'Ganzjahresreifen' },
];

const eur = (n: number) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** A best … G worst; unknown sorts last */
const gradeRank = (g?: string) => {
  const c = String(g || '').trim().toUpperCase()[0];
  const i = 'ABCDEFG'.indexOf(c);
  return i < 0 ? 99 : i;
};

const selectCls =
  'w-full rounded-xl border border-[#E4E5EA] bg-white px-3 py-3 text-[15px] text-[#16171A] focus:border-primary-100 focus:outline-none';

export default function TyrePriceCalculator() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [size, setSize] = useState('');
  const [season, setSeason] = useState<string>(() => currentTyreSeason());
  const [offers, setOffers] = useState<Offer[]>([]);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const models = useMemo(
    () => CAR_TYRE_SIZES.find(m => m.make === make)?.models || [],
    [make]
  );
  const sizes = useMemo(() => models.find(m => m.model === model)?.sizes || [], [models, model]);

  // pick the first (most common) size whenever the model changes
  useEffect(() => {
    setSize(sizes[0] || '');
  }, [sizes]);

  useEffect(() => {
    const parsed = parseSizeLabel(size);
    if (!parsed || !API) {
      setOffers([]);
      setState('idle');
      return;
    }
    let cancelled = false;
    setState('loading');
    const q = new URLSearchParams({
      ...parsed,
      kategorie: season,
      priced: '1',
      sortField: 'price',
      sortOrder: 'asc',
      limit: '12',
      page: '1',
    });
    fetch(`${API}/api/products/product-lists?${q}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(j => {
        if (cancelled) return;
        const list: Offer[] = (j.products || []).filter((p: Offer) => p.cheapest_offer > 0);
        setOffers(list);
        setTotal(Number(j.total) || list.length);
        setState('done');
      })
      .catch(() => !cancelled && setState('error'));
    return () => {
      cancelled = true;
    };
  }, [size, season]);

  const cheapest = offers[0];
  // Price-performance pick: best wet grip among tyres within 25 % of the cheapest price
  const valuePick = useMemo(() => {
    if (!cheapest) return undefined;
    const limit = cheapest.cheapest_offer * 1.25;
    return [...offers]
      .filter(o => o.cheapest_offer <= limit)
      .sort(
        (a, b) =>
          gradeRank(a.wet_grip) - gradeRank(b.wet_grip) ||
          gradeRank(a.fuel_class) - gradeRank(b.fuel_class) ||
          a.cheapest_offer - b.cheapest_offer
      )[0];
  }, [offers, cheapest]);

  const sizeSlug = (() => {
    const p = parseSizeLabel(size);
    return p ? `/reifen/${p.width}-${p.height}-r${p.diameter}` : '/reifen';
  })();

  const vendorButton = (o: Offer, label = 'Zum Angebot') => {
    const v = o.cheapest_vendor;
    if (!v?.affiliate_product_cloak_url) {
      return (
        <Link
          href={`/produkte/${o.slug}`}
          className="inline-flex items-center justify-center rounded-full bg-primary-100 px-4 py-2 text-[14px] font-semibold text-white hover:opacity-90"
        >
          Preise vergleichen
        </Link>
      );
    }
    return (
      <a
        href={buildVendorExitUrl({
          token: v.affiliate_product_cloak_url,
          productId: o._id,
          from: 'blog-preisrechner',
          vendor: v.vendor,
          vendorId: v.vendor_id,
          brand: o.brand_name,
          instruction: label,
        })}
        target="_blank"
        rel="nofollow sponsored noopener"
        onClick={() =>
          onVendorExitClick({
            productId: o._id,
            productName: o.product_name,
            brandName: o.brand_name,
            vendor: v.vendor,
            vendorId: v.vendor_id,
            source: 'blog-preisrechner',
            instruction: label,
            vendorPrice: o.cheapest_offer,
          })
        }
        className="inline-flex items-center justify-center rounded-full bg-primary-100 px-4 py-2 text-[14px] font-semibold text-white hover:opacity-90"
      >
        {label}
      </a>
    );
  };

  const Pick = ({ o, badge, note }: { o: Offer; badge: string; note: string }) => (
    <div className="flex flex-col rounded-2xl border-2 border-primary-100/30 bg-[#F5F8FF] p-4">
      <span className="self-start rounded-full bg-primary-100 px-2.5 py-0.5 text-[12px] font-semibold text-white">
        {badge}
      </span>
      <Link href={`/produkte/${o.slug}`} className="mt-2 text-[16px] font-semibold text-[#16171A] hover:text-primary-100">
        {o.brand_name} {o.product_name}
      </Link>
      <span className="mt-1 text-[13px] text-[#5A5B61]">{note}</span>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-[24px] font-bold text-[#16171A]">{eur(o.cheapest_offer)} €</div>
          <div className="text-[12px] text-[#5A5B61]">
            4 Reifen: {eur(o.cheapest_offer * 4)} € · bei {o.cheapest_vendor?.vendor || o.vendor_name || 'Händler'}
          </div>
        </div>
        {vendorButton(o)}
      </div>
    </div>
  );

  return (
    <section
      aria-labelledby="preisrechner-title"
      className="not-prose my-8 rounded-3xl border border-[#E4E5EA] bg-white p-5 shadow-sm md:p-7"
    >
      <h2 id="preisrechner-title" className="text-[22px] font-semibold text-[#16171A]">
        Reifen-Preisrechner: Was kosten Reifen für mein Auto heute?
      </h2>
      <p className="mt-1 text-[14px] text-[#5A5B61]">
        Marke und Modell wählen – wir zeigen die aktuell günstigsten Angebote aller Händler.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-[13px] font-medium text-[#404042]">
          1. Automarke
          <select className={selectCls} value={make} onChange={e => { setMake(e.target.value); setModel(''); }}>
            <option value="">Marke wählen</option>
            {CAR_TYRE_SIZES.map(m => (
              <option key={m.make} value={m.make}>{m.make}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[13px] font-medium text-[#404042]">
          2. Modell
          <select className={selectCls} value={model} disabled={!make} onChange={e => setModel(e.target.value)}>
            <option value="">{make ? 'Modell wählen' : 'Erst Marke wählen'}</option>
            {models.map(m => (
              <option key={m.model} value={m.model}>{m.model}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[13px] font-medium text-[#404042]">
          Reifenart
          <select className={selectCls} value={season} onChange={e => setSeason(e.target.value)}>
            {SEASON_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {sizes.length > 0 ? (
        <div className="mt-4">
          <span className="text-[13px] text-[#5A5B61]">Häufige Serienbereifung für {make} {model}:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-full border px-3 py-1.5 text-[14px] ${
                  s === size
                    ? 'border-primary-100 bg-primary-100 text-white'
                    : 'border-[#E4E5EA] bg-white text-[#16171A] hover:border-primary-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-[#9AA0A8]">
            Bitte prüfen: Die zulässige Größe steht in Ihrer Zulassungsbescheinigung Teil I (Felder 15.1 und 15.2) bzw. auf der Reifenflanke.
          </p>
        </div>
      ) : null}

      <div className="mt-5" aria-live="polite">
        {state === 'loading' ? (
          <div className="grid gap-3 md:grid-cols-2">
            {[0, 1].map(i => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-[#F0F0F2]" />
            ))}
          </div>
        ) : null}

        {state === 'error' ? (
          <p className="rounded-xl bg-[#FFF8F0] px-4 py-3 text-[14px] text-[#8A4B12]">
            Preise konnten gerade nicht geladen werden.{' '}
            <Link href={sizeSlug} className="underline">Zum Preisvergleich {size}</Link>
          </p>
        ) : null}

        {state === 'done' && !cheapest ? (
          <p className="rounded-xl bg-[#F5F9FF] px-4 py-3 text-[14px] text-[#1B4F8A]">
            Für {size} als {season} gibt es gerade keine Angebote. Probieren Sie eine andere Reifenart oder{' '}
            <Link href={sizeSlug} className="underline">alle {size} Reifen</Link>.
          </p>
        ) : null}

        {state === 'done' && cheapest ? (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <Pick o={cheapest} badge="Günstigster Preis heute" note={`${season} ${size}`} />
              {valuePick && valuePick._id !== cheapest._id ? (
                <Pick
                  o={valuePick}
                  badge="Preis-Leistungs-Tipp"
                  note={`Bessere Nasshaftung (${valuePick.wet_grip || '–'}) für max. 25 % Aufpreis`}
                />
              ) : null}
            </div>

            <h3 className="mt-6 text-[16px] font-semibold text-[#16171A]">
              Weitere Angebote ({total.toLocaleString('de-DE')} {season} in {size})
            </h3>
            <ul className="mt-2 divide-y divide-[#F0F0F2] rounded-2xl border border-[#E4E5EA]">
              {offers.slice(0, 8).map(o => (
                <li key={o._id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <Link href={`/produkte/${o.slug}`} className="text-[15px] font-medium text-[#16171A] hover:text-primary-100">
                      {o.brand_name} {o.product_name}
                    </Link>
                    <div className="text-[12px] text-[#5A5B61]">
                      EU-Label: Nässe {o.wet_grip || '–'} · Rollw. {o.fuel_class || '–'}
                      {o.total_offers && o.total_offers > 1 ? ` · ${o.total_offers} Shops` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[17px] font-semibold text-[#16171A]">{eur(o.cheapest_offer)} €</span>
                    {vendorButton(o)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <Link href={sizeSlug} className="text-[14px] font-medium text-primary-100 underline">
                Alle {size} Reifen im Preisvergleich ansehen
              </Link>
            </div>
            <p className="mt-3 text-[11px] text-[#9AA0A8]">
              Preise pro Reifen inkl. MwSt., zzgl. Versand, Stand heute. Preise können sich beim Händler ändern. Affiliate-Links: Wir erhalten ggf. eine Provision, der Preis für Sie bleibt gleich.
            </p>
          </>
        ) : null}

        {state === 'idle' && !model ? (
          <p className="rounded-xl bg-[#F7F7F7] px-4 py-6 text-center text-[14px] text-[#5A5B61]">
            Wählen Sie oben Ihre Automarke und Ihr Modell.
          </p>
        ) : null}
      </div>
    </section>
  );
}
