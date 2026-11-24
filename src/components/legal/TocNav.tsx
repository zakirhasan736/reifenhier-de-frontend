'use client';

import { useEffect, useState } from 'react';

export type TocItem = { id: string; text: string };

/** Table of contents that highlights the section currently on screen. */
export default function TocNav({
  items,
  numbered = false,
  className = '',
}: {
  items: TocItem[];
  numbered?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(items[0]?.id || '');

  useEffect(() => {
    const els = items
      .map(i => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => seen.set(e.target.id, e.isIntersecting));
        const first = items.find(i => seen.get(i.id));
        if (first) setActive(first.id);
      },
      { rootMargin: '-96px 0px -60% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <ol className={`space-y-0.5 ${className}`}>
      {items.map((t, i) => {
        const on = t.id === active;
        return (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              onClick={() => setActive(t.id)}
              aria-current={on ? 'location' : undefined}
              className={`group flex items-start gap-2.5 rounded-[10px] px-2.5 py-1.5 text-[13.5px] leading-snug transition-colors ${
                on ? 'bg-[#EEF2FF] font-semibold !text-[#2F4FD8]' : '!text-[#4B5163] hover:bg-[#F6F8FC] hover:!text-[#2F4FD8]'
              }`}
            >
              {numbered && (
                <span
                  className={`mt-[1px] inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                    on ? 'sl-white bg-[#2F4FD8]' : 'bg-[#EEF0F6] !text-[#6B7280] group-hover:bg-[#DCE3FF]'
                  }`}
                >
                  {i + 1}
                </span>
              )}
              <span className="!text-inherit">{t.text}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
