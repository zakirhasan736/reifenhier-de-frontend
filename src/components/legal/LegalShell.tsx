import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRight, ListOrdered, Mail, Scale } from 'lucide-react';
import TocNav, { type TocItem } from '@/components/legal/TocNav';

const LEGAL_LINKS = [
  { href: '/impressum-datenschutz', label: 'Impressum & Datenschutz', key: 'impressum' },
  { href: '/AGB', label: 'AGB', key: 'agb' },
  { href: '/auto-api/bedingungen', label: 'API-Nutzungsbedingungen', key: 'api' },
  { href: '/auto-api/preise-und-zahlung', label: 'Preise & Zahlung (API)', key: 'api-preise' },
];

/**
 * Layout for the legal pages in the Auto-API look: gradient hero, sticky
 * table of contents and the text in a white card. The legal text itself
 * stays in the page (children).
 */
export default function LegalShell({
  current,
  eyebrow = 'Rechtliches',
  title,
  intro,
  meta = [],
  note,
  toc,
  numbered = false,
  children,
}: {
  current: 'impressum' | 'agb';
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  meta?: { icon: ReactNode; label: ReactNode }[];
  note?: ReactNode;
  toc: TocItem[];
  numbered?: boolean;
  children: ReactNode;
}) {
  return (
    <main className="bg-[#F6F8FC] pb-16 md:pb-24">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1437] via-[#1B2A6B] to-[#2F4FD8]">
        <span className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border-[48px] border-white/5" aria-hidden />
        <span className="pointer-events-none absolute right-48 top-36 h-[160px] w-[160px] rounded-full border-[20px] border-white/5" aria-hidden />
        <div className="custom-container relative pb-24 pt-8 md:pb-32 md:pt-10">
          <nav aria-label="Breadcrumb" className="sl-white mb-8 flex flex-wrap items-center gap-1.5 text-[13px] opacity-75">
            <Link href="/" className="hover:underline">Startseite</Link>
            <ChevronRight size={14} />
            <span>{eyebrow}</span>
            <ChevronRight size={14} />
            <span aria-current="page">{title}</span>
          </nav>
          <p className="sl-white inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold uppercase tracking-[0.12em] ring-1 ring-white/20">
            <Scale size={14} /> {eyebrow}
          </p>
          <h1 className="sl-white mt-5 max-w-3xl text-[32px] font-bold leading-[115%] tracking-[-0.01em] md:text-[48px]">
            {title}
          </h1>
          {intro && (
            <p className="sl-white mt-4 max-w-2xl !text-[16px] !leading-[165%] opacity-85 md:!text-[17px]">{intro}</p>
          )}
          {meta.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {meta.map((m, i) => (
                <span key={i} className="sl-white inline-flex items-center gap-2 rounded-[10px] bg-white/10 px-3 py-1.5 text-[13px] font-medium ring-1 ring-white/15">
                  {m.icon} {m.label}
                </span>
              ))}
            </div>
          )}
          {note && <div className="rx-legal-note mt-5 max-w-2xl text-[14px]">{note}</div>}
        </div>
      </section>

      {/* ---------- Other legal pages ---------- */}
      <div className="custom-container relative -mt-12 md:-mt-14">
        <nav aria-label="Rechtliche Seiten" className="flex gap-2 overflow-x-auto rounded-[16px] bg-white p-2 shadow-[0_12px_40px_rgba(16,24,40,0.08)] ring-1 ring-[#E4E7F0]">
          {LEGAL_LINKS.map(l => {
            const on = l.key === current;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={on ? 'page' : undefined}
                className={`whitespace-nowrap rounded-[12px] px-4 py-2.5 text-[14px] font-semibold transition-colors ${
                  on ? 'sl-white bg-gradient-to-r from-[#1B2A6B] to-[#2F4FD8] shadow-md' : '!text-[#4B5163] hover:bg-[#F6F8FC] hover:!text-[#2F4FD8]'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ---------- TOC + text ---------- */}
      <div className="custom-container mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0">
          <details className="rounded-[16px] bg-white p-4 ring-1 ring-[#E4E7F0] lg:hidden">
            <summary className="flex cursor-pointer items-center gap-2 text-[15px] font-semibold !text-[#16171A]">
              <ListOrdered size={17} color="#2F4FD8" /> Inhalt ({toc.length} Abschnitte)
            </summary>
            <TocNav items={toc} numbered={numbered} className="mt-3" />
          </details>
          <div className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-4">
            <nav aria-label="Inhaltsverzeichnis" className="max-h-[calc(100vh-14rem)] overflow-y-auto rounded-[20px] bg-white p-4 ring-1 ring-[#E4E7F0]">
              <p className="mb-2 flex items-center gap-2 px-2.5 text-[12px] font-bold uppercase tracking-[0.12em] !text-[#6B7280]">
                <ListOrdered size={15} color="#2F4FD8" /> Inhalt
              </p>
              <TocNav items={toc} numbered={numbered} />
            </nav>
            <div className="rounded-[20px] bg-gradient-to-br from-[#0B1437] to-[#2F4FD8] p-5">
              <p className="sl-white text-[15px] font-semibold">Fragen oder Hinweise?</p>
              <p className="sl-white mt-1 !text-[13px] !leading-[155%] opacity-80">Schreiben Sie uns einfach eine E-Mail.</p>
              <a href="mailto:info@nextcreave.com" className="mt-3 inline-flex items-center gap-2 rounded-[10px] bg-white px-3.5 py-2 text-[13px] font-semibold !text-[#1B2A6B]">
                <Mail size={15} color="#1B2A6B" /> info@nextcreave.com
              </a>
            </div>
          </div>
        </aside>

        <div className={`rx-legal min-w-0 ${numbered ? 'rx-legal--count' : ''}`}>{children}</div>
      </div>
    </main>
  );
}
