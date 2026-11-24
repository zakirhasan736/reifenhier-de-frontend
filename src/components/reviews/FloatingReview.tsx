'use client';

/**
 * Floating "Bewertung abgeben" tab + smart nudge + review dialog.
 * - Tab on the right edge with the current average rating, pulses a few times.
 * - Nudge bubble once per session: after ~60 s on the site, or when the visitor
 *   comes back to the tab after opening a shop. "Nicht jetzt" → 14 days quiet,
 *   after a sent review → 90 days quiet (tab stays available).
 * - Dialog: big stars with labels, Bewertung / Fehler melden, quick chips.
 * Backend: POST /api/reviews { kind: 'satisfaction' | 'bug', rating 1–5, message }.
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Bug, CheckCircle2, Heart, Loader2, Send, Star, X } from 'lucide-react';

const api = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');
const QUIET_KEY = 'rx_review_quiet_until';
const SESSION_KEY = 'rx_review_nudged';
const LABELS = ['', 'Schlecht', 'Geht so', 'Okay', 'Gut', 'Hervorragend'];
const CHIPS = {
  satisfaction: ['Gute Preise', 'Einfache Suche', 'Viele Shops', 'Übersichtlich', 'Schnelle Seite', 'Hilfreiche Infos'],
  bug: ['Seite lädt nicht', 'Falscher Preis', 'Link zum Shop', 'Filter / Suche', 'Darstellung mobil', 'Sonstiges'],
};

const get = (store: 'local' | 'session', k: string) => {
  try {
    return (store === 'local' ? localStorage : sessionStorage).getItem(k);
  } catch {
    return null;
  }
};
const set = (store: 'local' | 'session', k: string, v: string) => {
  try {
    (store === 'local' ? localStorage : sessionStorage).setItem(k, v);
  } catch {
    /* storage blocked */
  }
};
const quietFor = (days: number) => set('local', QUIET_KEY, String(Date.now() + days * 864e5));
const isQuiet = () => Number(get('local', QUIET_KEY) || 0) > Date.now();

function Stars({ value, hover, onPick, onHover, size = 36 }: { value: number; hover: number; onPick: (v: number) => void; onHover: (v: number) => void; size?: number }) {
  const shown = hover || value;
  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Bewertung in Sternen" onMouseLeave={() => onHover(0)}>
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          aria-label={`${v} von 5 Sternen – ${LABELS[v]}`}
          onMouseEnter={() => onHover(v)}
          onFocus={() => onHover(v)}
          onBlur={() => onHover(0)}
          onClick={() => onPick(v)}
          className="rounded-[10px] p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] cursor-pointer"
        >
          <Star size={size} strokeWidth={1.6} color={v <= shown ? '#F59E0B' : '#C9CFDB'} fill={v <= shown ? '#FBBF24' : 'none'} />
        </button>
      ))}
    </div>
  );
}

export default function FloatingReview() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<'' | 'sending' | 'done' | 'error'>('');
  const [kind, setKind] = useState<'satisfaction' | 'bug'>('satisfaction');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [chips, setChips] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [nudge, setNudge] = useState(false);
  const [nudgeHover, setNudgeHover] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [summary, setSummary] = useState<{ average: number | null; count: number } | null>(null);

  // average rating for the tab (social proof)
  useEffect(() => {
    const c = new AbortController();
    fetch(`${api}/api/reviews/summary`, { signal: c.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => {
        if (b && typeof b.count === 'number' && (b.average === null || typeof b.average === 'number')) setSummary(b);
      })
      .catch(() => {});
    return () => c.abort();
  }, []);

  // pulse a few times, nudge once per session
  useEffect(() => {
    if (isQuiet()) return;
    const p = window.setTimeout(() => setPulse(true), 6000);
    const p2 = window.setTimeout(() => setPulse(false), 6000 + 3 * 2400);
    if (get('session', SESSION_KEY)) return () => { clearTimeout(p); clearTimeout(p2); };
    const show = () => {
      if (isQuiet() || get('session', SESSION_KEY) || dialog.current?.open) return;
      set('session', SESSION_KEY, '1');
      setNudge(true);
    };
    const timer = window.setTimeout(show, 60000);
    // back from a shop tab (vendor exit opens a new tab)
    let leftForShop = false;
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.('a.vendor-exit-cue, a[href^="/to?"]')) leftForShop = true;
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible' && leftForShop) window.setTimeout(show, 1500);
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(p);
      clearTimeout(p2);
      clearTimeout(timer);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const open = useCallback((preset?: number) => {
    setNudge(false);
    setPulse(false);
    if (preset) setRating(preset);
    if (state === 'done') {
      setState('');
      setMessage('');
      setChips([]);
    }
    dialog.current?.showModal();
  }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending' || !rating) return;
    const text = [chips.join(', '), message.trim()].filter(Boolean).join(' – ');
    if (!text) return;
    setState('sending');
    try {
      const response = await fetch(`${api}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, rating, message: text.slice(0, 2000) }),
      });
      if (response.ok) {
        setState('done');
        quietFor(90);
      } else setState('error');
    } catch {
      setState('error');
    }
  }

  const canSend = rating > 0 && (chips.length > 0 || message.trim().length > 0);
  const avg = summary?.average != null && summary.count > 0 ? summary.average.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '';

  return (
    <>
      {/* floating tab */}
      <button
        type="button"
        onClick={() => open()}
        aria-label="Bewertung abgeben"
        className={`rx-review-tab group fixed right-0 top-[40%] z-[800] flex flex-col items-center gap-2 rounded-l-[16px] bg-gradient-to-b from-[#4F46E5] via-[#3A64F6] to-[#2563EB] px-2 py-3.5 shadow-[-8px_10px_28px_-10px_rgba(58,100,246,0.65)] transition-[padding,transform] duration-200 hover:pr-3 print:hidden cursor-pointer ${pulse ? 'rx-review-pulse' : ''}`}
      >
        <span className="sl-white inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
          <Star size={15} fill="#FDE68A" color="#FDE68A" />
        </span>
        <span className="sl-white text-[12px] font-semibold uppercase tracking-[0.16em] [writing-mode:vertical-rl] rotate-180">Bewertung abgeben</span>
        {avg ? <span className="sl-white rounded-full bg-white/20 px-1.5 py-0.5 text-[10.5px] font-bold tabular-nums">{avg}</span> : null}
      </button>

      {/* smart nudge */}
      {nudge ? (
        <div className="rx-review-nudge fixed right-14 top-[36%] z-[801] w-[272px] rounded-[18px] bg-white p-4 shadow-[0_24px_60px_-20px_rgba(22,23,26,0.45)] ring-1 ring-black/5 print:hidden max-sm:right-12 max-sm:w-[240px]" role="dialog" aria-label="Kurze Bewertung">
          <button type="button" onClick={() => { setNudge(false); quietFor(14); }} className="absolute right-2 top-2 rounded-full p-1 text-[#9AA1B2] hover:bg-[#F2F3F5] cursor-pointer" aria-label="Nicht jetzt">
            <X size={15} />
          </button>
          <p className="pr-5 text-[15px] font-bold text-[#16171A]">Wie gefällt Ihnen Reifexa?</p>
          <p className="mt-0.5 text-[12.5px] text-[#5A6072]">Ein Klick hilft uns sehr – dauert 10 Sekunden.</p>
          <div className="mt-3">
            <Stars value={0} hover={nudgeHover} onHover={setNudgeHover} onPick={(v) => open(v)} size={30} />
          </div>
          <p className="mt-1 h-4 text-[12px] font-semibold text-[#D97706]">{LABELS[nudgeHover]}</p>
          <button type="button" onClick={() => { setNudge(false); quietFor(14); }} className="mt-1 text-[12px] text-[#8A90A2] hover:underline cursor-pointer">Nicht jetzt</button>
        </div>
      ) : null}

      {/* dialog */}
      <dialog
        ref={dialog}
        aria-labelledby="review-title"
        onClose={() => setHover(0)}
        className="rx-review-dialog m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-[480px] overflow-y-auto rounded-[24px] bg-white p-0 text-[#16171A] shadow-[0_40px_80px_-24px_rgba(15,23,42,0.55)] backdrop:bg-[#0B1020]/55 backdrop:backdrop-blur-[3px]"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#3730A3] to-[#3A64F6] px-6 pb-6 pt-5">
          <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full border-[16px] border-white/10" aria-hidden />
          <button type="button" className="sl-white absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer" aria-label="Schließen" onClick={() => dialog.current?.close()}>
            <X size={18} />
          </button>
          <span className="sl-white inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/15 ring-1 ring-white/25">
            {kind === 'bug' ? <Bug size={22} /> : <Heart size={22} />}
          </span>
          <h2 id="review-title" className="sl-white mt-3 text-[22px] font-bold tracking-[0.01em]">
            {state === 'done' ? 'Vielen Dank!' : kind === 'bug' ? 'Fehler melden' : 'Wie gefällt Ihnen Reifexa?'}
          </h2>
          <p className="sl-white mt-1 text-[13.5px] opacity-85">
            {state === 'done' ? 'Ihr Feedback hilft uns, Reifexa besser zu machen.' : 'Ihre ehrliche Meinung – anonym und in wenigen Sekunden.'}
          </p>
          {avg && state !== 'done' ? (
            <p className="sl-white mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
              <Star size={13} fill="#FDE68A" color="#FDE68A" /> {avg} / 5 aus {summary?.count.toLocaleString('de-DE')} Bewertungen
            </p>
          ) : null}
        </div>

        {state === 'done' ? (
          <div className="px-6 py-8 text-center" role="status">
            <span className="rx-review-check mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F7EE]">
              <CheckCircle2 size={36} color="#16A34A" />
            </span>
            <p className="mt-4 text-[15px] text-[#404042]">Ihr Feedback wurde gespeichert.</p>
            <button type="button" onClick={() => dialog.current?.close()} className="sl-white mt-6 rounded-[12px] bg-[#3A64F6] px-6 py-3 text-[14.5px] font-semibold cursor-pointer">
              Schließen
            </button>
          </div>
        ) : (
          <form className="space-y-5 px-6 py-5" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-1 rounded-[14px] bg-[#F1F3F8] p-1" role="tablist" aria-label="Art des Feedbacks">
              {(['satisfaction', 'bug'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={kind === k}
                  onClick={() => { setKind(k); setChips([]); }}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-[10px] py-2 text-[13.5px] font-semibold transition-colors cursor-pointer ${kind === k ? 'bg-white text-[#3A64F6] shadow-sm' : 'text-[#5A6072]'}`}
                >
                  {k === 'bug' ? <Bug size={15} /> : <Star size={15} />} {k === 'bug' ? 'Fehler melden' : 'Bewertung'}
                </button>
              ))}
            </div>

            <div>
              <p className="text-[13.5px] font-semibold text-[#2B3040]">{kind === 'bug' ? 'Wie zufrieden sind Sie insgesamt?' : 'Ihre Bewertung'} *</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Stars value={rating} hover={hover} onHover={setHover} onPick={setRating} />
                <span className="min-w-[96px] text-[14px] font-semibold text-[#D97706]">{LABELS[hover || rating]}</span>
              </div>
            </div>

            <div>
              <p className="text-[13.5px] font-semibold text-[#2B3040]">{kind === 'bug' ? 'Was ist passiert?' : 'Was gefällt Ihnen?'}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CHIPS[kind].map((c) => {
                  const on = chips.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setChips((x) => (on ? x.filter((y) => y !== c) : [...x, c]))}
                      className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium ring-1 transition-colors cursor-pointer ${on ? 'sl-white bg-[#3A64F6] ring-transparent' : 'bg-white text-[#2B3040] ring-[#DDE2EE] hover:ring-[#A5B4FC]'}`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="text-[13.5px] font-semibold text-[#2B3040]">{kind === 'bug' ? 'Beschreibung' : 'Ihr Kommentar'} <span className="font-normal text-[#8A90A2]">(optional)</span></span>
              <textarea
                name="message"
                rows={3}
                maxLength={1800}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={kind === 'bug' ? 'Auf welcher Seite? Was haben Sie erwartet?' : 'Was können wir noch besser machen?'}
                className="!border-0 mt-1.5 block w-full resize-none rounded-[14px] bg-[#F7F8FB] px-3.5 py-3 text-[14.5px] ring-1 ring-[#E4E7F0] placeholder:text-[#9AA1B2] focus:outline-none focus:ring-2 focus:ring-[#3A64F6]"
              />
              <span className="mt-1 block text-right text-[11px] text-[#9AA1B2]">{message.length} / 1800</span>
            </label>

            <button
              disabled={!canSend || state === 'sending'}
              className="sl-white flex w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#4F46E5] to-[#3A64F6] py-3.5 text-[15px] font-semibold shadow-[0_12px_28px_-10px_rgba(58,100,246,0.7)] transition-opacity disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed"
            >
              {state === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
              {state === 'sending' ? 'Wird gesendet …' : 'Feedback senden'}
            </button>
            {!canSend ? <p className="-mt-2 text-center text-[12px] text-[#8A90A2]">Bitte Sterne wählen und ein Stichwort oder einen Kommentar angeben.</p> : null}
            {state === 'error' ? <p role="alert" className="rounded-[12px] bg-[#FEF2F2] p-3 text-[13px] text-[#B91C1C]">Das Feedback wurde nicht gespeichert. Bitte versuchen Sie es erneut.</p> : null}
          </form>
        )}
      </dialog>
    </>
  );
}
