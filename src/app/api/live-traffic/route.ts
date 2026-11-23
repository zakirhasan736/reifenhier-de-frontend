import { GoogleAuth } from 'google-auth-library';
import cities from 'all-the-cities';
import type { Activity, Traffic } from '@/components/live-traffic/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/analytics.readonly'] });
type Row = { dimensionValues?: { value: string }[]; metricValues: { value: string }[] };
type Report = { rows?: Row[] };
const count = (row?: Row) => Number(row?.metricValues[0]?.value ?? 0);
const label = (row: Row, index = 0) => row.dimensionValues?.[index]?.value ?? '';
const activities = (report: Report): Activity[] => (report.rows ?? []).map(row => ({ label: label(row), count: count(row) }));
const normalize = (name: string) => name.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
let locations: Map<string, [number, number] | null> | undefined;

function cityPoint(country: string, name: string) {
  if (!locations) {
    locations = new Map();
    for (const city of cities) {
      const key = countryKey(city.country, city.name);
      const [lng, lat] = city.loc.coordinates;
      const previous = locations.get(key);
      if (previous === undefined) locations.set(key, [lat, lng]);
      else if (previous && (Math.abs(previous[0] - lat) > 0.2 || Math.abs(previous[1] - lng) > 0.2)) locations.set(key, null);
    }
  }
  return locations.get(countryKey(country, name)) ?? null;
}
function countryKey(country: string, name: string) {
  return country + '/' + normalize(name);
}

let snapshot: Traffic | undefined;
let pending: Promise<Traffic> | undefined;
let retryAfter = 0;
let acquisition: Activity[] | null = null;
let acquisitionDue = 0;

async function load(property: string): Promise<Traffic> {
  const client = await auth.getClient();
  const stream = process.env.GA4_STREAM_ID;
  async function report(method: string, dimensions: string[], metric: string, options: Record<string, unknown> = {}) {
    const response = await client.request<Report>({
      method: 'POST', timeout: 10000,
      url: `https://analyticsdata.googleapis.com/v1beta/properties/${property}:${method}`,
      data: {
        dimensions: dimensions.map(name => ({ name })), metrics: [{ name: metric }],
        ...(stream ? { dimensionFilter: { filter: { fieldName: 'streamId', stringFilter: { value: stream, matchType: 'EXACT' } } } } : {}),
        ...options,
      },
    });
    return response.data;
  }
  const top = (metricName: string, limit: number) => ({ limit, orderBys: [{ metric: { metricName }, desc: true }] });
  const [total, five, geography, minuteReport, pages, sources] = await Promise.all([
    report('runRealtimeReport', [], 'activeUsers'),
    report('runRealtimeReport', [], 'activeUsers', { minuteRanges: [{ startMinutesAgo: 4, endMinutesAgo: 0 }] }),
    report('runRealtimeReport', ['countryId', 'city'], 'activeUsers', top('activeUsers', 10000)),
    report('runRealtimeReport', ['minutesAgo'], 'activeUsers'),
    report('runRealtimeReport', ['unifiedScreenName'], 'screenPageViews', top('screenPageViews', 5)),
    Date.now() < acquisitionDue ? acquisition : report('runReport', ['firstUserSourceMedium'], 'newUsers', {
      dateRanges: [{ startDate: '6daysAgo', endDate: 'today' }], ...top('newUsers', 5),
    }).then(activities).catch(() => null),
  ]);
  if (Date.now() >= acquisitionDue) {
    acquisition = sources;
    acquisitionDue = Date.now() + (sources ? 900000 : 60000);
  }
  const minutes = Array<number>(30).fill(0);
  for (const row of minuteReport.rows ?? []) {
    const ago = Number(label(row));
    if (Number.isInteger(ago) && ago >= 0 && ago < 30) minutes[29 - ago] = count(row);
  }
  return { updatedAt: new Date().toISOString(), last30: count(total.rows?.[0]), last5: count(five.rows?.[0]), minutes,
    cities: (geography.rows ?? []).map(row => {
      const country = label(row), name = label(row, 1);
      return { country, label: name, count: count(row), point: cityPoint(country, name) };
    }), pages: activities(pages), acquisition: sources };
}

export async function GET() {
  const property = process.env.GA4_PROPERTY_ID ?? '';
  if (/^\d+$/.test(property) && Date.now() >= retryAfter && (!snapshot || Date.now() - Date.parse(snapshot.updatedAt) >= 30000)) {
    pending ??= load(property).then(data => (snapshot = data)).catch(error => {
      retryAfter = Date.now() + 30000;
      console.error('[live-traffic] GA4 request failed', error?.response?.status || 'authentication or network');
      throw error;
    }).finally(() => { pending = undefined; });
    await pending.catch(() => {});
  }
  if (!snapshot || Date.now() - Date.parse(snapshot.updatedAt) > 90000) {
    return Response.json({ error: 'traffic_unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
  return Response.json(snapshot, { headers: { 'Cache-Control': 'public, max-age=10' } });
}
