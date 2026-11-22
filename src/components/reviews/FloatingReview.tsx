'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Star, X } from 'lucide-react';

const api = process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de';

export default function FloatingReview() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState('');
  const [rating, setRating] = useState(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;
    const form = new FormData(event.currentTarget);
    setState('sending');
    try {
      const response = await fetch(`${api}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: form.get('kind'), rating, message: form.get('message') }),
      });
      setState(response.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  return <>
    <button type="button" className="fixed right-0 top-[42%] z-[800] rounded-l-xl border border-r-0 border-[#DCE3FB] bg-white px-2 py-3 text-xs font-semibold text-primary-100 shadow [writing-mode:vertical-rl] print:hidden"
      onClick={() => dialog.current?.showModal()}>
      Bewertung abgeben
    </button>
    <dialog ref={dialog} aria-labelledby="review-title"
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-5 text-[#16171A] shadow-xl backdrop:bg-slate-950/50">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 id="review-title" className="text-xl font-bold">Bewertung abgeben</h2>
        <button type="button" className="grid h-10 w-10 place-items-center rounded-full border" aria-label="Schließen" onClick={() => dialog.current?.close()}><X size={18} /></button>
      </div>
      {state === 'done' ? <p role="status">Vielen Dank. Ihr Feedback wurde gespeichert.</p> :
        <form className="grid gap-4" onSubmit={submit}>
          <label>Art des Feedbacks
            <select name="kind" required defaultValue="satisfaction" className="mt-1 block w-full rounded-lg border p-2">
              <option value="satisfaction">Zufriedenheit mit Reifexa</option>
              <option value="bug">Fehler melden</option>
            </select>
          </label>
          <fieldset>
            <legend>Bewertung *</legend>
            <div className="flex flex-wrap gap-1">
              {[1, 2, 3, 4, 5].map(value => <label key={value} className="relative cursor-pointer">
                <input className="peer sr-only" type="radio" name="rating" value={value} required checked={rating === value} onChange={() => setRating(value)} />
                <span className="grid h-10 w-10 place-items-center rounded peer-focus-visible:ring-2 peer-focus-visible:ring-primary-100">
                  <Star aria-hidden size={24} fill={value <= rating ? 'currentColor' : 'none'} className="text-amber-600" />
                  <span className="sr-only">{value} von 5 Sternen</span>
                </span>
              </label>)}
            </div>
          </fieldset>
          <label>Ihr Feedback *
            <textarea name="message" rows={4} maxLength={2000} required className="mt-1 block w-full rounded-lg border p-2" />
          </label>
          <button disabled={state === 'sending'} className="rounded-lg bg-primary-100 p-3 font-semibold text-white disabled:opacity-50">
            {state === 'sending' ? 'Wird gesendet …' : 'Feedback absenden'}
          </button>
          {state === 'error' && <p role="alert">Das Feedback wurde nicht gespeichert. Bitte versuchen Sie es erneut.</p>}
        </form>}
    </dialog>
  </>;
}
