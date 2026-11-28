'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import ReviewSummary from '@/components/reviews/ReviewSummary';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast  from 'react-hot-toast';
import { ArrowRight, BadgeCheck, Check, Mail, ShieldCheck } from 'lucide-react';

const FOOTER_COLUMNS: [string, [string, string][]][] = [
  ['Reifen', [['Sommerreifen', '/sommerreifen'], ['Winterreifen', '/winterreifen'], ['Ganzjahresreifen', '/ganzjahresreifen'], ['Reifengrößen', '/reifen'], ['Reifenmarken', '/marken']]],
  ['Ratgeber & Tools', [['News & Testberichte', '/artikel'], ['Reifengrößenrechner', '/reifengroessen-rechner'], ['Reifenpreisvergleich', '/reifenpreisvergleich'], ['Auto-API', '/auto-api']]],
  ['Reifexa', [['Home', '/'], ['Alle Produkte', '/produkte'], ['Favoriten', '/favoriten']]],
];

const Footer: React.FC = () => {
  const pathname = usePathname() || '/';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) {
    toast.error('Bitte geben Sie Ihre E-Mail-Adresse ein.');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
      }/api/newsletter/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer_form' }),
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success(
        'Danke! Sie haben unseren Newsletter erfolgreich abonniert 🎉'
      );
      setEmail('');
    } else {
      toast.error(data.message || 'Fehler beim Abonnieren.');
    }
  } catch (err) {
    console.error('Newsletter error:', err);
    toast.error('Serverfehler. Bitte versuchen Sie es später erneut.');
  } finally {
    setLoading(false);
  }
};

  if (pathname.startsWith('/ops')) return null;

  return (
    <footer className="footer-section bg-[#F7F8FA]">
      <div className="footer-wrapper pt-4">
        <div className="footer-main-centent">
          <div className="custom-container">
            <div className="footer-cta-section rx-newsletter relative z-3 -mb-30 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2443C9] via-[#3A64F6] to-[#5B7BFF] px-6 py-9 shadow-[0_30px_60px_-30px_rgba(11,20,55,0.7)] ring-1 ring-white/15 md:px-10 md:py-12 lg:-mb-20 xl:px-14">
              <span className="pointer-events-none absolute -right-20 -top-24 h-[340px] w-[340px] rounded-full border-[40px] border-white/[0.06]" aria-hidden />
              <span className="pointer-events-none absolute -bottom-24 right-[30%] h-[220px] w-[220px] rounded-full border-[26px] border-white/[0.05]" aria-hidden />
              <span className="pointer-events-none absolute -left-24 top-1/2 h-[260px] w-[260px] -translate-y-1/2 rounded-full bg-[#5B7BFF] opacity-30 blur-[90px]" aria-hidden />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
                <div className="sl-white">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] ring-1 ring-white/20">
                    <Mail size={14} /> Newsletter
                  </span>
                  <h2 className="mt-4 font-primary text-[26px] font-bold leading-[118%] tracking-[-0.01em] md:text-[34px]">
                    Abonnieren Sie unseren Newsletter
                  </h2>
                  <p className="mt-3 max-w-[520px] font-secondary !text-[15px] !leading-[160%] !tracking-normal opacity-85 md:!text-[17px]">
                    Bleiben Sie auf dem Laufenden mit exklusiven Angeboten
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {['Preis-Tipps zur Saison', 'Neue Reifentests', 'Kein Spam'].map(t => (
                      <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1.5 text-[13px] ring-1 ring-white/15">
                        <Check size={14} strokeWidth={3} /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[22px] bg-white/[0.08] p-4 ring-1 ring-white/20 backdrop-blur md:p-5">
                  <form onSubmit={handleSubmit} className="reifexa-subscription-form flex w-full flex-col gap-3 sm:flex-row">
                    <label htmlFor="footer-newsletter-email" className="sr-only">E-Mail-Adresse</label>
                    <div className="relative flex-1 overflow-hidden rounded-[14px] bg-white">
                      <Mail size={18} color="#9AA0A8" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        id="footer-newsletter-email"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Ihre E-Mail-Adresse"
                        autoComplete="email"
                        className="h-[52px] w-full !rounded-none !border-0 bg-transparent pl-11 pr-4 font-secondary text-[15px] !text-[#16171A] !shadow-none !outline-none placeholder:!text-[#9AA0A8]"
                        disabled={loading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`group inline-flex h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-gradient-to-r from-[#4ADE80] to-[#22C55E] px-6 text-[15px] font-bold shadow-[0_12px_24px_-12px_rgba(34,197,94,0.8)] transition ${
                        loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:-translate-y-0.5'
                      }`}
                    >
                      <span className="!text-[#06281A]">{loading ? 'Wird gesendet …' : 'Abonnieren'}</span>
                      {!loading && <ArrowRight size={17} strokeWidth={2.6} color="#06281A" className="transition-transform group-hover:translate-x-0.5" />}
                    </button>
                  </form>
                  <p className="sl-white mt-3 flex items-start gap-2 px-1 !text-[12.5px] !leading-[150%] !tracking-normal opacity-75">
                    <ShieldCheck size={15} className="mt-[1px] shrink-0" />
                    <span>
                      Mit dem Abonnieren akzeptieren Sie unsere{' '}
                      <Link href="/impressum-datenschutz" className="underline underline-offset-2">Datenschutzerklärung</Link>.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-main-box relative overflow-hidden bg-gradient-to-b from-[#0B1437] to-[#101C4A] pt-30 lg:pt-20">
            <span className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full border-[50px] border-white/[0.04]" aria-hidden />
            <div className="custom-container relative pb-8 pt-14 md:pt-16">
              <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
                <div>
                  <Link href="/" className="inline-block overflow-hidden rounded-[14px] bg-white p-1.5" aria-label="Reifexa.de Startseite">
                    <Image src="/images/reifexa_de_logo_sm.png" alt="Reifexa.de" width={150} height={58} loading="lazy" className="h-auto w-[140px] md:w-[150px]" />
                  </Link>
                  <p className="sl-white mt-4 max-w-[360px] !text-[15px] !leading-[165%] !tracking-normal opacity-75">
                    Unabhängiger Reifenpreisvergleich für Deutschland – Händlerpreise inkl. Versand, Preisverlauf und Preisalarm.
                  </p>
                  <div className="mt-5 grid max-w-[380px] grid-cols-3 gap-2">
                    {[
                      ['Mehrmals', 'täglich neue Preise'],
                      ['Kostenlos', 'für alle Nutzer'],
                      ['Direkt', 'beim Händler kaufen'],
                    ].map(([v, l]) => (
                      <div key={v} className="sl-white rounded-[12px] bg-white/[0.06] px-3 py-2.5 ring-1 ring-white/10">
                        <p className="!text-[15px] font-bold !leading-none !tracking-normal">{v}</p>
                        <p className="mt-1 !text-[11px] !leading-tight !tracking-normal opacity-70">{l}</p>
                      </div>
                    ))}
                  </div>
                  <ul className="mt-5 flex gap-2.5">
                    {[
                      ['https://facebook.com/reifexa.de', '/images/facebook-icon.png', 'Reifexa auf Facebook'],
                      ['https://www.instagram.com/reifexa.de', '/images/instagram-icon.png', 'Reifexa auf Instagram'],
                      ['https://www.tiktok.com/@reifexa', '/images/tiktok.webp', 'Reifexa auf TikTok'],
                      ['https://www.youtube.com/@ReifexaDE', '/images/youtube.webp', 'Reifexa auf YouTube'],
                    ].map(([href, img, label]) => (
                      <li key={href}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-white/15"
                        >
                          <Image src={img} alt="" width={22} height={22} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                  {FOOTER_COLUMNS.map(([title, links]) => (
                    <div key={title}>
                      <h3 className="sl-white mb-4 !text-[12px] font-bold uppercase tracking-[0.14em] opacity-60">{title}</h3>
                      <ul className="space-y-2.5">
                        {links.map(([label, href]) => (
                          <li key={href}>
                            <Link href={href} className="sl-white !text-[15px] opacity-80 transition-opacity hover:opacity-100">
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-4 rounded-[18px] bg-white/[0.05] p-4 ring-1 ring-white/10 md:flex-row md:items-center md:justify-between">
                <ReviewSummary dark />
                <p className="sl-white flex items-start gap-2 !text-[13px] !leading-[150%] !tracking-normal opacity-70">
                  <BadgeCheck size={16} className="mt-[1px] shrink-0" />
                  Hinweis: Für Käufe über unsere Links erhalten wir ggf. eine Provision – der Preis bleibt für Sie gleich.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
                <p className="sl-white !text-[13px] !tracking-normal opacity-60">
                  © {new Date().getFullYear()} reifexa.de · Alle Rechte vorbehalten.
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
                  <li><Link href="/impressum-datenschutz" className="sl-white opacity-80 hover:opacity-100">Impressum &amp; Datenschutz</Link></li>
                  <li><Link href="/AGB" className="sl-white opacity-80 hover:opacity-100">AGB</Link></li>
                  <li><Link href="/auto-api" className="sl-white opacity-80 hover:opacity-100">Auto-API</Link></li>
                  <li>
                    <a href="http://convertalinktest.awin.com" title="AWIN Convert-a-Link Test" className="sl-white opacity-80 hover:opacity-100">
                      AWIN Affiliate
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
