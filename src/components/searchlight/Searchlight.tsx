'use client';

/**
 * Searchlight – the AI tyre assistant (chat-style).
 * Floating, pulsing button on every page ("Lohnt sich dieser Reifen?" on product
 * pages), a help bubble when a visitor is clearly searching hard, and a chat panel
 * with four ways in: quick check, tyre photo, car model, free text → three real,
 * priced picks from our catalogue (backend /api/searchlight).
 */
import Link from 'next/link';
import FingerHand from '@/components/elements/FingerHand';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  BadgeEuro,
  Building2,
  Camera,
  Car,
  CheckCircle2,
  CloudSun,
  Crown,
  ListChecks,
  Loader2,
  ParkingCircle,
  RotateCcw,
  Route,
  SendHorizonal,
  ShieldCheck,
  Shuffle,
  Snowflake,
  CircleDot,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  Volume1,
  X,
} from 'lucide-react';
import OptimizedImage from '@/components/elements/OptimizedImage';
import { productImageSrc } from '@/libs/productImage';
import { buildVendorExitUrl, onVendorExitClick } from '@/libs/analytics/vendorExit';
import VendorExitLink from '@/components/elements/VendorExitLink';
import { CAR_MODELS, POPULAR_MAKES, ALL_MAKES, YEARS } from './carModels';
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

type Step = 'start' | 'size' | 'season' | 'drive' | 'priority' | 'photo' | 'car' | 'loading' | 'results' | 'product' | 'needSize';
type Msg = { role: 'bot' | 'user'; text: string };

const WIDTHS = [135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325];
const HEIGHTS = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
const RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const POPULAR_SIZES: [string, string, string][] = [
  ['205', '55', '16'],
  ['225', '45', '17'],
  ['195', '65', '15'],
  ['225', '40', '18'],
  ['215', '55', '17'],
];
const SEASON_LABEL = { winter: 'Winterreifen', sommer: 'Sommerreifen', ganzjahr: 'Ganzjahresreifen' } as const;
const PRIORITY_LABEL = { cheap: 'Möglichst günstig', balanced: 'Preis-Leistung', safety: 'Maximale Sicherheit', quiet: 'Leise & sparsam' } as const;
const STEPS: Step[] = ['size', 'season', 'drive', 'priority'];
const STEP_NAMES = ['Größe', 'Saison', 'Fahrweise', 'Wichtig'];

const SLOT: Record<string, { label: string; ribbon: string; icon: React.ReactNode }> = {
  best_price: { label: 'Bester Preis', ribbon: 'from-[#0EA571] to-[#12B886]', icon: <BadgeEuro size={14} /> },
  best_choice: { label: 'Unsere Empfehlung', ribbon: 'from-[#4F46E5] to-[#3A64F6]', icon: <Crown size={14} /> },
  premium: { label: 'Premium', ribbon: 'from-[#D97706] to-[#F59E0B]', icon: <Award size={14} /> },
  cheaper: { label: 'Günstigere Alternative', ribbon: 'from-[#0EA571] to-[#12B886]', icon: <BadgeEuro size={14} /> },
  better: { label: 'Besser für wenig mehr', ribbon: 'from-[#4F46E5] to-[#3A64F6]', icon: <ShieldCheck size={14} /> },
  current: { label: 'Dieser Reifen', ribbon: 'from-[#475569] to-[#64748B]', icon: <CheckCircle2 size={14} /> },
};
const eur = (n: number) => `${n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const DISMISS_KEY = 'sl_dismiss_until';
const LOADING_LINES = ['Ich vergleiche Preise aller Shops …', 'Ich prüfe EU-Label und Nasshaftung …', 'Ich wähle die drei besten für dich aus …'];

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

/* ------------------------------------------------------------ small parts */

function BotAvatar({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5B3DF5] to-[#3A64F6] shadow-[0_4px_12px_rgba(79,70,229,0.35)]"
      style={{ width: size, height: size }}
    >
      <Sparkles size={size * 0.5} color="#fff" />
    </span>
  );
}

function Bubble({ m }: { m: Msg }) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="sl-white max-w-[80%] rounded-[18px] rounded-tr-[6px] bg-gradient-to-br from-[#4F46E5] to-[#3A64F6] px-3.5 py-2 text-[14px] leading-[145%] shadow-sm">
          {m.text}
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <BotAvatar />
      <p className="max-w-[85%] rounded-[18px] rounded-tl-[6px] bg-white px-3.5 py-2.5 text-[14px] leading-[150%] text-[#1E2230] shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-[#E8EBF3]">
        {m.text}
      </p>
    </div>
  );
}

function Typing({ line }: { line: string }) {
  return (
    <div className="flex items-start gap-2">
      <BotAvatar />
      <div className="rounded-[18px] rounded-tl-[6px] bg-white px-3.5 py-3 ring-1 ring-[#E8EBF3]">
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2].map(i => (
            <span key={i} className="h-2 w-2 rounded-full bg-[#7C83F5] motion-safe:animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
        <p className="mt-1.5 text-[12.5px] text-[#5A6072]">{line}</p>
      </div>
    </div>
  );
}

function Tile({ icon, tone, title, sub, onClick }: { icon: React.ReactNode; tone: string; title: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-start gap-2 rounded-[16px] bg-white p-3.5 text-left ring-1 ring-[#E8EBF3] shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-all hover:-translate-y-0.5 hover:ring-[#A5B4FC] hover:shadow-[0_8px_24px_rgba(79,70,229,0.12)] cursor-pointer"
    >
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] ${tone}`}>{icon}</span>
      <span className="text-[14.5px] font-semibold leading-tight text-[#16171A]">{title}</span>
      <span className="text-[12.5px] leading-[140%] text-[#5A6072]">{sub}</span>
    </button>
  );
}

function Chip({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[13px] font-medium ring-1 transition-colors cursor-pointer ${
        active ? 'sl-white bg-gradient-to-r from-[#4F46E5] to-[#3A64F6] ring-transparent' : 'bg-white text-[#2B3040] ring-[#DDE1EC] hover:ring-[#818CF8] hover:text-[#4F46E5]'
      }`}
    >
      {children}
    </button>
  );
}

function OptionCard({ icon, tone, title, sub, onClick }: { icon: React.ReactNode; tone: string; title: string; sub?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] bg-white p-3 text-left ring-1 ring-[#E8EBF3] transition-all hover:ring-[#A5B4FC] hover:shadow-[0_6px_18px_rgba(79,70,229,0.10)] cursor-pointer"
    >
      <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] ${tone}`}>{icon}</span>
      <span className="flex-1">
        <span className="block text-[14.5px] font-semibold text-[#16171A]">{title}</span>
        {sub ? <span className="block text-[12.5px] text-[#5A6072]">{sub}</span> : null}
      </span>
      <ArrowRight size={16} color="#A0A6B8" />
    </button>
  );
}

const GRADE_COLOR = ['#16A34A', '#65A30D', '#CA8A04', '#EA580C', '#DC2626'];
function LabelBar({ name, letter }: { name: string; letter: string }) {
  const i = 'ABCDE'.indexOf(letter);
  if (i < 0) return null;
  return (
    <div className="flex items-center gap-2 text-[11.5px] text-[#5A6072]">
      <span className="w-[86px] shrink-0">{name}</span>
      <span className="flex flex-1 gap-0.5">
        {[0, 1, 2, 3, 4].map(k => (
          <span key={k} className="h-1.5 flex-1 rounded-full" style={{ background: k >= i ? GRADE_COLOR[i] : '#E5E7EB', opacity: k >= i ? 1 : 1 }} />
        ))}
      </span>
      <span className="w-4 text-right font-bold" style={{ color: GRADE_COLOR[i] }}>
        {letter}
      </span>
    </div>
  );
}

function PickCard({ p, rank }: { p: Pick; rank?: number }) {
  const img = productImageSrc(p.image);
  const slot = SLOT[p.slot] || SLOT.current;
  const href = p.token
    ? buildVendorExitUrl({ token: p.token, productId: p.id, from: 'searchlight', vendor: p.vendor, vendorId: p.vendorId, brand: p.brand, instruction: 'Zum Angebot' })
    : `/produkte/${p.slug}`;
  const featured = p.slot === 'best_choice';
  return (
    <div
      className={`overflow-hidden rounded-[18px] bg-white ${
        featured ? 'ring-2 ring-[#6366F1] shadow-[0_12px_32px_rgba(79,70,229,0.18)]' : 'ring-1 ring-[#E8EBF3] shadow-[0_2px_8px_rgba(16,24,40,0.05)]'
      }`}
    >
      <div className={`sl-white flex items-center justify-between bg-gradient-to-r ${slot.ribbon} px-3.5 py-1.5 text-[12.5px] font-semibold`}>
        <span className="inline-flex items-center gap-1.5">
          {slot.icon} {slot.label}
        </span>
        {rank ? <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px]">#{rank}</span> : null}
      </div>
      <div className="p-3.5">
        <div className="flex gap-3">
          <Link href={`/produkte/${p.slug}`} className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#F4F6FB] to-[#E9EDF7]">
            <OptimizedImage src={img.src} fallbacks={img.fallbacks} alt={p.name} width={80} height={80} className="h-20 w-20 object-contain" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#6B7280]">{p.brand}</p>
            <Link href={`/produkte/${p.slug}`} className="line-clamp-2 text-[14.5px] font-semibold leading-snug text-[#16171A] hover:text-[#4F46E5]">
              {p.name.replace(new RegExp(`^${p.brand}\\s+`, 'i'), '')}
            </Link>
            <p className="mt-0.5 text-[12px] text-[#5A6072]">
              {p.size} {p.index}
              {p.season ? ` · ${p.season}` : ''}
            </p>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <LabelBar name="Nasshaftung" letter={p.wet} />
          <LabelBar name="Rollwiderstand" letter={p.fuel} />
          {p.noiseDb ? (
            <div className="flex items-center gap-2 text-[11.5px] text-[#5A6072]">
              <span className="w-[86px] shrink-0">Rollgeräusch</span>
              <Volume1 size={14} color="#64748B" />
              <span className="font-semibold text-[#2B3040]">{p.noiseDb} dB</span>
            </div>
          ) : null}
        </div>
        {p.reason ? (
          <div className="mt-3 flex gap-2 rounded-[12px] bg-[#F1F3FF] px-3 py-2 text-[13px] leading-[145%] text-[#2B2F55]">
            <Sparkles size={14} color="#6366F1" className="mt-0.5 shrink-0"  />
            <span>{p.reason}</span>
          </div>
        ) : null}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[22px] font-bold leading-none text-[#16171A]">
              {eur(p.price)}
              <span className="ml-1 text-[12px] font-medium text-[#6B7280]">/ Stück</span>
            </p>
            <p className="mt-1 text-[12px] text-[#5A6072]">4 Reifen: {eur(p.priceFor4)}</p>
          </div>
          {p.offerCount > 1 ? <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11.5px] font-semibold text-[#4F46E5]">{p.offerCount} Shops</span> : null}
        </div>
        {p.token ? (
          <VendorExitLink
            href={href}
            onExit={() =>
              onVendorExitClick({
                productId: p.id,
                productName: p.name,
                brandName: p.brand,
                vendor: p.vendor,
                vendorId: p.vendorId,
                source: 'searchlight',
                instruction: 'Zum Angebot',
                vendorPrice: p.price,
              })
            }
            hand
            className="sl-white mt-3 flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-gradient-to-r from-[#4F46E5] to-[#3A64F6] py-3 pr-10 text-[14.5px] font-semibold shadow-[0_8px_20px_rgba(58,100,246,0.30)] transition-transform hover:-translate-y-0.5"
          >
            Zum Angebot{p.vendor ? ` bei ${p.vendor}` : ''} <ArrowRight size={16} />
          </VendorExitLink>
        ) : (
          <Link
            href={href}
            className="vendor-exit-cue offer-pulse sl-white relative mt-3 flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-gradient-to-r from-[#4F46E5] to-[#3A64F6] py-3 pr-10 text-[14.5px] font-semibold shadow-[0_8px_20px_rgba(58,100,246,0.30)] transition-transform hover:-translate-y-0.5"
          >
            <span className="offer-ping" aria-hidden />
            Zum Angebot{p.vendor ? ` bei ${p.vendor}` : ''} <ArrowRight size={16} />
            <FingerHand className="offer-hand" />
          </Link>
        )}
        <Link href={`/produkte/${p.slug}`} className="mt-2 block text-center text-[12.5px] font-medium text-[#4F46E5] hover:underline">
          Details{p.offerCount > 1 ? ` & alle ${p.offerCount} Angebote` : ''}
        </Link>
      </div>
    </div>
  );
}

function SizeVisual({ w, h, d }: { w?: string; h?: string; d?: string }) {
  return (
    <div className="sl-white relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#1D4ED8] p-4">
      <span className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border-[14px] border-white/10" aria-hidden />
      <span className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 rounded-full border-[8px] border-white/10" aria-hidden />
      <p className="text-[11px] uppercase tracking-[0.12em] opacity-80">So steht es auf deinem Reifen</p>
      <div className="mt-2 flex items-end gap-1 font-bold tracking-tight">
        <span className="flex flex-col items-center">
          <span className="text-[30px] leading-none">{w}</span>
          <span className="mt-1 text-[10.5px] font-medium opacity-80">Breite</span>
        </span>
        <span className="pb-4 text-[26px] leading-none opacity-70">/</span>
        <span className="flex flex-col items-center">
          <span className="text-[30px] leading-none">{h}</span>
          <span className="mt-1 text-[10.5px] font-medium opacity-80">Querschnitt</span>
        </span>
        <span className="flex flex-col items-center pl-2">
          <span className="text-[30px] leading-none">R{d}</span>
          <span className="mt-1 text-[10.5px] font-medium opacity-80">Zoll</span>
        </span>
      </div>
    </div>
  );
}

function SidewallGuide() {
  return (
    <svg viewBox="0 0 320 165" className="w-full" role="img" aria-label="Beispiel: Beschriftung auf der Reifenflanke">
      <defs>
        <linearGradient id="sl-tyre" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2A2D35" />
          <stop offset="1" stopColor="#14161B" />
        </linearGradient>
      </defs>
      <path d="M20 162 A140 140 0 0 1 300 162 L262 162 A102 102 0 0 0 58 162 Z" fill="url(#sl-tyre)" />
      <path id="sl-arc" d="M43 162 A117 117 0 0 1 277 162" fill="none" />
      <text fontSize="15" fontWeight="700" fill="#E5E7EB" letterSpacing="1">
        <textPath href="#sl-arc" startOffset="50%" textAnchor="middle">
          205/55 R16 91H
        </textPath>
      </text>
      <rect x="92" y="26" width="136" height="28" rx="8" fill="none" stroke="#818CF8" strokeWidth="2" strokeDasharray="5 4" />
    </svg>
  );
}

/* ------------------------------------------------------------ main */

export default function Searchlight() {
  const pathname = usePathname() || '/';
  const productSlug = /^\/produkte\/([^/?#]+)/.exec(pathname)?.[1] || '';
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('start');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [crit, setCrit] = useState<Criteria>({ width: '205', height: '55', diameter: '16', priority: 'balanced', budgetPer4: 0 });
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [check, setCheck] = useState<ProductCheck | null>(null);
  const [input, setInput] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [carRes, setCarRes] = useState<CarResult | null>(null);
  const [busy, setBusy] = useState('');
  const [loadLine, setLoadLine] = useState(0);
  const [bubble, setBubble] = useState('');
  const [used, setUsed] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const say = useCallback((...m: Msg[]) => setMsgs(prev => [...prev, ...m]), []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // results: show the summary + first card, not the bottom of the list
    if ((step === 'results' || step === 'product') && answerRef.current) {
      el.scrollTo({ top: Math.max(0, answerRef.current.offsetTop - 90), behavior: 'smooth' });
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [msgs, step, carRes, busy]);

  useEffect(() => {
    if (step !== 'loading') return;
    const t = setInterval(() => setLoadLine(l => (l + 1) % LOADING_LINES.length), 1400);
    return () => clearInterval(t);
  }, [step]);

  const runRecommend = useCallback(
    async (c: Criteria, text?: string) => {
      setStep('loading');
      setLoadLine(0);
      try {
        const r = await recommend({ ...c, ...(text ? { text } : {}) });
        setResult(r);
        if (r.criteria) setCrit(prev => ({ ...prev, ...r.criteria }));
        say({ role: 'bot', text: r.message });
        setStep(r.needs === 'size' ? 'needSize' : 'results');
      } catch {
        say({ role: 'bot', text: 'Da ist etwas schiefgelaufen. Bitte versuche es noch einmal.' });
        setStep('start');
      }
    },
    [say]
  );

  const runProductCheck = useCallback(
    async (slug: string) => {
      setStep('loading');
      try {
        const c = await productCheck(slug);
        setCheck(c);
        say({ role: 'bot', text: c.verdict });
        setStep('product');
      } catch {
        say({ role: 'bot', text: 'Diesen Reifen konnte ich gerade nicht prüfen. Starte gern einen Schnell-Check.' });
        setStep('start');
      }
    },
    [say]
  );

  const reset = useCallback(() => {
    setMsgs([
      {
        role: 'bot',
        text: productSlug
          ? 'Hallo! 👋 Ich bin Searchlight. Soll ich prüfen, ob sich dieser Reifen lohnt – oder suchen wir gemeinsam die besten für dich?'
          : 'Hallo! 👋 Ich bin Searchlight, dein KI-Reifenassistent. Ich finde in Sekunden die drei besten Reifen für dich. Wie möchtest du starten?',
      },
    ]);
    setResult(null);
    setCheck(null);
    setCarRes(null);
    setStep('start');
  }, [productSlug]);

  const openWith = useCallback(
    (d: OpenDetail = {}) => {
      setOpen(true);
      setUsed(true);
      setBubble('');
      safeSet('session', 'sl_bubble_shown', '1');
      reset();
      const mode = d.mode || 'start';
      if (mode === 'product' && (d.slug || productSlug)) {
        say({ role: 'user', text: 'Lohnt sich dieser Reifen?' });
        runProductCheck(d.slug || productSlug);
      } else if (mode === 'questions') {
        say({ role: 'user', text: 'Schnell-Check' }, { role: 'bot', text: 'Welche Reifengröße hast du? Sie steht auf der Reifenflanke.' });
        setStep('size');
      } else if (mode === 'photo' || mode === 'car') setStep(mode);
    },
    [productSlug, reset, runProductCheck, say]
  );

  useEffect(() => {
    const h = (e: Event) => openWith((e as CustomEvent<OpenDetail>).detail || {});
    window.addEventListener('searchlight:open', h);
    return () => window.removeEventListener('searchlight:open', h);
  }, [openWith]);

  // Help bubble – only when a visitor is clearly searching hard
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
      const t = setTimeout(() => show('Unsicher? Ich vergleiche diesen Reifen mit den Alternativen.'), 45000);
      return () => clearTimeout(t);
    }
  }, [pathname, productSlug, open, used]);

  // A tap anywhere outside the small hint closes it and still reaches the control under the finger.
  useEffect(() => {
    if (!bubble) return;
    const onPointerDown = (event: PointerEvent) => {
      const dock = dockRef.current;
      if (dock && event.target instanceof Node && dock.contains(event.target)) return;
      setBubble('');
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [bubble]);

  /* ------------ flow actions */
  const startQuick = () => {
    say({ role: 'user', text: 'Schnell-Check' }, { role: 'bot', text: 'Super! Welche Reifengröße hast du? Sie steht auf der Reifenflanke.' });
    setStep('size');
  };
  const chooseSize = (w: string, h: string, d: string) => {
    setCrit(c => ({ ...c, width: w, height: h, diameter: d }));
    say({ role: 'user', text: `${w}/${h} R${d}` }, { role: 'bot', text: 'Für welche Saison suchst du Reifen?' });
    setStep('season');
  };
  const chooseSeason = (s: 'winter' | 'sommer' | 'ganzjahr') => {
    setCrit(c => ({ ...c, season: s }));
    say({ role: 'user', text: SEASON_LABEL[s] }, { role: 'bot', text: 'Wie fährst du meistens?' });
    setStep('drive');
  };
  const chooseDrive = (label: string, priority?: Criteria['priority']) => {
    if (priority) setCrit(c => ({ ...c, priority }));
    say({ role: 'user', text: label }, { role: 'bot', text: 'Und was ist dir am wichtigsten?' });
    setStep('priority');
  };
  const choosePriority = (p: NonNullable<Criteria['priority']>) => {
    const c = { ...crit, priority: p };
    setCrit(c);
    say({ role: 'user', text: `${PRIORITY_LABEL[p]}${c.budgetPer4 ? ` · bis ${c.budgetPer4} € für 4` : ''}` });
    runRecommend(c);
  };
  const sendText = () => {
    const t = input.trim();
    if (!t) return;
    setInput('');
    say({ role: 'user', text: t });
    runRecommend(crit, t);
  };
  const onPhoto = async (file?: File | null) => {
    if (!file) return;
    say({ role: 'user', text: '📷 Foto vom Reifen' });
    setBusy('Ich lese die Reifenflanke …');
    setStep('photo');
    try {
      const r = await readPhoto(await shrinkImage(file));
      setBusy('');
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
        say({
          role: 'bot',
          text: `Erkannt: ${r.width}/${r.height} R${r.diameter} ${r.loadIndex || ''}${r.speedIndex || ''}${r.brand ? ` (${r.brand})` : ''}. Stimmt das? Du kannst die Größe unten noch anpassen.`,
        });
        setStep('size');
      } else {
        say({
          role: 'bot',
          text:
            r.error === 'ai_not_configured'
              ? 'Die Fotoerkennung ist gerade nicht verfügbar. Wähle deine Größe bitte von Hand.'
              : r.hint || 'Ich konnte die Größe nicht sicher lesen. Versuch ein schärferes Foto, auf dem z. B. „205/55 R16“ gut zu sehen ist.',
        });
      }
    } catch {
      setBusy('');
      say({ role: 'bot', text: 'Das Foto konnte ich nicht lesen. Bitte versuche es erneut.' });
    }
  };
  const findCar = async () => {
    if (!make || !model) return;
    say({ role: 'user', text: `${make} ${model}${year ? ` (${year})` : ''}` });
    setBusy('Ich suche die passenden Größen …');
    setCarRes(null);
    try {
      const r = await carSizes({ make, model, year });
      setBusy('');
      if (r.error || !r.sizes?.length) {
        say({ role: 'bot', text: 'Zu diesem Auto habe ich keine sicheren Größen gefunden. Lies die Größe bitte von der Reifenflanke ab – oder schick mir ein Foto.' });
        setStep('size');
      } else {
        setCarRes(r);
        say({ role: 'bot', text: `${r.generation ? `${r.generation}: ` : ''}Diese Größen sind typisch. Welche steht auf deinem Reifen?` });
      }
    } catch {
      setBusy('');
      say({ role: 'bot', text: 'Die Fahrzeugsuche hat gerade nicht geklappt.' });
    }
  };
  const pickCarSize = (s: CarSize) => {
    setCrit(c => ({ ...c, minLoadIndex: Number(s.loadIndex) || 0, minSpeed: s.speedIndex || '' }));
    setCarRes(null);
    chooseSize(s.width, s.height, s.diameter);
  };

  const stepIndex = STEPS.indexOf(step);
  const floatingLabel = productSlug
    ? 'Lohnt sich dieser Reifen?'
    : pathname.startsWith('/produkte') || /^\/(reifen|marken|winterreifen|sommerreifen|ganzjahresreifen)/.test(pathname)
      ? 'Hilf mir wählen'
      : 'Searchlight';
  const sel = 'w-full appearance-none rounded-[12px] bg-white px-3 py-2.5 text-[15px] font-semibold text-[#16171A] ring-1 ring-[#DDE1EC] focus:outline-none focus:ring-2 focus:ring-[#818CF8]';

  return (
    <>
      {/* Floating, pulsing button + help bubble */}
      {!open && (
        <div
          ref={dockRef}
          className="fixed right-3 z-[65] flex w-max max-w-[calc(100vw-4.5rem)] flex-col items-end gap-1 print:hidden pointer-events-none"
          style={{ bottom: 'calc(0.5rem + var(--pdp-sticky-h, 0px) + var(--compare-tray-h, 0px))' }}
        >
          {bubble ? (
            <div className="pointer-events-auto relative w-[min(188px,calc(100vw-5rem))] rounded-xl bg-white px-2 py-1.5 text-[11px] leading-snug text-[#16171A] shadow-[0_8px_20px_rgba(16,24,40,0.16)] ring-1 ring-[#E8EBF3]">
              <div className="flex items-start gap-1.5">
                <BotAvatar size={16} />
                <p className="line-clamp-3">{bubble}</p>
              </div>
              <div className="mt-1 flex gap-1 pl-5">
                <button type="button" onClick={() => openWith({ mode: productSlug ? 'product' : 'start' })} className="sl-white rounded-full bg-gradient-to-r from-[#4F46E5] to-[#3A64F6] px-2 py-0.5 text-[11px] font-semibold leading-5 cursor-pointer">
                  Ja, hilf mir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBubble('');
                    safeSet('local', DISMISS_KEY, String(Date.now() + 7 * 864e5));
                  }}
                  className="rounded-full px-2 py-0.5 text-[11px] leading-5 text-[#5A6072] hover:bg-[#F2F3F5] cursor-pointer"
                >
                  Nein danke
                </button>
              </div>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => openWith({ mode: productSlug ? 'product' : 'start' })}
            aria-label={`Searchlight: ${floatingLabel}`}
            className="pointer-events-auto group relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#5B3DF5] via-[#4F46E5] to-[#3A64F6] text-[13px] font-semibold shadow-[0_8px_18px_rgba(79,70,229,0.4)] transition-transform hover:-translate-y-0.5 cursor-pointer sm:h-10 sm:w-auto sm:gap-1.5 sm:px-2.5"
          >
            {!used ? <span className="absolute inset-0 rounded-full bg-[#6366F1] opacity-50 motion-safe:animate-ping" aria-hidden /> : null}
            <span className="sl-white relative inline-flex items-center gap-1.5">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <CircleDot size={14} aria-hidden />
              </span>
              <span className="hidden sm:inline">{floatingLabel}</span>
            </span>
          </button>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 z-[100000] print:hidden" role="dialog" aria-modal="true" aria-label="Searchlight Reifen-Assistent">
          <button type="button" aria-label="Schließen" className="absolute inset-0 bg-[#0B1020]/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 right-0 flex h-[94vh] w-full flex-col overflow-hidden rounded-t-[24px] bg-[#F5F7FC] shadow-2xl md:top-0 md:h-full md:w-[460px] md:rounded-none md:rounded-l-[24px]">
            {/* Header */}
            <div className="sl-white relative overflow-hidden bg-gradient-to-br from-[#3B2BD9] via-[#4F46E5] to-[#3A64F6] px-4 pb-3 pt-4">
              <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden />
              <div className="relative flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/15 ring-1 ring-white/25">
                  <Sparkles size={22} />
                </span>
                <div className="flex-1">
                  <p className="text-[17px] font-bold leading-tight">Searchlight</p>
                  <p className="flex items-center gap-1.5 text-[12.5px] opacity-90">
                    <span className="h-2 w-2 rounded-full bg-[#4ADE80]" /> KI-Reifenassistent · online
                  </p>
                </div>
                <button type="button" onClick={reset} aria-label="Neu starten" className="rounded-full p-2 hover:bg-white/15 cursor-pointer">
                  <RotateCcw size={18} />
                </button>
                <button type="button" onClick={() => setOpen(false)} aria-label="Schließen" className="rounded-full p-2 hover:bg-white/15 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              {stepIndex >= 0 ? (
                <div className="relative mt-3 grid grid-cols-4 gap-1.5">
                  {STEP_NAMES.map((n, i) => (
                    <div key={n}>
                      <span className={`block h-1.5 rounded-full ${i <= stepIndex ? 'bg-white' : 'bg-white/25'}`} />
                      <span className={`mt-1 block text-[10.5px] ${i <= stepIndex ? 'opacity-100' : 'opacity-60'}`}>{n}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Conversation */}
            <div ref={scroller} className="relative flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
              {busy ? <Typing line={busy} /> : null}
              {step === 'loading' ? <Typing line={LOADING_LINES[loadLine]} /> : null}

              {step === 'start' && (
                <div className="space-y-3 pl-9">
                  <div className="grid grid-cols-2 gap-2.5">
                    <Tile icon={<ListChecks size={20} color="#4F46E5" />} tone="bg-[#EEF2FF]" title="Schnell-Check" sub="4 Fragen, ohne Tippen" onClick={startQuick} />
                    <Tile icon={<Camera size={20} color="#059669" />} tone="bg-[#ECFDF5]" title="Foto vom Reifen" sub="Ich lese die Größe ab" onClick={() => { say({ role: 'user', text: 'Foto vom Reifen' }, { role: 'bot', text: 'Fotografiere die Beschriftung auf der Seite deines Reifens. Das Foto wird nur gelesen, nicht gespeichert.' }); setStep('photo'); }} />
                    <Tile icon={<Car size={20} color="#D97706" />} tone="bg-[#FFFBEB]" title="Mein Auto" sub="Größe über das Modell" onClick={() => { say({ role: 'user', text: 'Mein Auto angeben' }, { role: 'bot', text: 'Welches Auto fährst du?' }); setStep('car'); }} />
                    {productSlug ? (
                      <Tile icon={<ShieldCheck size={20} color="#E11D48" />} tone="bg-[#FFF1F2]" title="Diesen Reifen prüfen" sub="Preis & Alternativen" onClick={() => { say({ role: 'user', text: 'Lohnt sich dieser Reifen?' }); runProductCheck(productSlug); }} />
                    ) : (
                      <Tile icon={<BadgeEuro size={20} color="#E11D48" />} tone="bg-[#FFF1F2]" title="Nur günstig" sub="Billigste solide Reifen" onClick={() => { setCrit(c => ({ ...c, priority: 'cheap' })); startQuick(); }} />
                    )}
                  </div>
                  <div>
                    <p className="mb-1.5 text-[12px] font-medium text-[#5A6072]">Beliebte Größen</p>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SIZES.map(([w, h, d]) => (
                        <Chip key={w + h + d} onClick={() => chooseSize(w, h, d)}>
                          {w}/{h} R{d}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(step === 'size' || step === 'needSize') && (
                <div className="space-y-3 pl-9">
                  <SizeVisual w={crit.width} h={crit.height} d={crit.diameter} />
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        ['Breite', 'width', WIDTHS],
                        ['Querschnitt', 'height', HEIGHTS],
                        ['Zoll', 'diameter', RIMS],
                      ] as const
                    ).map(([label, key, list]) => (
                      <label key={key} className="text-[11.5px] font-medium text-[#5A6072]">
                        {label}
                        <select className={`${sel} mt-1`} value={crit[key]} onChange={e => setCrit({ ...crit, [key]: e.target.value })}>
                          {list.map(v => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => chooseSize(String(crit.width), String(crit.height), String(crit.diameter))}
                    className="sl-white flex w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#4F46E5] to-[#3A64F6] py-3 text-[15px] font-semibold shadow-[0_8px_20px_rgba(58,100,246,0.30)] cursor-pointer"
                  >
                    Weiter mit {crit.width}/{crit.height} R{crit.diameter} <ArrowRight size={16} />
                  </button>
                  <div className="flex flex-wrap gap-1.5">
                    <Chip onClick={() => setStep('photo')}>📷 Größe per Foto</Chip>
                    <Chip onClick={() => setStep('car')}>🚗 Über mein Auto</Chip>
                  </div>
                </div>
              )}

              {step === 'season' && (
                <div className="space-y-2 pl-9">
                  <OptionCard icon={<Snowflake size={22} color="#2563EB" />} tone="bg-[#EFF6FF]" title="Winterreifen" sub="Pflicht bei Schnee, Eis und Glätte" onClick={() => chooseSeason('winter')} />
                  <OptionCard icon={<Sun size={22} color="#D97706" />} tone="bg-[#FFFBEB]" title="Sommerreifen" sub="Kürzere Bremswege bei Wärme" onClick={() => chooseSeason('sommer')} />
                  <OptionCard icon={<CloudSun size={22} color="#059669" />} tone="bg-[#ECFDF5]" title="Ganzjahresreifen" sub="Ein Satz fürs ganze Jahr" onClick={() => chooseSeason('ganzjahr')} />
                </div>
              )}

              {step === 'drive' && (
                <div className="grid grid-cols-2 gap-2.5 pl-9">
                  <Tile icon={<Building2 size={20} color="#4F46E5" />} tone="bg-[#EEF2FF]" title="Viel Stadt" sub="Kurze Strecken" onClick={() => chooseDrive('Viel Stadt')} />
                  <Tile icon={<Route size={20} color="#2563EB" />} tone="bg-[#EFF6FF]" title="Viel Autobahn" sub="Lange Strecken, schnell" onClick={() => chooseDrive('Viel Autobahn', 'safety')} />
                  <Tile icon={<Shuffle size={20} color="#059669" />} tone="bg-[#ECFDF5]" title="Gemischt" sub="Von allem etwas" onClick={() => chooseDrive('Gemischt')} />
                  <Tile icon={<ParkingCircle size={20} color="#D97706" />} tone="bg-[#FFFBEB]" title="Wenig" sub="Unter 8.000 km im Jahr" onClick={() => chooseDrive('Wenig', 'cheap')} />
                </div>
              )}

              {step === 'priority' && (
                <div className="space-y-3 pl-9">
                  <div className="grid grid-cols-2 gap-2.5">
                    <Tile icon={<BadgeEuro size={20} color="#059669" />} tone="bg-[#ECFDF5]" title="Möglichst günstig" sub="Solide, kleiner Preis" onClick={() => choosePriority('cheap')} />
                    <Tile icon={<Crown size={20} color="#4F46E5" />} tone="bg-[#EEF2FF]" title="Preis-Leistung" sub="Die beste Balance" onClick={() => choosePriority('balanced')} />
                    <Tile icon={<ShieldCheck size={20} color="#E11D48" />} tone="bg-[#FFF1F2]" title="Sicherheit" sub="Kurzer Bremsweg nass" onClick={() => choosePriority('safety')} />
                    <Tile icon={<Volume1 size={20} color="#0891B2" />} tone="bg-[#ECFEFF]" title="Leise & sparsam" sub="Weniger Lärm, Verbrauch" onClick={() => choosePriority('quiet')} />
                  </div>
                  <div className="rounded-[14px] bg-white p-3 ring-1 ring-[#E8EBF3]">
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="font-medium text-[#2B3040]">Budget für 4 Reifen</span>
                      <span className="font-bold text-[#4F46E5]">{crit.budgetPer4 ? `bis ${crit.budgetPer4} €` : 'egal'}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1200}
                      step={20}
                      value={crit.budgetPer4 || 0}
                      onChange={e => setCrit({ ...crit, budgetPer4: Number(e.target.value) })}
                      className="mt-2 w-full accent-[#4F46E5]"
                      aria-label="Budget für 4 Reifen"
                    />
                  </div>
                </div>
              )}

              {step === 'photo' && !busy && (
                <div className="space-y-3 pl-9">
                  <div className="rounded-[16px] bg-white p-3 ring-1 ring-[#E8EBF3]">
                    <SidewallGuide />
                    <ul className="mt-2 space-y-1 text-[12.5px] text-[#2B3040]">
                      {['Gut beleuchtet, ohne Blitz-Spiegelung', 'Beschriftung scharf und ganz im Bild', 'Ganz nah an die Größe heran'].map(t => (
                        <li key={t} className="flex items-center gap-1.5">
                          <CheckCircle2 size={14} color="#16A34A" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="sl-white flex w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#059669] to-[#10B981] py-3 text-[15px] font-semibold shadow-[0_8px_20px_rgba(5,150,105,0.30)] cursor-pointer"
                  >
                    <Camera size={18} /> Foto aufnehmen oder wählen
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => onPhoto(e.target.files?.[0])} />
                </div>
              )}

              {step === 'car' && !busy && (
                <div className="space-y-3 pl-9">
                  {!carRes ? (
                    <>
                      <div>
                        <p className="mb-1.5 text-[12px] font-medium text-[#5A6072]">Marke</p>
                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_MAKES.map(m => (
                            <Chip key={m} active={make === m} onClick={() => { setMake(m); setModel(''); }}>
                              {m}
                            </Chip>
                          ))}
                          <select
                            className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium ring-1 ring-[#DDE1EC]"
                            value={POPULAR_MAKES.includes(make) ? '' : make}
                            onChange={e => { setMake(e.target.value); setModel(''); }}
                            aria-label="Andere Marke"
                          >
                            <option value="">Andere …</option>
                            {ALL_MAKES.filter(m => !POPULAR_MAKES.includes(m)).map(m => (
                              <option key={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {make ? (
                        <div>
                          <p className="mb-1.5 text-[12px] font-medium text-[#5A6072]">Modell</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(CAR_MODELS[make] || []).map(m => (
                              <Chip key={m} active={model === m} onClick={() => setModel(m)}>
                                {m}
                              </Chip>
                            ))}
                          </div>
                          <input
                            className="mt-2 w-full rounded-[12px] bg-white px-3 py-2 text-[14px] ring-1 ring-[#DDE1EC]"
                            placeholder="Anderes Modell, z. B. Golf 7 Variant"
                            value={CAR_MODELS[make]?.includes(model) ? '' : model}
                            onChange={e => setModel(e.target.value)}
                          />
                        </div>
                      ) : null}
                      {make && model ? (
                        <div className="flex gap-2">
                          <select className={sel} value={year} onChange={e => setYear(e.target.value)} aria-label="Baujahr">
                            <option value="">Baujahr (optional)</option>
                            {YEARS.map(y => (
                              <option key={y}>{y}</option>
                            ))}
                          </select>
                          <button type="button" onClick={findCar} className="sl-white shrink-0 rounded-[12px] bg-gradient-to-r from-[#D97706] to-[#F59E0B] px-4 text-[14.5px] font-semibold cursor-pointer">
                            Größen finden
                          </button>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        {carRes.sizes?.map(s => (
                          <button
                            key={`${s.width}${s.height}${s.diameter}`}
                            type="button"
                            onClick={() => pickCarSize(s)}
                            className="rounded-[14px] bg-white p-3 text-left ring-1 ring-[#E8EBF3] hover:ring-[#A5B4FC] cursor-pointer"
                          >
                            <span className="block text-[17px] font-bold text-[#16171A]">
                              {s.width}/{s.height} R{s.diameter}
                            </span>
                            <span className="text-[12px] text-[#5A6072]">
                              {s.loadIndex}
                              {s.speedIndex} {s.original ? '· Werksgröße' : ''}
                            </span>
                          </button>
                        ))}
                      </div>
                      {carRes.note ? <p className="text-[12px] leading-[145%] text-[#5A6072]">ⓘ {carRes.note}</p> : null}
                    </>
                  )}
                </div>
              )}

              {step === 'needSize' && (
                <div className="flex flex-wrap gap-1.5 pl-9">
                  <Chip onClick={() => setStep('photo')}>📷 Foto vom Reifen</Chip>
                  <Chip onClick={() => setStep('car')}>🚗 Auto angeben</Chip>
                </div>
              )}

              {step === 'results' && result && (
                <div ref={answerRef} className="space-y-3 pl-9">
                  <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
                    {result.criteria?.width ? (
                      <span className="rounded-full bg-white px-2.5 py-1 font-semibold ring-1 ring-[#E8EBF3]">
                        {result.criteria.width}/{result.criteria.height} R{result.criteria.diameter}
                      </span>
                    ) : null}
                    {result.criteria?.season ? <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-[#E8EBF3]">{SEASON_LABEL[result.criteria.season]}</span> : null}
                    {result.criteria?.priority ? <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-[#E8EBF3]">{PRIORITY_LABEL[result.criteria.priority]}</span> : null}
                    <button type="button" onClick={startQuick} className="px-1 font-semibold text-[#4F46E5] hover:underline cursor-pointer">
                      ändern
                    </button>
                  </div>
                  {result.picks.map((p, i) => (
                    <PickCard key={p.slot} p={p} rank={i + 1} />
                  ))}
                  {result.criteria?.width ? (
                    <Link
                      href={`/produkte?width=${result.criteria.width}&height=${result.criteria.height}&diameter=${result.criteria.diameter}${
                        result.criteria.season ? `&kategorie=${SEASON_LABEL[result.criteria.season]}` : ''
                      }`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-[12px] bg-white py-3 text-[13.5px] font-semibold text-[#4F46E5] ring-1 ring-[#E8EBF3]"
                    >
                      Alle {result.total || ''} passenden Reifen ansehen <ArrowRight size={14} />
                    </Link>
                  ) : null}
                </div>
              )}

              {step === 'product' && check && (
                <div ref={answerRef} className="space-y-3 pl-9">
                  <div className="rounded-[16px] bg-white p-3.5 ring-1 ring-[#E8EBF3]">
                    <p className="text-[12px] font-medium text-[#5A6072]">Preis im Vergleich zu {check.sameSizeCount} Reifen in {check.product.size}</p>
                    <div className="relative mt-3 h-2.5 rounded-full bg-gradient-to-r from-[#16A34A] via-[#EAB308] to-[#DC2626]">
                      <span
                        className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-white bg-[#16171A] shadow"
                        style={{ left: `${Math.min(97, Math.max(3, check.pricePosition))}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[11px] text-[#6B7280]">
                      <span>günstig</span>
                      <span>teuer</span>
                    </div>
                    {check.trendPct != null ? (
                      <p className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${check.trendPct <= 0 ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FEF2F2] text-[#B91C1C]'}`}>
                        {check.trendPct <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />} {check.trendPct > 0 ? '+' : ''}
                        {check.trendPct} % in 30 Tagen
                      </p>
                    ) : null}
                    {check.timing ? <p className="mt-2 text-[13px] text-[#2B3040]">{check.timing}</p> : null}
                  </div>
                  <PickCard p={check.product} />
                  {check.alternatives.length ? <p className="pt-1 text-[14px] font-semibold text-[#16171A]">Alternativen in derselben Größe</p> : null}
                  {check.alternatives.map(p => (
                    <PickCard key={p.slot} p={p} />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const m = /(\d{3})\/(\d{2})\s*R(\d{2})/.exec(check.product.size);
                      if (m) chooseSize(m[1], m[2], m[3]);
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-[12px] bg-white py-3 text-[13.5px] font-semibold text-[#4F46E5] ring-1 ring-[#E8EBF3] cursor-pointer"
                  >
                    Die 3 besten in {check.product.size} zeigen <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-[#E6E9F2] bg-white px-3 pb-2 pt-2.5">
              <div className="flex items-end gap-2 rounded-[16px] bg-[#F5F7FC] p-1.5 ring-1 ring-[#E1E5EF] focus-within:ring-2 focus-within:ring-[#818CF8]">
                <button type="button" onClick={() => { setStep('photo'); }} aria-label="Foto vom Reifen" className="rounded-[12px] p-2 text-[#5A6072] hover:bg-white cursor-pointer">
                  <Camera size={20} />
                </button>
                <textarea
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendText();
                    }
                  }}
                  placeholder="z. B. „Winterreifen für Golf 7, bis 400 €“"
                  className="max-h-28 flex-1 resize-none truncate !border-0 bg-transparent !shadow-none !outline-none px-1 py-2 text-[14.5px] text-[#16171A] placeholder:text-[#8A90A2] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={sendText}
                  disabled={!input.trim() || step === 'loading'}
                  aria-label="Senden"
                  className="sl-white rounded-[12px] bg-gradient-to-r from-[#4F46E5] to-[#3A64F6] p-2.5 disabled:opacity-40 cursor-pointer"
                >
                  {step === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <SendHorizonal size={18} />}
                </button>
              </div>
              <p className="mt-1.5 px-1 text-[10.5px] leading-[140%] text-[#8A90A2]">
                Empfehlungen aus unserem Preisvergleich mit Live-Preisen. Anfragen werden von einer KI ausgewertet und nicht gespeichert.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
