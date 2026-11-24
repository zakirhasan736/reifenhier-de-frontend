/** Reifexa Auto-API: plans and figures (backend /api/fitment). */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de').replace(/\/$/, '');
export const FITMENT_V1 = `${API_BASE}/api/fitment/v1`;

export type PlanId = 'free' | 'pro' | 'advanced';
export type Plan = {
  name: string;
  price: number;
  priceYearly: number;
  models: number | null;
  ips: number;
  daily: number;
  bySize: boolean;
  indexes: boolean;
  commercial: boolean;
  features: string[];
};
export type PlanCatalog = { plans: Record<PlanId, Plan>; termsVersion: string };

/** Same as backend src/api/fitment/data.js – shown when the API is unreachable. */
export const FALLBACK_CATALOG: PlanCatalog = {
  termsVersion: '2026-11-25',
  plans: {
    free: {
      name: 'Free', price: 0, priceYearly: 0, models: 50, ips: 1, daily: 100, bySize: false, indexes: false, commercial: false,
      features: ['Die 50 häufigsten Modelle in Deutschland', 'Alle Generationen mit Baujahren', 'Reifengrößen je Achse', '100 Anfragen pro Tag', '1 Server-IP', 'Zum Testen und für private Projekte'],
    },
    pro: {
      name: 'Pro', price: 29, priceYearly: 290, models: 500, ips: 2, daily: 2500, bySize: true, indexes: true, commercial: true,
      features: ['Die 500 häufigsten Modelle', 'Suche nach Reifengröße („Welche Autos fahren 205/55 R16?“)', 'Last- und Geschwindigkeitsindex', '2.500 Anfragen pro Tag', '2 Server-IPs', 'Kommerzielle Nutzung in eigenen Shops und Apps'],
    },
    advanced: {
      name: 'Advanced', price: 79, priceYearly: 790, models: null, ips: 5, daily: 10000, bySize: true, indexes: true, commercial: true,
      features: ['Alle Modelle der Datenbank, auch seltene', 'Suche nach Reifengröße', 'Last- und Geschwindigkeitsindex', 'Kennzeichnung geprüfter Datensätze', '10.000 Anfragen pro Tag', '5 Server-IPs', 'Priorisierter Support & Datenkorrekturen'],
    },
  },
};

export async function fetchPlanCatalog(): Promise<PlanCatalog> {
  try {
    const r = await fetch(`${API_BASE}/api/fitment/plans`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(4000) });
    if (!r.ok) return FALLBACK_CATALOG;
    const j = (await r.json()) as PlanCatalog;
    // an older backend may still send the short plan objects
    const ok = j?.plans && (['free', 'pro', 'advanced'] as PlanId[]).every(id => Array.isArray(j.plans[id]?.features));
    return ok ? j : { ...FALLBACK_CATALOG, termsVersion: j?.termsVersion || FALLBACK_CATALOG.termsVersion };
  } catch {
    return FALLBACK_CATALOG;
  }
}

export type FitmentStats = { models: number; reviewed: number; variants: number; records: number; sizes: number };
export async function fetchFitmentStats(): Promise<FitmentStats | null> {
  try {
    const r = await fetch(`${API_BASE}/api/fitment/stats`, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(4000) });
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}

export const PLAN_IDS: PlanId[] = ['free', 'pro', 'advanced'];
export const modelsLabel = (p: Plan) => (p.models ? `Top ${p.models.toLocaleString('de-DE')}` : 'Alle');
export const eur = (n: number) => `${n.toLocaleString('de-DE')} €`;
/** "1.234" when we have data, otherwise null (show text instead of 0). */
export const count = (n?: number) => (n && n > 0 ? n.toLocaleString('de-DE') : null);
