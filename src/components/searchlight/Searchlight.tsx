'use client';

/**
 * Searchlight – the AI tyre assistant.
 * Floating, pulsing button on every page ("Lohnt sich dieser Reifen?" on product
 * pages), a help bubble when a visitor is clearly searching hard, and a panel with
 * four ways in: quick questions, tyre photo, car model, free text → three real,
 * priced picks from our catalogue (backend /api/searchlight).
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Camera, Car, Loader2, MessageSquareText, RotateCcw, Sparkles, X, ListChecks } from 'lucide-react';
import OptimizedImage from '@/components/elements/OptimizedImage';
import { productImageSrc } from '@/libs/productImage';
import { buildVendorExitUrl } from '@/libs/analytics/vendorExit';
import {
  carSizes,
  productCheck,
  readPhoto,
  recommend,
  shrinkImage,
  type CarResult,
  type CarSize,
  type Criteria,
  type OpenDetail,
  type Pick,
  type ProductCheck,
  type RecommendResult,
} from './api';

type Screen = 'start' | 'size' | 'season' | 'drive' | 'priority' | 'photo' | 'car' | 'text' | 'loading' | 'results' | 'product';

const WIDTHS = [135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325];
const HEIGHTS = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
const RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const SLOT: Record<string, { label: string; tone: string }> = {
  best_price: { label: '💰 Bester Preis', tone: 'bg-[#E7F7F1] text-[#0F6B53]' },
  best_choice: { label: '⭐ Beste Wahl', tone: 'bg-[#EEF2FF] text-primary-100' },
  premium: { label: '🛡️ Premium', tone: 'bg-[#FFF4E5] text-[#9A5B00]' },
  cheaper: { label: 'Günstiger', tone: 'bg-[#E7F7F1] text-[#0F6B53]' },
  better: { label: 'Besser für wenig mehr', tone: 'bg-[#EEF2FF] text-primary-100' },
  current: { label: 'Dieser Reifen', tone: 'bg-[#F2F3F5] text-[#404042]' },
};
const eur = (n: number) => `${n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const DISMISS_KEY = 'sl_dismiss_until';

function safeGet(store: 'local' | 'session', k: string) {
  try {
    return (store === 'local' ? localStorage : sessionStorage).getItem(k);
  } catch {
    return null;
  }
}
function safeSet(store: 'local' | 'session', k: string, v: string) {
  try {
    (store === 'local' ? localStorage : sessionStorage).setItem(k, v);
  } catch {
    /* storage blocked */
  }
}

function Choice({ label, sub, onClick, icon }: { label: string; sub?: string; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[12px] border border-[#E4E7EE] bg-white px-4 py-3 text-left hover:border-primary-100 hover:bg-[#F7F9FF] transition-colors cursor-pointer"
    >
      {icon ? <span className="text-primary-100 shrink-0">{icon}</span> : null}
      <span>
        <span className="block text-[15px] font-semibold text-[#16171A]">{label}</span>
        {sub ? <span className="block text-[13px] text-[#5A5B61]">{sub}</span> : null}
      </span>
    </button>
  );
}

function PickCard({ p }: { p: Pick }) {
  const img = productImageSrc(p.image);
  const slot = SLOT[p.slot] || SLOT.current;
  const href = p.token
    ? buildVendorExitUrl({ token: p.token, productId: p.id, from: 'searchlight', vendor: p.vendor, vendorId: p.vendorId, brand: p.brand, instruction: 'Zum Angebot' })
    : `/produkte/${p.slug}`;
  return (
    <div className="rounded-[14px] border border-[#E4E7EE] bg-white p-3">
      <span className={`inline-block rounded-full px-2.5 py-1 text-[12px] font-semibold ${slot.tone}`}>{slot.label}</span>
      <div className="mt-2 flex gap-3">
        <Link href={`/produkte/${p.slug}`} className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[10px] bg-[#F7F7F7]">
          <OptimizedImage src={img.src} fallbacks={img.fallbacks} alt={p.name} width={72} height={72} className="h-[72px] w-[72px] object-contain" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/produkte/${p.slug}`} className="block text-[14px] font-semibold leading-snug text-[#16171A] hover:text-primary-100 line-clamp-2">
            {p.name}
          </Link>
          <div className="mt-1 flex flex-wrap gap-1 text-[11.5px] text-[#5A5B61]">
            {p.size ? <span>{p.size} {p.index}</span> : null}
            {p.wet ? <span className="rounded bg-[#EEF2FF] px-1.5">Nass {p.wet}</span> : null}
            {p.fuel ? <span className="rounded bg-[#FFF8E6] px-1.5">Rollw. {p.fuel}</span> : null}
            {p.noiseDb ? <span className="rounded bg-[#F2F3F5] px-1.5">{p.noiseDb} dB</span> : null}
          </div>
          <div className="mt-1.5">
            <span className="text-[17px] font-bold text-[#16171A]">{eur(p.price)}</span>
            <span className="ml-1 text-[12px] text-[#5A5B61]">· 4 Stück {eur(p.priceFor4)}</span>
          </div>
        </div>
      </div>
      {p.reason ? <p className="mt-2 text-[13px] leading-[145%] text-[#404042]">{p.reason}</p> : null}
      <a
        href={href}
        target={p.token ? '_blank' : undefined}
        rel={p.token ? 'sponsored noopener' : undefined}
        className="mt-2 flex items-center justify-center rounded-[10px] bg-primary-100 py-2.5 text-[14px] font-semibold !text-white hover:opacity-90"
      >
        Zum Angebot{p.vendor ? ` bei ${p.vendor}` : ''}
      </a>
      {p.offerCount > 1 ? (
        <Link href={`/produkte/${p.slug}`} className="mt-1.5 block text-center text-[12.5px] text-primary-100 hover:underline">
          Alle {p.offerCount} Angebote vergleichen
        </Link>
      ) : null}
    </div>
  );
}

export default function Searchlight() {
  const pathname = usePathname() || '/';
  const productSlug = /^\/produkte\/([^/?#]+)/.exec(pathname)?.[1] || '';
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>('start');
  const [crit, setCrit] = useState<Criteria>({ width: '205', height: '55', diameter: '16', priority: 'balanced' });
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [check, setCheck] = useState<ProductCheck | null>(null);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [car, setCar] = useState({ make: '', model: '', year: '' });
  const [carRes, setCarRes] = useState<CarResult | null>(null);
  const [photoMsg, setPhotoMsg] = useState('');
  const [bubble, setBubble] = useState('');
  const [used, setUsed] = useState(false);
  const history = useRef<Screen[]>([]);

  const go = useCallback((s: Screen) => {
    setScreen(prev => {
      if (prev !== 'loading') history.current.push(prev);
      return s;
    });
  }, []);
  const back = () => setScreen(history.current.pop() || 'start');

  const runRecommend = useCallback(async (c: Criteria, freeText?: string) => {
    setError('');
    setScreen('loading');
    try {
      const r = await recommend({ ...c, ...(freeText ? { text: freeText } : {}) });
      setResult(r);
      if (r.criteria) setCrit(prev => ({ ...prev, ...r.criteria }));
      setScreen(r.needs === 'size' ? 'text' : 'results');
    } catch {
      setError('Da ist etwas schiefgelaufen. Bitte versuche es erneut.');
      setScreen('start');
    }
  }, []);

  const runProductCheck = useCallback(async (slug: string) => {
    setError('');
    setScreen('loading');
    try {
      setCheck(await productCheck(slug));
      setScreen('product');
    } catch {
      setError('Diesen Reifen konnte ich gerade nicht prüfen.');
      setScreen('start');
    }
  }, []);

  const openWith = useCallback(
    (d: OpenDetail = {}) => {
      setOpen(true);
      setUsed(true);
      setBubble('');
      safeSet('session', 'sl_bubble_shown', '1');
      history.current = [];
      const mode = d.mode || (productSlug ? 'product' : 'start');
      if (mode === 'product' && (d.slug || productSlug)) runProductCheck(d.slug || productSlug);
      else setScreen(mode === 'questions' ? 'size' : (mode as Screen));
    },
    [productSlug, runProductCheck]
  );

  // Open from banner / sidebar / anywhere
  useEffect(() => {
    const h = (e: Event) => openWith((e as CustomEvent<OpenDetail>).detail || {});
    window.addEventListener('searchlight:open', h);
    return () => window.removeEventListener('searchlight:open', h);
  }, [openWith]);

  // Help bubble: only when someone is clearly searching hard; once per visit; quiet 7 days after "Nein danke"
  useEffect(() => {
    if (open || used) return;
    if (safeGet('session', 'sl_bubble_shown')) return;
    if (Number(safeGet('local', DISMISS_KEY) || 0) > Date.now()) return;
    const views = Number(safeGet('session', 'sl_views') || 0) + (productSlug ? 1 : 0);
    const searches = Number(safeGet('session', 'sl_searches') || 0) + (pathname === '/produkte' ? 1 : 0);
    if (productSlug) safeSet('session', 'sl_views', String(views));
    if (pathname === '/produkte') safeSet('session', 'sl_searches', String(searches));
    let msg = '';
    if (views >= 3) msg = 'Ich zeige dir die 3 besten Reifen für deine Größe.';
    else if (searches >= 3) msg = 'Soll ich dir helfen, den passenden Reifen zu finden?';
    const show = (m: string) => {
      setBubble(m);
      safeSet('session', 'sl_bubble_shown', '1');
    };
    if (msg) {
      const t = setTimeout(() => show(msg), 10000);
      return () => clearTimeout(t);
    }
    if (productSlug) {
      // 45 s on a product page without leaving → offer the check
      const t = setTimeout(() => show('Unsicher? Ich vergleiche diesen Reifen mit den Alternativen.'), 45000);
      return () => clearTimeout(t);
    }
  }, [pathname, productSlug, open, used]);

  const floatingLabel = productSlug ? 'Lohnt sich dieser Reifen?' : pathname.startsWith('/produkte') || /^\/(reifen|marken|winterreifen|sommerreifen|ganzjahresreifen)/.test(pathname) ? 'Hilf mir wählen' : 'Searchlight';

  const onPhoto = async (file?: File | null) => {
    if (!file) return;
    setPhotoMsg('Ich lese die Reifenflanke …');
    try {
      const data = await shrinkImage(file);
      const r = await readPhoto(data);
      if (r.ok && r.width && r.height && r.diameter) {
        setCrit(c => ({
          ...c,
          width: r.width,
          height: r.height,
          diameter: r.diameter,
          minLoadIndex: Number(r.loadIndex) || 0,
          minSpeed: r.speedIndex || '',
          season: r.season === 'winter' || r.season === 'sommer' || r.season === 'ganzjahr' ? r.season : c.season,
        }));
        setPhotoMsg(`Erkannt: ${r.width}/${r.height} R${r.diameter} ${r.loadIndex || ''}${r.speedIndex || ''}${r.brand ? ` · ${r.brand}` : ''}. Bitte kurz prüfen.`);
        go('size');
      } else {
        setPhotoMsg(
          r.error === 'ai_not_configured'
            ? 'Die Fotoerkennung ist gerade nicht verfügbar. Wähle die Größe bitte von Hand.'
            : r.hint || 'Ich konnte die Größe nicht sicher lesen. Bitte ein schärferes Foto der Reifenflanke (z. B. 205/55 R16) aufnehmen.'
        );
      }
    } catch {
      setPhotoMsg('Das Foto konnte nicht gelesen werden. Bitte erneut versuchen.');
    }
  };

  const onCar = async () => {
    setCarRes(null);
    setError('');
    if (!car.make || !car.model) return setError('Bitte Marke und Modell angeben.');
    setScreen('loading');
    try {
      const r = await carSizes(car);
      setCarRes(r);
      if (r.error) setError(r.error === 'ai_not_configured' ? 'Die Fahrzeugsuche ist gerade nicht verfügbar. Bitte die Größe von der Reifenflanke ablesen.' : 'Zu diesem Auto habe ich keine sicheren Größen gefunden. Bitte die Größe von der Reifenflanke ablesen.');
    } catch {
      setError('Die Fahrzeugsuche hat nicht geklappt.');
    }
    setScreen('car');
  };

  const pickSize = (s: CarSize) => {
    setCrit(c => ({ ...c, width: s.width, height: s.height, diameter: s.diameter, minLoadIndex: Number(s.loadIndex) || 0, minSpeed: s.speedIndex || '' }));
    go('season');
  };

  const sel = 'w-full rounded-[10px] border border-[#E1E5EE] bg-white px-3 py-2.5 text-[15px] font-medium';

  return (
    <>
      {/* Floating, pulsing button */}
      {!open && (
        <div className="fixed z-[900] bottom-24 right-4 md:bottom-6 md:right-6 flex flex-col items-end gap-2 print:hidden">
          {bubble ? (
            <div className="max-w-[260px] rounded-[14px] border border-[#E4E7EE] bg-white p-3 text-[13.5px] leading-[145%] text-[#16171A] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <p>{bubble}</p>
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={() => openWith({})} className="rounded-full bg-primary-100 px-3 py-1.5 text-[12.5px] font-semibold !text-white cursor-pointer">
                  Ja, hilf mir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBubble('');
                    safeSet('local', DISMISS_KEY, String(Date.now() + 7 * 864e5));
                  }}
                  className="rounded-full px-3 py-1.5 text-[12.5px] text-[#5A5B61] hover:bg-[#F2F3F5] cursor-pointer"
                >
                  Nein danke
                </button>
              </div>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => openWith({})}
            aria-label={`Searchlight: ${floatingLabel}`}
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5B3DF5] to-primary-100 py-3 pl-3.5 pr-4 text-[14px] font-semibold !text-white shadow-[0_10px_30px_rgba(58,100,246,0.45)] cursor-pointer"
          >
            {!used ? <span className="absolute inset-0 rounded-full bg-primary-100 opacity-50 motion-safe:animate-ping" aria-hidden /> : null}
            <span className="sl-white relative inline-flex items-center gap-2">
              <Sparkles size={18} color="#fff" />
              <span className={productSlug ? '' : 'max-sm:hidden'}>{floatingLabel}</span>
            </span>
          </button>
        </div>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-[100000] print:hidden" role="dialog" aria-modal="true" aria-label="Searchlight Reifen-Assistent">
          <button type="button" aria-label="Schließen" className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 right-0 flex max-h-[92vh] w-full flex-col rounded-t-[22px] bg-[#F7F8FB] shadow-2xl md:top-0 md:max-h-none md:h-full md:w-[440px] md:rounded-none md:rounded-l-[22px]">
            <div className="flex items-center gap-2 border-b border-[#E9ECF3] bg-white px-4 py-3 md:rounded-tl-[22px] rounded-t-[22px] md:rounded-tr-none">
              {screen !== 'start' && screen !== 'loading' ? (
                <button type="button" onClick={back} aria-label="Zurück" className="rounded-full p-1.5 hover:bg-[#F2F3F5] cursor-pointer">
                  <ArrowLeft size={18} />
                </button>
              ) : null}
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#5B3DF5] to-primary-100">
                <Sparkles size={16} color="#fff" />
              </span>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-[#16171A] leading-tight">Searchlight</p>
                <p className="text-[12px] text-[#5A5B61] leading-tight">Dein KI-Reifenassistent</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Schließen" className="rounded-full p-1.5 hover:bg-[#F2F3F5] cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {error ? <p className="rounded-[10px] bg-[#FDECEC] px-3 py-2 text-[13px] text-[#A12626]">{error}</p> : null}

              {screen === 'start' && (
                <>
                  <p className="text-[15px] text-[#16171A]">
                    <strong>Hallo!</strong> Ich finde in wenigen Sekunden die passenden Reifen und zeige dir die 3 besten Angebote. Wie möchtest du starten?
                  </p>
                  <Choice icon={<ListChecks size={20} />} label="Ein paar kurze Fragen" sub="3–4 Klicks, kein Tippen" onClick={() => go('size')} />
                  <Choice icon={<Camera size={20} />} label="Foto vom Reifen" sub="Ich lese die Größe von der Reifenflanke" onClick={() => go('photo')} />
                  <Choice icon={<Car size={20} />} label="Mein Auto angeben" sub="z. B. VW Golf 7, 2016" onClick={() => go('car')} />
                  <Choice icon={<MessageSquareText size={20} />} label="Einfach beschreiben" sub="„Winterreifen für meinen Golf, max. 400 €“" onClick={() => go('text')} />
                  {productSlug ? (
                    <Choice icon={<Sparkles size={20} />} label="Lohnt sich dieser Reifen?" sub="Preis, Alternativen und bester Zeitpunkt" onClick={() => runProductCheck(productSlug)} />
                  ) : null}
                </>
              )}

              {screen === 'size' && (
                <>
                  {photoMsg ? <p className="rounded-[10px] bg-[#EEF2FF] px-3 py-2 text-[13px] text-[#2B3A8C]">{photoMsg}</p> : null}
                  <p className="text-[15px] font-semibold text-[#16171A]">Welche Reifengröße hast du?</p>
                  <p className="text-[13px] text-[#5A5B61]">Steht auf der Reifenflanke, z. B. 205/55 R16.</p>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="text-[12px] text-[#5A5B61]">Breite
                      <select className={sel} value={crit.width} onChange={e => setCrit({ ...crit, width: e.target.value })}>
                        {WIDTHS.map(w => <option key={w}>{w}</option>)}
                      </select>
                    </label>
                    <label className="text-[12px] text-[#5A5B61]">Höhe
                      <select className={sel} value={crit.height} onChange={e => setCrit({ ...crit, height: e.target.value })}>
                        {HEIGHTS.map(h => <option key={h}>{h}</option>)}
                      </select>
                    </label>
                    <label className="text-[12px] text-[#5A5B61]">Zoll
                      <select className={sel} value={crit.diameter} onChange={e => setCrit({ ...crit, diameter: e.target.value })}>
                        {RIMS.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </label>
                  </div>
                  <button type="button" onClick={() => go('season')} className="w-full rounded-[10px] bg-primary-100 py-3 text-[15px] font-semibold !text-white cursor-pointer">
                    Weiter
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => go('photo')} className="rounded-[10px] border border-[#E4E7EE] bg-white py-2.5 text-[13px] font-medium cursor-pointer">📷 Weiß ich nicht – Foto</button>
                    <button type="button" onClick={() => go('car')} className="rounded-[10px] border border-[#E4E7EE] bg-white py-2.5 text-[13px] font-medium cursor-pointer">🚗 Weiß ich nicht – Auto</button>
                  </div>
                </>
              )}

              {screen === 'season' && (
                <>
                  <p className="text-[15px] font-semibold text-[#16171A]">Für welche Saison? <span className="font-normal text-[#5A5B61]">({crit.width}/{crit.height} R{crit.diameter})</span></p>
                  <Choice label="❄️ Winterreifen" sub="Pflicht bei Schnee und Glätte" onClick={() => { setCrit({ ...crit, season: 'winter' }); go('drive'); }} />
                  <Choice label="☀️ Sommerreifen" sub="Beste Werte bei Wärme" onClick={() => { setCrit({ ...crit, season: 'sommer' }); go('drive'); }} />
                  <Choice label="🌦️ Ganzjahresreifen" sub="Ein Satz für das ganze Jahr" onClick={() => { setCrit({ ...crit, season: 'ganzjahr' }); go('drive'); }} />
                </>
              )}

              {screen === 'drive' && (
                <>
                  <p className="text-[15px] font-semibold text-[#16171A]">Wie fährst du meistens?</p>
                  <Choice label="🏙️ Viel Stadt" sub="Kurze Strecken" onClick={() => go('priority')} />
                  <Choice label="🛣️ Viel Autobahn" sub="Hohe Geschwindigkeit, lange Strecken" onClick={() => { setCrit({ ...crit, priority: 'safety' }); go('priority'); }} />
                  <Choice label="🚗 Gemischt" onClick={() => go('priority')} />
                  <Choice label="🅿️ Wenig" sub="Unter 8.000 km im Jahr" onClick={() => { setCrit({ ...crit, priority: 'cheap' }); go('priority'); }} />
                </>
              )}

              {screen === 'priority' && (
                <>
                  <p className="text-[15px] font-semibold text-[#16171A]">Was ist dir am wichtigsten?</p>
                  <Choice label="💰 Möglichst günstig" onClick={() => runRecommend({ ...crit, priority: 'cheap' })} />
                  <Choice label="⭐ Bestes Preis-Leistungs-Verhältnis" onClick={() => runRecommend({ ...crit, priority: 'balanced' })} />
                  <Choice label="🛡️ Maximale Sicherheit" sub="Kurzer Bremsweg bei Nässe" onClick={() => runRecommend({ ...crit, priority: 'safety' })} />
                  <Choice label="🤫 Leise und sparsam" onClick={() => runRecommend({ ...crit, priority: 'quiet' })} />
                  <label className="block pt-1 text-[12.5px] text-[#5A5B61]">
                    Budget für 4 Reifen (optional)
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="z. B. 400"
                      className={sel}
                      value={crit.budgetPer4 || ''}
                      onChange={e => setCrit({ ...crit, budgetPer4: Number(e.target.value) || 0 })}
                    />
                  </label>
                </>
              )}

              {screen === 'photo' && (
                <>
                  <p className="text-[15px] font-semibold text-[#16171A]">Foto der Reifenflanke</p>
                  <p className="text-[13px] text-[#5A5B61]">Fotografiere die Beschriftung auf der Seite des Reifens (z. B. „205/55 R16 91H“). Das Foto wird nur gelesen und nicht gespeichert.</p>
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-primary-100/40 bg-white py-8 text-primary-100">
                    <Camera size={28} />
                    <span className="text-[14px] font-semibold">Foto aufnehmen oder auswählen</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => onPhoto(e.target.files?.[0])} />
                  </label>
                  {photoMsg ? <p className="text-[13px] text-[#404042]">{photoMsg}</p> : null}
                </>
              )}

              {screen === 'car' && (
                <>
                  <p className="text-[15px] font-semibold text-[#16171A]">Welches Auto fährst du?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input className={sel} placeholder="Marke, z. B. VW" value={car.make} onChange={e => setCar({ ...car, make: e.target.value })} />
                    <input className={sel} placeholder="Modell, z. B. Golf 7" value={car.model} onChange={e => setCar({ ...car, model: e.target.value })} />
                  </div>
                  <input className={sel} inputMode="numeric" placeholder="Baujahr (optional)" value={car.year} onChange={e => setCar({ ...car, year: e.target.value })} />
                  <button type="button" onClick={onCar} className="w-full rounded-[10px] bg-primary-100 py-3 text-[15px] font-semibold !text-white cursor-pointer">Größen finden</button>
                  {carRes?.sizes?.length ? (
                    <div className="space-y-2">
                      <p className="text-[13px] text-[#404042]">{carRes.generation ? `${carRes.generation}: ` : ''}Welche Größe steht auf deinem Reifen?</p>
                      {carRes.sizes.map(s => (
                        <Choice key={`${s.width}${s.height}${s.diameter}`} label={`${s.width}/${s.height} R${s.diameter} ${s.loadIndex || ''}${s.speedIndex || ''}`} sub={s.original ? 'Werksgröße' : undefined} onClick={() => pickSize(s)} />
                      ))}
                      {carRes.note ? <p className="text-[12px] text-[#5A5B61]">{carRes.note}</p> : null}
                    </div>
                  ) : null}
                </>
              )}

              {screen === 'text' && (
                <>
                  <p className="text-[15px] font-semibold text-[#16171A]">{result?.needs === 'size' ? result.message : 'Beschreib kurz, was du suchst'}</p>
                  <textarea
                    rows={4}
                    className="w-full rounded-[12px] border border-[#E1E5EE] bg-white p-3 text-[15px]"
                    placeholder="z. B. Winterreifen 205/55 R16, viel Autobahn, max. 400 € für vier"
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                  <button type="button" disabled={!text.trim()} onClick={() => runRecommend(crit, text)} className="w-full rounded-[10px] bg-primary-100 py-3 text-[15px] font-semibold !text-white disabled:opacity-50 cursor-pointer">
                    Reifen finden
                  </button>
                  {result?.needs === 'size' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => go('photo')} className="rounded-[10px] border border-[#E4E7EE] bg-white py-2.5 text-[13px] font-medium cursor-pointer">📷 Foto vom Reifen</button>
                      <button type="button" onClick={() => go('car')} className="rounded-[10px] border border-[#E4E7EE] bg-white py-2.5 text-[13px] font-medium cursor-pointer">🚗 Auto angeben</button>
                    </div>
                  ) : null}
                </>
              )}

              {screen === 'loading' && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#404042]">
                  <Loader2 className="animate-spin text-primary-100" size={32} />
                  <p className="text-[14px]">Ich vergleiche Preise, EU-Label und Marken …</p>
                </div>
              )}

              {screen === 'results' && result && (
                <>
                  <p className="text-[14.5px] text-[#16171A]">{result.message}</p>
                  {result.picks.map(p => <PickCard key={p.slot} p={p} />)}
                  {result.criteria?.width ? (
                    <Link
                      href={`/produkte?width=${result.criteria.width}&height=${result.criteria.height}&diameter=${result.criteria.diameter}${result.criteria.season ? `&kategorie=${{ sommer: 'Sommerreifen', winter: 'Winterreifen', ganzjahr: 'Ganzjahresreifen' }[result.criteria.season]}` : ''}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-[10px] border border-[#E4E7EE] bg-white py-2.5 text-center text-[13.5px] font-medium text-primary-100"
                    >
                      Alle {result.total || ''} passenden Reifen ansehen
                    </Link>
                  ) : null}
                  <button type="button" onClick={() => { setResult(null); setText(''); history.current = []; setScreen('start'); }} className="flex w-full items-center justify-center gap-2 py-2 text-[13px] text-[#5A5B61] cursor-pointer">
                    <RotateCcw size={14} /> Neu starten
                  </button>
                </>
              )}

              {screen === 'product' && check && (
                <>
                  <div className="rounded-[14px] bg-white p-3 border border-[#E4E7EE]">
                    <p className="text-[15px] font-semibold text-[#16171A]">{check.verdict}</p>
                    <p className="mt-1 text-[13px] text-[#5A5B61]">
                      Verglichen mit {check.sameSizeCount} Reifen in {check.product.size}
                      {check.product.season ? ` (${check.product.season})` : ''}. {check.timing}
                    </p>
                  </div>
                  <PickCard p={check.product} />
                  {check.alternatives.length ? <p className="pt-1 text-[14px] font-semibold text-[#16171A]">Alternativen</p> : null}
                  {check.alternatives.map(p => <PickCard key={p.slot} p={p} />)}
                  <button type="button" onClick={() => { setCrit(c => ({ ...c, width: check.product.size.split('/')[0], height: check.product.size.split('/')[1]?.split(' ')[0], diameter: check.product.size.split('R')[1] })); go('season'); }} className="w-full rounded-[10px] border border-[#E4E7EE] bg-white py-2.5 text-[13.5px] font-medium text-primary-100 cursor-pointer">
                    Die 3 besten in {check.product.size} zeigen
                  </button>
                </>
              )}
            </div>
            <p className="border-t border-[#E9ECF3] bg-white px-4 py-2 text-[11px] leading-[140%] text-[#8A8D95]">
              Empfehlungen aus unserem Preisvergleich; Preise können sich ändern. Anfragen werden von einer KI ausgewertet und nicht gespeichert.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
