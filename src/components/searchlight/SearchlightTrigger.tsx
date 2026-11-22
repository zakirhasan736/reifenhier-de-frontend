'use client';

import { Sparkles } from 'lucide-react';
import { openSearchlight } from './api';

/** Eye-catching Searchlight entry: homepage banner and listing sidebar. */
export default function SearchlightTrigger({ variant = 'banner' }: { variant?: 'banner' | 'sidebar' }) {
  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={() => openSearchlight({ mode: 'start' })}
        className="searchlight-sidebar group relative w-full overflow-hidden rounded-[14px] border border-primary-100/30 bg-gradient-to-br from-[#EEF2FF] to-white p-4 text-left mb-4 cursor-pointer"
      >
        <span className="flex items-center gap-2 text-[15px] font-semibold text-[#16171A]">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-white">
            <span className="absolute inset-0 rounded-full bg-primary-100 opacity-60 motion-safe:animate-ping" aria-hidden />
            <Sparkles size={16} className="relative" color="#fff" />
          </span>
          Searchlight
        </span>
        <span className="mt-2 block text-[13px] leading-[150%] text-[#4B4F58]">
          Unsicher, welcher Reifen passt? Ich frage kurz nach und zeige dir die 3 besten.
        </span>
        <span className="mt-2 inline-block text-[13px] font-semibold text-primary-100 group-hover:underline">
          Hilf mir wählen →
        </span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => openSearchlight({ mode: 'start' })}
      className="searchlight-banner group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5B3DF5] to-primary-100 px-4 py-2 text-[13px] md:text-[14px] font-semibold text-white shadow-[0_6px_20px_rgba(58,100,246,0.35)] cursor-pointer"
    >
      <span className="absolute -inset-1 rounded-full bg-primary-100/40 motion-safe:animate-pulse" aria-hidden />
      <span className="sl-white relative inline-flex items-center gap-2">
        <Sparkles size={16} color="#fff" />
        Searchlight · Größe unbekannt? Ich finde sie
      </span>
    </button>
  );
}
