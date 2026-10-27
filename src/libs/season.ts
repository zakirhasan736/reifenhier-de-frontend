/**
 * Which tyre season is "now" in Germany, by the common rule "von O bis O":
 * winter tyres from 1 October until Easter Sunday, summer tyres otherwise.
 * Uses the Europe/Berlin calendar date so it's correct for German visitors.
 */

/** Easter Sunday (Gregorian, Anonymous algorithm) → [month 1-12, day] */
export function easterSunday(year: number): [number, number] {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return [month, day];
}

function berlinDate(now: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find(p => p.type === t)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

export type SeasonCategory = 'Sommerreifen' | 'Winterreifen';

export function currentTyreSeason(now: Date = new Date()): SeasonCategory {
  const { year, month, day } = berlinDate(now);
  if (month >= 10) return 'Winterreifen'; // Oct–Dec
  const [em, ed] = easterSunday(year);
  const beforeEaster = month < em || (month === em && day < ed);
  return beforeEaster ? 'Winterreifen' : 'Sommerreifen';
}
