/** Title length budget: SEO tools flag > 70 chars, Google cuts at ~600 px (≈ 60–65 chars). */
export const TITLE_MAX = 65;
/** Hard limit for titles without the brand suffix. */
export const TITLE_HARD_MAX = 70;

const TRAILING = /[\s,:;–—\-|&]+$|\s+(und|oder|die|der|das|den|mit|für|im|in|bei|zu|auf|von|wie|was|–)$/i;

/** Cut at a word boundary and drop dangling connectors ("…, Modelle prüfen und die" → "…, Modelle prüfen"). */
export function cutWords(text: string, max = TITLE_MAX): string {
  let t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  t = t.slice(0, max + 1);
  t = t.slice(0, Math.max(t.lastIndexOf(' '), 1));
  // prefer a clause boundary (", " / " und " / " – " / ": ") so no half phrase is left
  let cut = -1;
  for (const m of `${t} `.matchAll(/,\s|\s(?:und|oder)\s|\s[–—]\s|:\s/g)) {
    if ((m.index ?? 0) >= 30) cut = m.index ?? -1;
  }
  if (cut > 0) t = t.slice(0, cut);
  let prev = '';
  while (prev !== t) {
    prev = t;
    t = t.replace(TRAILING, '').trim();
  }
  return t;
}

/** "Main | Reifexa" when it fits, else "Main", else Main shortened at a word boundary. */
export function fitTitle(main: string, suffix = ' | Reifexa', max = TITLE_MAX): string {
  const t = String(main || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (!t) return suffix.replace(/^\s*\|\s*/, '');
  if ((t + suffix).length <= max) return t + suffix;
  if (t.length <= TITLE_HARD_MAX) return t;
  // drop a trailing segment ("… achten? 2026" → "… achten?", "A: B – C" → "A: B")
  const m = /^(.{30,}?[?!])\s+\S.*$|^(.{30,})\s+[–—:|]\s+[^–—:|]+$/.exec(t);
  const head = m ? (m[1] || m[2]).trim() : '';
  if (head && head.length <= TITLE_HARD_MAX) return head;
  return cutWords(t, max);
}
