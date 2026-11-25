'use client';

/**
 * Searchlight – the tyre assistant.
 * One smart box ("Winterreifen Golf 7 bis 400 €") or three short steps
 * (Größe → Saison → Wichtig) → one clear recommendation plus two alternatives,
 * each with a match score, plus/minus points and the live best price.
 * One tap to refine (günstiger, sicherer, leiser, andere Saison) or to compare all three.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Award,
  BadgeEuro,
  Camera,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  CloudSun,
  Crown,
  GitCompareArrows,
  History,
  Loader2,
  Minus,
  Ruler,
  RotateCcw,
  SendHorizonal,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  TrendingDown,
  TrendingUp,
  Volume1,
  X,
} from 'lucide-react';
import OptimizedImage from '@/components/elements/OptimizedImage';
import PriceTrendChart from '@/components/elements/PriceTrendChart';
import VendorExitLink from '@/components/elements/VendorExitLink';
import { productImageSrc } from '@/libs/productImage';
import { buildVendorExitUrl, onVendorExitClick } from '@/libs/analytics/vendorExit';
import { addProduct, clearProducts, openModal } from '@/store/compareSlice';
import type { AppDispatch } from '@/store/store';
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

type Step = 'start' | 'size' | 'season' | 'priority' | 'photo' | 'car' | 'carSize' | 'loading' | 'results' | 'product' | 'needSize';
type Msg = { role: 'bot' | 'user'; text: string };
type Season = 'winter' | 'sommer' | 'ganzjahr';
type Priority = NonNullable<Criteria['priority']>;

const WIDTHS = [135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325];
const HEIGHTS = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
const RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const POPULAR_SIZES: [string, string, string][] = [
  ['205', '55', '16'],
  ['225', '45', '17'],
  ['195', '65', '15'],
  ['225', '40', '18'],
  ['215', '55', '17'],
  ['205', '60', '16'],
];
const EXAMPLES = ['Winterreifen 205/55 R16', 'VW Golf 7 Ganzjahresreifen', 'Leise Reifen für Tesla Model 3', '195/65 R15 günstig bis 300 €'];
const SEASON_LABEL: Record<Season, string> = { winter: 'Winterreifen', sommer: 'Sommerreifen', ganzjahr: 'Ganzjahresreifen' };
const PRIORITY_LABEL: Record<Priority, string> = { cheap: 'Möglichst günstig', balanced: 'Preis-Leistung', safety: 'Maximale Sicherheit', quiet: 'Leise & sparsam' };
const STEPS: Step[] = ['size', 'season', 'priority'];
const STEP_NAMES = ['Größe', 'Saison', 'Wichtig'];
const BUDGETS = [0, 300, 500, 800];

const SLOT: Record<string, { label: string; tone: string; color: string; icon: React.ReactNode }> = {
  best_choice: { label: 'Unsere Empfehlung', tone: 'from-[#1B2A6B] to-[#2F4FD8]', color: '#2F4FD8', icon: <Crown size={14} /> },
  best_price: { label: 'Bester Preis', tone: 'from-[#047857] to-[#10B981]', color: '#047857', icon: <BadgeEuro size={14} /> },
  premium: { label: 'Premium', tone: 'from-[#B45309] to-[#F59E0B]', color: '#B45309', icon: <Award size={14} /> },
  cheaper: { label: 'Günstigere Alternative', tone: 'from-[#047857] to-[#10B981]', color: '#047857', icon: <BadgeEuro size={14} /> },
  better: { label: 'Besser für wenig mehr', tone: 'from-[#1B2A6B] to-[#2F4FD8]', color: '#2F4FD8', icon: <ShieldCheck size={14} /> },
  current: { label: 'Dieser Reifen', tone: 'from-[#334155] to-[#64748B]', color: '#334155', icon: <CheckCircle2 size={14} /> },
};
const eur = (n: number) => `${n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const DISMISS_KEY = 'sl_dismiss_until';
const LAST_KEY = 'sl_last_search';
const GRADE_COLOR: Record<string, string> = { A: '#16A34A', B: '#65A30D', C: '#CA8A04', D: '#EA580C', E: '#DC2626' };

const currentSeason = (): Season => {
  const m = new Date().getMonth() + 1;
  return m >= 9 || m <= 2 ? 'winter' : 'sommer';
};

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

function BotAvatar({ size = 30 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1B2A6B] to-[#2F4FD8] shadow-[0_4px_12px_rgba(47,79,216,0.35)] ring-2 ring-white"
      style={{ width: size, height: size }}
    >
      <Sparkles size={size * 0.48} color="#fff" />
    </span>
  );
}

function Bubble({ m }: { m: Msg }) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="sl-white max-w-[82%] rounded-[18px] rounded-br-[6px] bg-gradient-to-br from-[#1B2A6B] to-[#2F4FD8] px-3.5 py-2 text-[14px] leading-[145%] shadow-sm">{m.text}</p>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <BotAvatar size={26} />
      <p className="max-w-[86%] rounded-[18px] rounded-bl-[6px] bg-white px-3.5 py-2.5 text-[14px] leading-[152%] !text-[#1E2230] shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-[#E6E9F2]">{m.text}</p>
    </div>
  );
}

function Typing({ line }: { line: string }) {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar size={26} />
      <div className="min-w-[210px] rounded-[18px] rounded-bl-[6px] bg-white px-3.5 py-3 ring-1 ring-[#E6E9F2]">
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2].map(i => (
            <span key={i} className="h-2 w-2 rounded-full bg-[#2F4FD8] motion-safe:animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
        <p className="mt-1.5 text-[12.5px] !text-[#4B5163]">{line}</p>
        <span className="mt-2 block h-1 overflow-hidden rounded-full bg-[#EEF1F8]">
          <span className="block h-full w-1/3 rounded-full bg-gradient-to-r from-[#2F4FD8] to-[#4ADE80] motion-safe:animate-[sl-load_1.2s_ease-in-out_infinite]" />
        </span>
      </div>
    </div>
  );
}

function Chip({ children, onClick, active, icon }: { children: React.ReactNode; onClick: () => void; active?: boolean; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold ring-1 transition-all cursor-pointer ${
        active ? 'sl-white bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] ring-transparent shadow-sm' : 'bg-white !text-[#2B3040] ring-[#DCE1EC] hover:ring-[#2F4FD8] hover:!text-[#2F4FD8]'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function PathTile({ icon, tone, title, sub, onClick, wide }: { icon: React.ReactNode; tone: string; title: string; sub: string; onClick: () => void; wide?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-[16px] bg-white p-3 text-left ring-1 ring-[#E6E9F2] shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:-translate-y-0.5 hover:ring-[#9DB2FF] hover:shadow-[0_10px_24px_-12px_rgba(47,79,216,0.45)] cursor-pointer ${wide ? 'col-span-full' : ''}`}
    >
      <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${tone}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-bold leading-tight !text-[#16171A]">{title}</span>
        <span className="mt-0.5 block text-[12.5px] leading-[135%] !text-[#5A6072]">{sub}</span>
      </span>
      <ChevronRight size={17} color="#A3AAC0" className="shrink-0 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function OptionCard({ icon, tone, title, sub, badge, onClick }: { icon: React.ReactNode; tone: string; title: string; sub?: string; badge?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-[16px] bg-white p-3 text-left ring-1 ring-[#E6E9F2] transition-all hover:ring-[#9DB2FF] hover:shadow-[0_8px_20px_-12px_rgba(47,79,216,0.45)] cursor-pointer"
    >
      <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${tone}`}>{icon}</span>
      <span className="flex-1">
        <span className="flex items-center gap-2 text-[14.5px] font-bold !text-[#16171A]">
          {title}
          {badge ? <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10.5px] font-bold !text-[#15803D]">{badge}</span> : null}
        </span>
        {sub ? <span className="block text-[12.5px] !text-[#5A6072]">{sub}</span> : null}
      </span>
      <ChevronRight size={17} color="#A3AAC0" />
    </button>
  );
}

function MatchRing({ value, size = 52 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const color = value >= 85 ? '#16A34A' : value >= 70 ? '#2F4FD8' : '#CA8A04';
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} title="Wie gut der Reifen zu deinen Wünschen passt">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8ECF5" strokeWidth={5} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-[14px] font-bold" style={{ color }}>{value}</span>
        <span className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-wide !text-[#8A90A2]">Match</span>
      </span>
    </span>
  );
}

function LabelPill({ name, letter }: { name: string; letter: string }) {
  if (!letter || !GRADE_COLOR[letter]) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F6FB] py-0.5 pl-2 pr-0.5 text-[11.5px] !text-[#4B5163]">
      {name}
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold !text-white" style={{ background: GRADE_COLOR[letter] }}>
        {letter}
      </span>
    </span>
  );
}

function Labels({ p }: { p: Pick }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <LabelPill name="Nass" letter={p.wet} />
      <LabelPill name="Verbrauch" letter={p.fuel} />
      {p.noiseDb ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F6FB] px-2 py-0.5 text-[11.5px] !text-[#4B5163]">
          <Volume1 size={13} color="#64748B" /> {p.noiseDb} dB
        </span>
      ) : null}
      {p.rating ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8E6] px-2 py-0.5 text-[11.5px] font-semibold !text-[#92400E]">
          <Star size={12} color="#F59E0B" fill="#F59E0B" /> {p.rating.toLocaleString('de-DE')} ({p.reviews})
        </span>
      ) : null}
    </div>
  );
}

function ShopButton({ p, compact }: { p: Pick; compact?: boolean }) {
  const cls = `sl-white flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] font-bold shadow-[0_10px_22px_-10px_rgba(47,79,216,0.8)] transition-transform hover:-translate-y-0.5 ${
    compact ? 'px-3 py-2.5 text-[13.5px]' : 'py-3 pr-10 text-[14.5px]'
  }`;
  if (!p.token) {
    return (
      <Link href={`/produkte/${p.slug}`} className={cls}>
        Angebote ansehen <ArrowRight size={16} />
      </Link>
    );
  }
  return (
    <VendorExitLink
      href={buildVendorExitUrl({ token: p.token, productId: p.id, from: 'searchlight', vendor: p.vendor, vendorId: p.vendorId, brand: p.brand, instruction: 'Zum Angebot' })}
      onExit={() =>
        onVendorExitClick({ productId: p.id, productName: p.name, brandName: p.brand, vendor: p.vendor, vendorId: p.vendorId, source: 'searchlight', instruction: 'Zum Angebot', vendorPrice: p.price })
      }
      hand={!compact}
      className={cls}
    >
      Zum Angebot{p.vendor && !compact ? ` bei ${p.vendor}` : ''} <ArrowRight size={16} />
    </VendorExitLink>
  );
}

const shortName = (p: Pick) => p.name.replace(new RegExp(`^${p.brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i'), '');

/** The main recommendation: everything needed to decide. */
function HeroPick({ p, avg }: { p: Pick; avg?: number }) {
  const img = productImageSrc(p.image);
  const slot = SLOT[p.slot] || SLOT.current;
  const save = avg && p.price < avg ? (avg - p.price) * 4 : 0;
  return (
    <div className="overflow-hidden rounded-[20px] bg-white ring-2 ring-[#2F4FD8] shadow-[0_18px_40px_-20px_rgba(47,79,216,0.55)]">
      <div className={`sl-white flex items-center justify-between bg-gradient-to-r ${slot.tone} px-3.5 py-2 text-[12.5px] font-bold`}>
        <span className="inline-flex items-center gap-1.5">
          {slot.icon} {slot.label}
        </span>
        {p.offerCount > 1 ? <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px]">{p.offerCount} Shops verglichen</span> : null}
      </div>
      <div className="p-3.5">
        <div className="flex gap-3">
          <Link href={`/produkte/${p.slug}`} className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#F4F6FB] to-[#E7ECF7]">
            <OptimizedImage src={img.src} fallbacks={img.fallbacks} alt={p.name} width={84} height={84} className="h-[84px] w-[84px] object-contain" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.08em] !text-[#6B7280]">{p.brand}</p>
            <Link href={`/produkte/${p.slug}`} className="line-clamp-2 text-[15px] font-bold leading-snug !text-[#16171A] hover:!text-[#2F4FD8]">
              {shortName(p)}
            </Link>
            <p className="mt-0.5 text-[12px] !text-[#5A6072]">
              {p.size} {p.index}
            </p>
          </div>
          {p.match ? <MatchRing value={p.match} /> : null}
        </div>
        <div className="mt-3">
          <Labels p={p} />
        </div>
        {p.pros?.length || p.cons?.length ? (
          <ul className="mt-3 space-y-1.5">
            {(p.pros || []).map(t => (
              <li key={t} className="flex items-start gap-2 text-[13px] leading-[140%] !text-[#1E2230]">
                <span className="mt-[1px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
                  <Check size={11} strokeWidth={3.2} color="#15803D" />
                </span>
                {t}
              </li>
            ))}
            {(p.cons || []).map(t => (
              <li key={t} className="flex items-start gap-2 text-[13px] leading-[140%] !text-[#7C2D12]">
                <span className="mt-[1px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FFEDD5]">
                  <Minus size={11} strokeWidth={3.2} color="#C2410C" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        ) : p.reason ? (
          <p className="mt-3 rounded-[12px] bg-[#F1F4FF] px-3 py-2 text-[13px] !text-[#1E2A5A]">{p.reason}</p>
        ) : null}
        <div className="mt-3.5 rounded-[14px] bg-[#F6F8FC] p-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[24px] font-bold leading-none !text-[#16171A]">
                {eur(p.price)}
                <span className="ml-1 text-[12px] font-medium !text-[#6B7280]">/ Stück</span>
              </p>
              <p className="mt-1 text-[12.5px] !text-[#4B5163]">
                4 Reifen: <b className="!text-[#16171A]">{eur(p.priceFor4)}</b>
              </p>
            </div>
            {p.shopSavingsPct && p.shopSavingsPct >= 2 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#16A34A] px-2.5 py-1 text-[12px] font-bold !text-white">
                <TrendingDown size={13} color="#fff" /> {p.shopSavingsPct} % günstiger
              </span>
            ) : save >= 10 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11.5px] font-bold !text-[#15803D]">
                <TrendingDown size={13} color="#15803D" /> {eur(save)} unter Ø
              </span>
            ) : null}
          </div>
          {p.shopSavingsPct && p.shopSavingsPct >= 2 && p.maxShopPrice ? (
            <p className="mt-2 text-[12.5px] leading-[145%] !text-[#14532D]">
              Beim teuersten Shop kostet derselbe Reifen {eur(p.maxShopPrice)} – hier sparst du <b>{eur(p.shopSavingsFor4 || 0)}</b> bei 4 Reifen.
            </p>
          ) : null}
          {p.trend ? (
            <div className="mt-2.5 rounded-[12px] bg-white px-2.5 pb-1 pt-2 ring-1 ring-[#E6E9F2]">
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="font-semibold !text-[#4B5163]">Preisverlauf · {p.trend.days} Tage</span>
                <span className={`font-bold ${p.trend.pct < 0 ? '!text-[#15803D]' : p.trend.pct > 0 ? '!text-[#B91C1C]' : '!text-[#6B7280]'}`}>
                  {p.trend.pct < 0 ? `↓ ${Math.abs(p.trend.pct)} %` : p.trend.pct > 0 ? `↑ ${p.trend.pct} %` : 'stabil'}
                  {p.trend.isLowest ? ' · Tiefstpreis' : ''}
                </span>
              </div>
              <PriceTrendChart points={p.trend.points} height={62} />
            </div>
          ) : null}
        </div>
        <div className="mt-3">
          <ShopButton p={p} />
        </div>
        <Link href={`/produkte/${p.slug}`} className="mt-2 block text-center text-[12.5px] font-semibold !text-[#2F4FD8] hover:underline">
          Details{p.offerCount > 1 ? ` & alle ${p.offerCount} Angebote` : ''}
        </Link>
      </div>
    </div>
  );
}

/** Alternatives: short and scannable. */
function CompactPick({ p }: { p: Pick }) {
  const img = productImageSrc(p.image);
  const slot = SLOT[p.slot] || SLOT.current;
  return (
    <div className="overflow-hidden rounded-[18px] bg-white ring-1 ring-[#E6E9F2] shadow-[0_1px_3px_rgba(16,24,40,0.05)]">
      <div className="flex items-center justify-between px-3.5 pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold" style={{ background: `${slot.color}14`, color: slot.color }}>
          {slot.icon} {slot.label}
        </span>
        {p.match ? <span className="text-[11.5px] font-bold !text-[#4B5163]">Match {p.match}</span> : null}
      </div>
      <div className="flex gap-3 p-3.5 pt-2.5">
        <Link href={`/produkte/${p.slug}`} className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-[14px] bg-[#F4F6FB]">
          <OptimizedImage src={img.src} fallbacks={img.fallbacks} alt={p.name} width={60} height={60} className="h-[60px] w-[60px] object-contain" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] !text-[#6B7280]">{p.brand}</p>
          <Link href={`/produkte/${p.slug}`} className="line-clamp-1 text-[14px] font-bold !text-[#16171A] hover:!text-[#2F4FD8]">
            {shortName(p)}
          </Link>
          <div className="mt-1.5">
            <Labels p={p} />
          </div>
        </div>
      </div>
      {p.pros?.[0] || p.reason ? (
        <p className="mx-3.5 -mt-1 flex items-start gap-1.5 text-[12.5px] leading-[140%] !text-[#1E2230]">
          <Check size={13} strokeWidth={3} color="#15803D" className="mt-[2px] shrink-0" /> {p.pros?.[0] || p.reason}
        </p>
      ) : null}
      <div className="flex items-center gap-3 p-3.5">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[18px] font-bold leading-none !text-[#16171A]">
            {eur(p.price)}
            {p.shopSavingsPct && p.shopSavingsPct >= 2 ? <span className="rounded-full bg-[#DCFCE7] px-1.5 py-0.5 text-[10.5px] font-bold !text-[#15803D]">−{p.shopSavingsPct} %</span> : null}
          </p>
          <p className="mt-1 text-[11.5px] !text-[#6B7280]">
            4 Stück {eur(p.priceFor4)}
            {p.trend && p.trend.pct < 0 ? <span className="font-semibold !text-[#15803D]"> · ↓ {Math.abs(p.trend.pct)} %</span> : null}
          </p>
        </div>
        <div className="w-[148px] shrink-0">
          <ShopButton p={p} compact />
        </div>
      </div>
    </div>
  );
}

function SizeVisual({ w, h, d }: { w?: string; h?: string; d?: string }) {
  return (
    <div className="sl-white relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#0B1437] via-[#1B2A6B] to-[#2F4FD8] p-4">
      <span className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border-[14px] border-white/10" aria-hidden />
      <p className="text-[11px] uppercase tracking-[0.12em] opacity-80">So steht es auf deinem Reifen</p>
      <div className="mt-2 flex items-end gap-1 font-bold tracking-tight">
        {[
          [w, 'Breite'],
          ['/', ''],
          [h, 'Querschnitt'],
          [`R${d}`, 'Zoll'],
        ].map(([v, l], i) =>
          l ? (
            <span key={i} className={`flex flex-col items-center ${i === 3 ? 'pl-2' : ''}`}>
              <span className="text-[30px] leading-none">{v}</span>
              <span className="mt-1 text-[10.5px] font-medium opacity-80">{l}</span>
            </span>
          ) : (
            <span key={i} className="pb-4 text-[26px] leading-none opacity-60">
              /
            </span>
          )
        )}
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
      <rect x="92" y="26" width="136" height="28" rx="8" fill="none" stroke="#4ADE80" strokeWidth="2" strokeDasharray="5 4" />
    </svg>
  );
}

function sizeOf(p: Pick) {
  const m = /(\d{3})\/(\d{2})\s*R(\d{2})/.exec(p.size || '');
  return m ? { width: m[1], height: m[2], diameter: m[3] } : {};
}

/* ------------------------------------------------------------ main */

export default function Searchlight() {
  const pathname = usePathname() || '/';
  const productSlug = /^\/produkte\/([^/?#]+)/.exec(pathname)?.[1] || '';
  const dispatch = useDispatch<AppDispatch>();
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
  const [last, setLast] = useState<Criteria | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const say = useCallback((...m: Msg[]) => setMsgs(prev => [...prev, ...m]), []);

  const loadingLines = useMemo(() => {
    const size = crit.width && crit.height && crit.diameter ? `${crit.width}/${crit.height} R${crit.diameter}` : 'deiner Größe';
    return [`Ich vergleiche alle Reifen in ${size} …`, 'Ich prüfe Nasshaftung, Verbrauch und Lautstärke …', 'Ich vergleiche die Preise aller Shops …', 'Ich wähle die beste für dich aus …'];
  }, [crit.width, crit.height, crit.diameter]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if ((step === 'results' || step === 'product') && answerRef.current) {
      el.scrollTo({ top: Math.max(0, answerRef.current.offsetTop - 110), behavior: 'smooth' });
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [msgs, step, carRes, busy]);

  useEffect(() => {
    if (step !== 'loading') return;
    const t = setInterval(() => setLoadLine(l => (l + 1) % loadingLines.length), 1100);
    return () => clearInterval(t);
  }, [step, loadingLines.length]);

  const runRecommend = useCallback(
    async (c: Criteria, text?: string) => {
      setStep('loading');
      setLoadLine(0);
      try {
        const r = await recommend({ ...c, ...(text ? { text } : {}) });
        setResult(r);
        if (r.criteria) setCrit(prev => ({ ...prev, ...r.criteria }));
        say({ role: 'bot', text: r.message });
        if (r.needs === 'carSize') setStep('carSize');
        else if (r.needs === 'size') setStep('needSize');
        else {
          setStep('results');
          if (r.picks.length && r.criteria?.width) {
            const keep: Criteria = {
              width: r.criteria.width,
              height: r.criteria.height,
              diameter: r.criteria.diameter,
              season: r.criteria.season,
              priority: r.criteria.priority,
              budgetPer4: r.criteria.budgetPer4,
              minLoadIndex: r.criteria.minLoadIndex,
              minSpeed: r.criteria.minSpeed,
            };
            safeSet('local', LAST_KEY, JSON.stringify(keep));
            setLast(keep);
          }
        }
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
        say({ role: 'bot', text: 'Diesen Reifen konnte ich gerade nicht prüfen. Starte gern eine neue Suche.' });
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
          ? 'Hallo! 👋 Soll ich prüfen, ob sich dieser Reifen lohnt – oder suchen wir gemeinsam den besten für dich?'
          : 'Hallo! 👋 Ich bin Searchlight. Sag mir einfach, was du suchst – oder wähle unten einen Weg. In Sekunden zeige ich dir den besten Reifen.',
      },
    ]);
    setResult(null);
    setCheck(null);
    setCarRes(null);
    setStep('start');
    try {
      const raw = safeGet('local', LAST_KEY);
      setLast(raw ? (JSON.parse(raw) as Criteria) : null);
    } catch {
      setLast(null);
    }
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
        say({ role: 'user', text: 'Größe wählen' }, { role: 'bot', text: 'Welche Reifengröße hast du? Sie steht auf der Reifenflanke.' });
        setStep('size');
      } else if (mode === 'photo' || mode === 'car') setStep(mode);
      else if (mode === 'text') setTimeout(() => inputRef.current?.focus(), 250);
    },
    [productSlug, reset, runProductCheck, say]
  );

  useEffect(() => {
    const h = (e: Event) => openWith((e as CustomEvent<OpenDetail>).detail || {});
    window.addEventListener('searchlight:open', h);
    return () => window.removeEventListener('searchlight:open', h);
  }, [openWith]);

  // Body scroll lock while the panel is open (mobile)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

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
    if (views >= 3) msg = 'Ich zeige dir den besten Reifen für deine Größe – in 10 Sekunden.';
    else if (searches >= 3) msg = 'Zu viele Filter? Sag mir einfach, was du suchst.';
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
  const startSize = () => {
    say({ role: 'user', text: 'Ich kenne meine Größe' }, { role: 'bot', text: 'Super! Wähle deine Größe – sie steht auf der Reifenflanke.' });
    setStep('size');
  };
  const chooseSize = (w: string, h: string, d: string) => {
    setCrit(c => ({ ...c, width: w, height: h, diameter: d }));
    say({ role: 'user', text: `${w}/${h} R${d}` }, { role: 'bot', text: 'Für welche Saison?' });
    setStep('season');
  };
  const chooseSeason = (s: Season) => {
    setCrit(c => ({ ...c, season: s }));
    say({ role: 'user', text: SEASON_LABEL[s] }, { role: 'bot', text: 'Und was ist dir am wichtigsten?' });
    setStep('priority');
  };
  const choosePriority = (p: Priority) => {
    const c = { ...crit, priority: p };
    setCrit(c);
    say({ role: 'user', text: `${PRIORITY_LABEL[p]}${c.budgetPer4 ? ` · bis ${c.budgetPer4} € für 4` : ''}` });
    runRecommend(c);
  };
  const sendText = (raw?: string) => {
    const t = (raw ?? input).trim();
    if (!t || step === 'loading') return;
    setInput('');
    say({ role: 'user', text: t });
    // a new sentence starts fresh – only the size picked in the steps is kept
    runRecommend({ priority: undefined, budgetPer4: 0 }, t);
  };
  const resumeLast = () => {
    if (!last) return;
    say({ role: 'user', text: `Weiter mit ${last.width}/${last.height} R${last.diameter}${last.season ? ` · ${SEASON_LABEL[last.season as Season]}` : ''}` });
    setCrit(c => ({ ...c, ...last }));
    runRecommend(last);
  };
  const refine = (label: string, patch: Partial<Criteria>) => {
    const c = { ...crit, ...patch, seasonAssumed: false };
    setCrit(c);
    say({ role: 'user', text: label });
    runRecommend(c);
  };
  const compareAll = (picks: Pick[]) => {
    dispatch(clearProducts());
    picks.slice(0, 4).forEach(p => {
      const s = sizeOf(p);
      const idx = /^(\d{2,3})\s*([A-Z]{1,2})?$/.exec(p.index || '');
      dispatch(
        addProduct({
          _id: p.id,
          slug: p.slug,
          product_name: p.name,
          brand_name: p.brand,
          product_image: p.image,
          dimensions: p.size,
          search_price: p.price,
          cheapest_offer: p.price,
          fuel_class: p.fuel,
          wet_grip: p.wet,
          noise_class: p.noiseDb ? String(p.noiseDb) : '',
          lastIndex: idx?.[1],
          speedIndex: idx?.[2],
          merchant_product_third_category: p.season,
          best_vendor: p.vendor,
          best_vendor_id: p.vendorId,
          best_vendor_token: p.token,
          offer_count: p.offerCount,
          average_rating: p.rating ?? undefined,
          expensive_offer: p.maxShopPrice ?? undefined,
          price_trend: p.trend ? { points: p.trend.points } : undefined,
          ...s,
        })
      );
    });
    setOpen(false);
    dispatch(openModal());
    toast.success('Deine Empfehlungen im Vergleich');
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
        say({ role: 'bot', text: `Erkannt: ${r.width}/${r.height} R${r.diameter} ${r.loadIndex || ''}${r.speedIndex || ''}${r.brand ? ` (${r.brand})` : ''}. Stimmt das? Sonst unten anpassen.` });
        setStep('size');
      } else {
        say({
          role: 'bot',
          text: r.error === 'ai_not_configured' ? 'Die Fotoerkennung ist gerade nicht verfügbar. Wähle deine Größe bitte von Hand.' : r.hint || 'Ich konnte die Größe nicht sicher lesen. Versuch ein schärferes Foto, auf dem z. B. „205/55 R16“ gut zu sehen ist.',
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
        say({ role: 'bot', text: 'Zu diesem Auto habe ich keine sicheren Größen. Lies die Größe bitte auf der Reifenflanke ab – oder schick mir ein Foto.' });
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
  /** Size chosen from a sentence like "VW Golf 7 Winterreifen": keep the rest of the sentence. */
  const pickResultCarSize = (s: CarSize) => {
    const c: Criteria = { ...crit, width: s.width, height: s.height, diameter: s.diameter, minLoadIndex: Number(s.loadIndex) || 0, minSpeed: s.speedIndex || '' };
    setCrit(c);
    say({ role: 'user', text: `${s.width}/${s.height} R${s.diameter}` });
    if (c.season) runRecommend(c);
    else {
      say({ role: 'bot', text: 'Für welche Saison?' });
      setStep('season');
    }
  };

  const stepIndex = STEPS.indexOf(step);
  const floatingLabel = productSlug
    ? 'Lohnt sich dieser Reifen?'
    : pathname.startsWith('/produkte') || /^\/(reifen|marken|winterreifen|sommerreifen|ganzjahresreifen)/.test(pathname)
      ? 'Hilf mir wählen'
      : 'Searchlight';
  const sel = 'sl-select w-full appearance-none bg-transparent px-3 py-2.5 text-[15px] font-bold !text-[#16171A] !border-0 !shadow-none focus:outline-none';
  const selBox = 'block overflow-hidden rounded-[12px] bg-white ring-1 ring-[#DCE1EC] focus-within:ring-2 focus-within:ring-[#2F4FD8]';
  const nowSeason = currentSeason();
  const rc = result?.criteria;
  const picks = result?.picks || [];

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
            <div className="pointer-events-auto relative w-[min(210px,calc(100vw-5rem))] rounded-xl bg-white px-2.5 py-2 text-[11.5px] leading-snug !text-[#16171A] shadow-[0_8px_20px_rgba(16,24,40,0.16)] ring-1 ring-[#E6E9F2]">
              <div className="flex items-start gap-1.5">
                <BotAvatar size={18} />
                <p className="line-clamp-3">{bubble}</p>
              </div>
              <div className="mt-1.5 flex gap-1 pl-6">
                <button type="button" onClick={() => openWith({ mode: productSlug ? 'product' : 'start' })} className="sl-white rounded-full bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] px-2.5 py-0.5 text-[11px] font-bold leading-5 cursor-pointer">
                  Ja, hilf mir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBubble('');
                    safeSet('local', DISMISS_KEY, String(Date.now() + 7 * 864e5));
                  }}
                  className="rounded-full px-2 py-0.5 text-[11px] leading-5 !text-[#5A6072] hover:bg-[#F2F3F5] cursor-pointer"
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
            className="pointer-events-auto group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#1B2A6B] via-[#2443C9] to-[#3A64F6] text-[13px] font-bold shadow-[0_10px_22px_-6px_rgba(47,79,216,0.7)] ring-2 ring-white transition-transform hover:-translate-y-0.5 cursor-pointer sm:w-auto sm:gap-1.5 sm:pl-1.5 sm:pr-3.5"
          >
            {!used ? <span className="absolute inset-0 rounded-full bg-[#3A64F6] opacity-50 motion-safe:animate-ping" aria-hidden /> : null}
            <span className="sl-white relative inline-flex items-center gap-1.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <Sparkles size={15} aria-hidden />
              </span>
              <span className="hidden sm:inline">{floatingLabel}</span>
            </span>
          </button>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 z-[100000] print:hidden" role="dialog" aria-modal="true" aria-label="Searchlight Reifen-Assistent">
          <button type="button" aria-label="Schließen" className="absolute inset-0 bg-[#0B1020]/45 backdrop-blur-[3px] motion-safe:animate-[sl-fade_.2s_ease-out]" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 right-0 flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-[26px] bg-[#F4F6FB] shadow-2xl motion-safe:animate-[sl-up_.28s_cubic-bezier(.2,.8,.2,1)] md:top-0 md:h-full md:w-[480px] md:rounded-none md:rounded-l-[26px]">
            {/* Header */}
            <div className="sl-white relative overflow-hidden bg-gradient-to-br from-[#0B1437] via-[#1B2A6B] to-[#2F4FD8] px-4 pb-3 pt-3.5">
              <span className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full border-[26px] border-white/[0.06]" aria-hidden />
              <span className="mx-auto mb-2 block h-1 w-10 rounded-full bg-white/30 md:hidden" aria-hidden />
              <div className="relative flex items-center gap-3">
                <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/12 ring-1 ring-white/25">
                  <Sparkles size={21} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#4ADE80] ring-2 ring-[#1B2A6B]" />
                </span>
                <div className="flex-1">
                  <p className="text-[17px] font-bold leading-tight">Searchlight</p>
                  <p className="text-[12.5px] opacity-80">Dein Reifen-Berater<span className="hidden sm:inline"> · Live-Preise</span></p>
                </div>
                <button type="button" onClick={reset} aria-label="Neu starten" title="Neu starten" className="rounded-full p-2 hover:bg-white/15 cursor-pointer">
                  <RotateCcw size={18} />
                </button>
                <button type="button" onClick={() => setOpen(false)} aria-label="Schließen" className="rounded-full p-2 hover:bg-white/15 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              {stepIndex >= 0 ? (
                <div className="relative mt-3 grid grid-cols-3 gap-1.5">
                  {STEP_NAMES.map((n, i) => (
                    <div key={n}>
                      <span className={`block h-1.5 rounded-full transition-colors ${i <= stepIndex ? 'bg-[#4ADE80]' : 'bg-white/20'}`} />
                      <span className={`mt-1 block text-[10.5px] font-semibold ${i <= stepIndex ? 'opacity-100' : 'opacity-55'}`}>
                        {i + 1}. {n}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Conversation */}
            <div ref={scroller} className="relative flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
              {msgs.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
              {busy ? <Typing line={busy} /> : null}
              {step === 'loading' ? <Typing line={loadingLines[loadLine]} /> : null}

              {step === 'start' && (
                <div className="space-y-3 pl-8">
                  {last?.width ? (
                    <button
                      type="button"
                      onClick={resumeLast}
                      className="group flex w-full items-center gap-3 rounded-[16px] bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF4] p-3 text-left ring-1 ring-[#BBF7D0] transition hover:ring-[#4ADE80] cursor-pointer"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white">
                        <History size={19} color="#15803D" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11.5px] font-bold uppercase tracking-[0.08em] !text-[#15803D]">Letzte Suche</span>
                        <span className="block truncate text-[14px] font-bold !text-[#14532D]">
                          {last.width}/{last.height} R{last.diameter}
                          {last.season ? ` · ${SEASON_LABEL[last.season as Season]}` : ''}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[12.5px] font-bold !text-[#15803D]">
                        Weiter <ArrowRight size={14} color="#15803D" />
                      </span>
                    </button>
                  ) : null}

                  {productSlug ? (
                    <PathTile
                      wide
                      icon={<ShieldCheck size={21} color="#fff" />}
                      tone="bg-gradient-to-br from-[#1B2A6B] to-[#2F4FD8]"
                      title="Lohnt sich dieser Reifen?"
                      sub="Preis-Check & bessere Alternativen in derselben Größe"
                      onClick={() => {
                        say({ role: 'user', text: 'Lohnt sich dieser Reifen?' });
                        runProductCheck(productSlug);
                      }}
                    />
                  ) : null}

                  <div className="grid gap-2">
                    <PathTile icon={<Ruler size={20} color="#2F4FD8" />} tone="bg-[#EEF2FF]" title="Ich kenne meine Größe" sub="3 kurze Fragen, ohne Tippen" onClick={startSize} />
                    <PathTile
                      icon={<Car size={20} color="#B45309" />}
                      tone="bg-[#FFF7E6]"
                      title="Mein Auto"
                      sub="Ich finde die passende Größe"
                      onClick={() => {
                        say({ role: 'user', text: 'Mein Auto angeben' }, { role: 'bot', text: 'Welches Auto fährst du?' });
                        setStep('car');
                      }}
                    />
                    <PathTile
                      icon={<Camera size={20} color="#047857" />}
                      tone="bg-[#ECFDF5]"
                      title="Foto vom Reifen"
                      sub="Ich lese die Größe von der Flanke"
                      onClick={() => {
                        say({ role: 'user', text: 'Foto vom Reifen' }, { role: 'bot', text: 'Fotografiere die Beschriftung auf der Seite deines Reifens. Das Foto wird nur gelesen, nicht gespeichert.' });
                        setStep('photo');
                      }}
                    />
                  </div>

                  <div>
                    <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] !text-[#6B7280]">Oder einfach schreiben</p>
                    <div className="flex flex-wrap gap-1.5">
                      {EXAMPLES.map(e => (
                        <Chip key={e} onClick={() => sendText(e)} icon={<Sparkles size={12} color="#2F4FD8" />}>
                          {e}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(step === 'size' || step === 'needSize') && (
                <div className="space-y-3 pl-8">
                  <SizeVisual w={crit.width} h={crit.height} d={crit.diameter} />
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        ['Breite', 'width', WIDTHS],
                        ['Querschnitt', 'height', HEIGHTS],
                        ['Zoll', 'diameter', RIMS],
                      ] as const
                    ).map(([label, key, list]) => (
                      <label key={key} className="text-[11.5px] font-semibold !text-[#5A6072]">
                        {label}
                        <span className={`${selBox} mt-1`}>
                          <select className={sel} value={crit[key]} onChange={e => setCrit({ ...crit, [key]: e.target.value })}>
                            {list.map(v => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => chooseSize(String(crit.width), String(crit.height), String(crit.diameter))}
                    className="sl-white flex w-full items-center justify-center gap-2 rounded-[13px] bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] py-3 text-[15px] font-bold shadow-[0_10px_22px_-10px_rgba(47,79,216,0.8)] cursor-pointer"
                  >
                    Weiter mit {crit.width}/{crit.height} R{crit.diameter} <ArrowRight size={16} />
                  </button>
                  <div>
                    <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] !text-[#6B7280]">Beliebt</p>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SIZES.map(([w, h, d]) => (
                        <Chip key={w + h + d} onClick={() => chooseSize(w, h, d)}>
                          {w}/{h} R{d}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Chip onClick={() => setStep('photo')} icon={<Camera size={13} color="#047857" />}>
                      Größe per Foto
                    </Chip>
                    <Chip onClick={() => setStep('car')} icon={<Car size={13} color="#B45309" />}>
                      Über mein Auto
                    </Chip>
                  </div>
                </div>
              )}

              {step === 'season' && (
                <div className="space-y-2 pl-8">
                  {(
                    [
                      ['winter', <Snowflake key="w" size={22} color="#2563EB" />, 'bg-[#EFF6FF]', 'Pflicht bei Schnee, Eis und Glätte'],
                      ['sommer', <Sun key="s" size={22} color="#D97706" />, 'bg-[#FFFBEB]', 'Kürzere Bremswege bei Wärme'],
                      ['ganzjahr', <CloudSun key="g" size={22} color="#059669" />, 'bg-[#ECFDF5]', 'Ein Satz fürs ganze Jahr'],
                    ] as const
                  ).map(([s, icon, tone, sub]) => (
                    <OptionCard key={s} icon={icon} tone={tone} title={SEASON_LABEL[s]} sub={sub} badge={s === nowSeason ? 'Jetzt Saison' : undefined} onClick={() => chooseSeason(s)} />
                  ))}
                </div>
              )}

              {step === 'priority' && (
                <div className="space-y-3 pl-8">
                  <div className="grid gap-2">
                    <OptionCard icon={<Crown size={21} color="#2F4FD8" />} tone="bg-[#EEF2FF]" title="Preis-Leistung" sub="Die beste Balance – meistgewählt" onClick={() => choosePriority('balanced')} />
                    <OptionCard icon={<BadgeEuro size={21} color="#047857" />} tone="bg-[#ECFDF5]" title="Möglichst günstig" sub="Kleiner Preis, solide Nasshaftung" onClick={() => choosePriority('cheap')} />
                    <OptionCard icon={<ShieldCheck size={21} color="#BE123C" />} tone="bg-[#FFF1F2]" title="Maximale Sicherheit" sub="Kürzester Bremsweg bei Nässe" onClick={() => choosePriority('safety')} />
                    <OptionCard icon={<Volume1 size={21} color="#0E7490" />} tone="bg-[#ECFEFF]" title="Leise & sparsam" sub="Weniger Lärm und Verbrauch – ideal fürs E-Auto" onClick={() => choosePriority('quiet')} />
                  </div>
                  <div className="rounded-[16px] bg-white p-3 ring-1 ring-[#E6E9F2]">
                    <p className="mb-2 text-[12.5px] font-bold !text-[#2B3040]">Budget für 4 Reifen (optional)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {BUDGETS.map(b => (
                        <Chip key={b} active={(crit.budgetPer4 || 0) === b} onClick={() => setCrit({ ...crit, budgetPer4: b })}>
                          {b ? `bis ${b} €` : 'Egal'}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 'photo' && !busy && (
                <div className="space-y-3 pl-8">
                  <div className="rounded-[16px] bg-white p-3 ring-1 ring-[#E6E9F2]">
                    <SidewallGuide />
                    <ul className="mt-2 space-y-1 text-[12.5px] !text-[#2B3040]">
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
                    className="sl-white flex w-full items-center justify-center gap-2 rounded-[13px] bg-gradient-to-r from-[#047857] to-[#10B981] py-3 text-[15px] font-bold shadow-[0_10px_22px_-10px_rgba(5,150,105,0.8)] cursor-pointer"
                  >
                    <Camera size={18} /> Foto aufnehmen oder wählen
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => onPhoto(e.target.files?.[0])} />
                </div>
              )}

              {step === 'car' && !busy && (
                <div className="space-y-3 pl-8">
                  {!carRes ? (
                    <div className="space-y-3 rounded-[16px] bg-white p-3 ring-1 ring-[#E6E9F2]">
                      <div>
                        <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] !text-[#6B7280]">Marke</p>
                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_MAKES.map(m => (
                            <Chip
                              key={m}
                              active={make === m}
                              onClick={() => {
                                setMake(m);
                                setModel('');
                              }}
                            >
                              {m}
                            </Chip>
                          ))}
                          <span className="inline-block overflow-hidden rounded-full bg-white ring-1 ring-[#DCE1EC]">
                          <select
                            className="sl-select bg-transparent px-3 py-1.5 text-[13px] font-semibold !text-[#2B3040] !border-0"
                            value={POPULAR_MAKES.includes(make) ? '' : make}
                            onChange={e => {
                              setMake(e.target.value);
                              setModel('');
                            }}
                            aria-label="Andere Marke"
                          >
                            <option value="">Andere …</option>
                            {ALL_MAKES.filter(m => !POPULAR_MAKES.includes(m)).map(m => (
                              <option key={m}>{m}</option>
                            ))}
                          </select>
                          </span>
                        </div>
                      </div>
                      {make ? (
                        <div>
                          <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] !text-[#6B7280]">Modell</p>
                          <div className="flex max-h-[150px] flex-wrap gap-1.5 overflow-y-auto">
                            {(CAR_MODELS[make] || []).map(m => (
                              <Chip key={m} active={model === m} onClick={() => setModel(m)}>
                                {m}
                              </Chip>
                            ))}
                          </div>
                          <input
                            className="mt-2 w-full rounded-[12px] !border-0 bg-[#F6F8FC] px-3 py-2.5 text-[14px] !text-[#16171A] ring-1 ring-[#DCE1EC]"
                            placeholder="Anderes Modell, z. B. Golf 7 Variant"
                            value={CAR_MODELS[make]?.includes(model) ? '' : model}
                            onChange={e => setModel(e.target.value)}
                          />
                        </div>
                      ) : null}
                      {make && model ? (
                        <div className="flex gap-2">
                          <span className={`${selBox} flex-1`}>
                            <select className={sel} value={year} onChange={e => setYear(e.target.value)} aria-label="Baujahr">
                              <option value="">Baujahr (optional)</option>
                              {YEARS.map(y => (
                                <option key={y}>{y}</option>
                              ))}
                            </select>
                          </span>
                          <button type="button" onClick={findCar} className="sl-white shrink-0 rounded-[12px] bg-gradient-to-r from-[#B45309] to-[#F59E0B] px-4 text-[14.5px] font-bold cursor-pointer">
                            Größen finden
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        {carRes.sizes?.map(s => (
                          <button
                            key={`${s.width}${s.height}${s.diameter}`}
                            type="button"
                            onClick={() => pickCarSize(s)}
                            className="rounded-[14px] bg-white p-3 text-left ring-1 ring-[#E6E9F2] hover:ring-[#2F4FD8] cursor-pointer"
                          >
                            <span className="block text-[17px] font-bold !text-[#16171A]">
                              {s.width}/{s.height} R{s.diameter}
                            </span>
                            <span className="text-[12px] !text-[#5A6072]">
                              {s.loadIndex}
                              {s.speedIndex} {s.original ? '· Werksgröße' : ''}
                            </span>
                          </button>
                        ))}
                      </div>
                      {carRes.note ? <p className="text-[12px] leading-[145%] !text-[#5A6072]">ⓘ {carRes.note}</p> : null}
                    </>
                  )}
                </div>
              )}

              {step === 'carSize' && result?.sizes?.length ? (
                <div className="space-y-2 pl-8">
                  <div className="grid grid-cols-2 gap-2">
                    {result.sizes.map(s => (
                      <button
                        key={`${s.width}${s.height}${s.diameter}`}
                        type="button"
                        onClick={() => pickResultCarSize(s)}
                        className="rounded-[14px] bg-white p-3 text-left ring-1 ring-[#E6E9F2] hover:ring-[#2F4FD8] cursor-pointer"
                      >
                        <span className="block text-[17px] font-bold !text-[#16171A]">
                          {s.width}/{s.height} R{s.diameter}
                        </span>
                        <span className="text-[12px] !text-[#5A6072]">
                          {s.loadIndex}
                          {s.speedIndex}
                        </span>
                      </button>
                    ))}
                  </div>
                  {result.car?.note ? <p className="text-[12px] leading-[145%] !text-[#5A6072]">ⓘ {result.car.note}</p> : null}
                </div>
              ) : null}

              {step === 'needSize' && (
                <div className="flex flex-wrap gap-1.5 pl-8">
                  <Chip onClick={() => setStep('photo')} icon={<Camera size={13} color="#047857" />}>
                    Foto vom Reifen
                  </Chip>
                  <Chip onClick={() => setStep('car')} icon={<Car size={13} color="#B45309" />}>
                    Auto angeben
                  </Chip>
                </div>
              )}

              {step === 'results' && result && (
                <div ref={answerRef} className="space-y-3 pl-8">
                  {/* What I searched for + one-tap changes */}
                  <div className="rounded-[16px] bg-white p-3 ring-1 ring-[#E6E9F2]">
                    <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
                      {rc?.width ? (
                        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 font-bold !text-[#1B2A6B]">
                          {rc.width}/{rc.height} R{rc.diameter}
                        </span>
                      ) : null}
                      {rc?.season ? (
                        <span className="rounded-full bg-[#F4F6FB] px-2.5 py-1 font-semibold !text-[#2B3040]">
                          {SEASON_LABEL[rc.season as Season]}
                          {rc.seasonAssumed ? ' (jetzt Saison)' : ''}
                        </span>
                      ) : null}
                      {rc?.priority ? <span className="rounded-full bg-[#F4F6FB] px-2.5 py-1 font-semibold !text-[#2B3040]">{PRIORITY_LABEL[rc.priority]}</span> : null}
                      {rc?.budgetPer4 ? <span className="rounded-full bg-[#F4F6FB] px-2.5 py-1 font-semibold !text-[#2B3040]">bis {rc.budgetPer4} €</span> : null}
                      {rc?.brand ? <span className="rounded-full bg-[#F4F6FB] px-2.5 py-1 font-semibold !text-[#2B3040]">{rc.brand}</span> : null}
                    </div>
                    {result.summary && result.total ? (
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] font-semibold !text-[#6B7280]">
                          <span>ab {eur(result.summary.minPrice)}</span>
                          <span>Ø {eur(result.summary.avgPrice)}</span>
                          <span>bis {eur(result.summary.maxPrice)}</span>
                        </div>
                        <div className="relative mt-1.5 h-2 rounded-full bg-gradient-to-r from-[#BBF7D0] via-[#E0E7FF] to-[#FDE68A]">
                          {picks.map(p => {
                            const s = result.summary!;
                            const pos = s.maxPrice > s.minPrice ? ((p.price - s.minPrice) / (s.maxPrice - s.minPrice)) * 100 : 50;
                            return (
                              <span
                                key={p.slot}
                                title={`${SLOT[p.slot]?.label}: ${eur(p.price)}`}
                                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                                style={{ left: `${Math.min(97, Math.max(3, pos))}%`, background: SLOT[p.slot]?.color || '#334155' }}
                              />
                            );
                          })}
                        </div>
                        <p className="mt-1.5 text-[11.5px] !text-[#6B7280]">{result.total} Reifen verglichen · Preise pro Stück</p>
                      </div>
                    ) : null}
                  </div>

                  {picks[0] ? <HeroPick p={picks[0]} avg={result.summary?.avgPrice} /> : null}

                  {picks.length > 1 ? <p className="pt-1 text-[12px] font-bold uppercase tracking-[0.08em] !text-[#6B7280]">Alternativen</p> : null}
                  {picks.slice(1).map(p => (
                    <CompactPick key={p.slot} p={p} />
                  ))}

                  {picks.length ? (
                    <>
                      <div>
                        <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.08em] !text-[#6B7280]">Anpassen</p>
                        <div className="flex flex-wrap gap-1.5">
                          {rc?.priority !== 'cheap' ? (
                            <Chip onClick={() => refine('Günstiger, bitte', { priority: 'cheap' })} icon={<BadgeEuro size={13} color="#047857" />}>
                              Günstiger
                            </Chip>
                          ) : null}
                          {rc?.priority !== 'safety' ? (
                            <Chip onClick={() => refine('Mehr Sicherheit', { priority: 'safety' })} icon={<ShieldCheck size={13} color="#BE123C" />}>
                              Sicherer
                            </Chip>
                          ) : null}
                          {rc?.priority !== 'quiet' ? (
                            <Chip onClick={() => refine('Leiser & sparsamer', { priority: 'quiet' })} icon={<Volume1 size={13} color="#0E7490" />}>
                              Leiser
                            </Chip>
                          ) : null}
                          {(['winter', 'sommer', 'ganzjahr'] as Season[])
                            .filter(s => s !== rc?.season)
                            .map(s => (
                              <Chip key={s} onClick={() => refine(SEASON_LABEL[s], { season: s })}>
                                {SEASON_LABEL[s]}
                              </Chip>
                            ))}
                          <Chip onClick={() => setStep('size')} icon={<Ruler size={13} color="#2F4FD8" />}>
                            Andere Größe
                          </Chip>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => compareAll(picks)}
                          className="flex items-center justify-center gap-1.5 rounded-[13px] bg-white py-3 text-[13.5px] font-bold !text-[#1B2A6B] ring-1 ring-[#C9D6FC] transition hover:ring-[#2F4FD8] cursor-pointer"
                        >
                          <GitCompareArrows size={16} color="#1B2A6B" /> Alle {picks.length} vergleichen
                        </button>
                        {rc?.width ? (
                          <Link
                            href={`/produkte?width=${rc.width}&height=${rc.height}&diameter=${rc.diameter}${rc.season ? `&kategorie=${SEASON_LABEL[rc.season as Season]}` : ''}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center gap-1.5 rounded-[13px] bg-white py-3 text-[13.5px] font-bold !text-[#1B2A6B] ring-1 ring-[#E6E9F2] transition hover:ring-[#2F4FD8]"
                          >
                            Alle {result.total || ''} ansehen <ArrowRight size={14} color="#1B2A6B" />
                          </Link>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {(['winter', 'sommer', 'ganzjahr'] as Season[])
                        .filter(s => s !== rc?.season)
                        .map(s => (
                          <Chip key={s} onClick={() => refine(SEASON_LABEL[s], { season: s })}>
                            {SEASON_LABEL[s]}
                          </Chip>
                        ))}
                      <Chip onClick={() => setStep('size')}>Andere Größe</Chip>
                    </div>
                  )}
                </div>
              )}

              {step === 'product' && check && (
                <div ref={answerRef} className="space-y-3 pl-8">
                  <div className="rounded-[16px] bg-white p-3.5 ring-1 ring-[#E6E9F2]">
                    <p className="text-[12px] font-semibold !text-[#5A6072]">
                      Preis im Vergleich zu {check.sameSizeCount} Reifen in {check.product.size}
                    </p>
                    <div className="relative mt-3 h-2.5 rounded-full bg-gradient-to-r from-[#16A34A] via-[#EAB308] to-[#DC2626]">
                      <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-white bg-[#16171A] shadow" style={{ left: `${Math.min(97, Math.max(3, check.pricePosition))}%` }} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[11px] !text-[#6B7280]">
                      <span>günstig</span>
                      <span>teuer</span>
                    </div>
                    {check.trendPct != null ? (
                      <p className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold ${check.trendPct <= 0 ? 'bg-[#ECFDF5] !text-[#047857]' : 'bg-[#FEF2F2] !text-[#B91C1C]'}`}>
                        {check.trendPct <= 0 ? <TrendingDown size={14} color="#047857" /> : <TrendingUp size={14} color="#B91C1C" />} {check.trendPct > 0 ? '+' : ''}
                        {check.trendPct} % in 30 Tagen
                      </p>
                    ) : null}
                    {check.timing ? <p className="mt-2 text-[13px] !text-[#2B3040]">{check.timing}</p> : null}
                  </div>
                  <HeroPick p={check.product} />
                  {check.alternatives.length ? <p className="pt-1 text-[12px] font-bold uppercase tracking-[0.08em] !text-[#6B7280]">Alternativen in derselben Größe</p> : null}
                  {check.alternatives.map(p => (
                    <CompactPick key={p.slot} p={p} />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const s = sizeOf(check.product);
                      if (s.width) chooseSize(s.width, s.height, s.diameter);
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-[13px] bg-white py-3 text-[13.5px] font-bold !text-[#1B2A6B] ring-1 ring-[#E6E9F2] cursor-pointer"
                  >
                    Den besten Reifen in {check.product.size} finden <ArrowRight size={14} color="#1B2A6B" />
                  </button>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-[#E6E9F2] bg-white px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5">
              <div className="flex items-end gap-2 rounded-[16px] bg-[#F4F6FB] p-1.5 ring-1 ring-[#DFE4EF] focus-within:ring-2 focus-within:ring-[#2F4FD8]">
                <button type="button" onClick={() => setStep('photo')} aria-label="Foto vom Reifen" className="rounded-[12px] p-2 hover:bg-white cursor-pointer">
                  <Camera size={20} color="#5A6072" />
                </button>
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendText();
                    }
                  }}
                  placeholder="Größe, Auto oder Wunsch …"
                  className="max-h-28 flex-1 resize-none !border-0 bg-transparent !shadow-none !outline-none px-1 py-2 text-[14.5px] !text-[#16171A] placeholder:!text-[#8A90A2] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => sendText()}
                  disabled={!input.trim() || step === 'loading'}
                  aria-label="Senden"
                  className="sl-white rounded-[12px] bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] p-2.5 disabled:opacity-40 cursor-pointer"
                >
                  {step === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <SendHorizonal size={18} />}
                </button>
              </div>
              <p className="mt-1.5 flex items-center gap-1 px-1 text-[10.5px] leading-[140%] !text-[#8A90A2]">
                <CircleDot size={10} color="#4ADE80" /> Live-Preise aus unserem Preisvergleich · Anfragen werden nicht gespeichert
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
