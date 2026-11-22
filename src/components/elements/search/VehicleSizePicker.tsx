'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { carSizes, type CarResult, type CarSize } from '@/components/searchlight/api';
import { CAR_MODELS } from '@/components/searchlight/carModels';

const vehicles = Object.entries(CAR_MODELS).flatMap(([make, models]) =>
  models.map(model => ({ make, model, label: `${make} ${model}` })),
);
type Vehicle = typeof vehicles[number];

function searchText(text: string) {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/\bvolkswagen\b/g, 'vw').replace(/\bmercedes[- ]benz\b/g, 'mercedes')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

export default function VehicleSizePicker({ onSize, selectedSize }: {
  onSize: (size: CarSize) => void;
  selectedSize: string;
}) {
  const [query, setQuery] = useState('');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [year, setYear] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<CarResult | null>(null);
  const [message, setMessage] = useState('');
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);

  const words = searchText(query).split(' ').filter(Boolean);
  const matches = words.length ? vehicles.filter(candidate => {
    const label = searchText(candidate.label);
    return words.every(word => label.includes(word));
  }).slice(0, 8) : [];

  function clearResult() {
    pending.current?.abort();
    setBusy(false);
    setResult(null);
    setMessage('');
  }

  async function findSizes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selected = vehicle ?? matches.find(candidate => searchText(candidate.label) === searchText(query));
    if (!selected) return;
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setVehicle(selected);
    setQuery(selected.label);
    setBusy(true);
    setMessage('');
    setResult(null);
    try {
      const response = await carSizes({ make: selected.make, model: selected.model, year }, controller.signal);
      if (controller.signal.aborted) return;
      if (response.error || !response.sizes?.length) {
        setMessage('Keine Reifengrößen gefunden. Prüfe die Größe im CoC oder auf der Reifenflanke und nutze „Nach Größe“.');
      } else {
        setResult(response);
      }
    } catch {
      if (!controller.signal.aborted) setMessage('Die Fahrzeugsuche ist gerade nicht erreichbar. Bitte versuche es erneut.');
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return <form className="space-y-3" onSubmit={findSizes}>
    <label className="block text-[13px] font-semibold">
      Marke und Modell
      <input
        className="mt-1 w-full rounded-[9px] border border-[#E4E7EE] p-2 text-[14px] font-normal"
        type="search" maxLength={100} placeholder="z. B. VW Golf"
        autoComplete="off" value={query}
        onChange={event => {
          clearResult();
          setVehicle(null);
          setQuery(event.target.value);
        }}
      />
    </label>
    {!vehicle && words.length > 0 && (matches.length ? <ul aria-label="Fahrzeugvorschläge" className="max-h-48 overflow-y-auto rounded-[9px] border border-[#E4E7EE]">
      {matches.map(match => <li key={match.label}>
        <button type="button" className="w-full px-3 py-1.5 text-left text-sm hover:bg-[#F5F8FF] focus-visible:bg-[#F5F8FF]"
          onClick={() => {
            clearResult();
            setVehicle(match);
            setQuery(match.label);
          }}>{match.label}</button>
      </li>)}
    </ul> : <p className="text-xs" role="status">Kein Modell gefunden.</p>)}
    <label className="block text-[13px] font-semibold">
      Baujahr (optional)
      <input
        className="mt-1 w-full rounded-[9px] border border-[#E4E7EE] p-2 text-[14px] font-normal"
        inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="z. B. 2020" value={year}
        onChange={event => {
          clearResult();
          setYear(event.target.value);
        }}
      />
    </label>
    <button type="submit" disabled={busy || (!vehicle && !matches.some(candidate => searchText(candidate.label) === searchText(query)))}
      className="w-full rounded-[9px] bg-primary-100 py-2 text-sm font-semibold text-white disabled:opacity-50">
      {busy ? 'Suche läuft …' : 'Reifengrößen finden'}
    </button>
    {message && <p className="text-xs" role="status">{message}</p>}
    {result?.sizes && <fieldset className="space-y-2">
      <legend className="text-[13px] font-semibold">{result.source === 'ai' ? 'KI-Vorschläge' : 'Reifengrößen nach Fahrzeug'}</legend>
      <div className="flex flex-wrap gap-2">
        {result.sizes.map(size => {
          const label = `${size.width}/${size.height} R${size.diameter}`;
          const pressed = selectedSize === label;
          return <button key={label} type="button" aria-pressed={pressed} onClick={() => onSize(size)}
            className={`rounded-[9px] border px-2 py-1 text-sm ${pressed ? 'border-primary-100 bg-[#F5F8FF] text-primary-100' : 'border-[#E4E7EE]'}`}>
            {label}
          </button>;
        })}
      </div>
      <p className="text-xs text-[#585D68]">{result.note || 'Bitte die Größe und Fahrzeugfreigabe vor dem Kauf prüfen.'}</p>
    </fieldset>}
  </form>;
}
