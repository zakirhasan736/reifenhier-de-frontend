'use client';

/**
 * Live visitor map (GA4 realtime). Pulsing dots per city, three map styles,
 * click a dot or a city chip to fly there and see city / state / country,
 * "Straßenansicht" zooms to street level. Positions are approximate city
 * centres – Analytics never sends a visitor's exact location.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Globe2, Layers, LocateFixed, MapPin, Minus, Navigation, Plus, Satellite, X } from 'lucide-react';
import type { City } from './types';
import { countryCenter, placeLabel } from './countryCenters';

const GERMANY: L.LatLngExpression = [51.2, 10.4];
type Style = 'light' | 'streets' | 'satellite';
type Spot = City & { point: [number, number]; key: string; name: string };

const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services';
const STYLES: Record<Style, { label: string; layers: { url: string; pane?: string }[]; attribution: string }> = {
  light: {
    label: 'Light',
    layers: [{ url: `${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}` }, { url: `${ESRI}/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, pane: 'overlayPane' }],
    attribution: '© Esri, HERE, Garmin, © OpenStreetMap',
  },
  streets: {
    label: 'Streets',
    layers: [{ url: `${ESRI}/World_Street_Map/MapServer/tile/{z}/{y}/{x}` }],
    attribution: '© Esri, HERE, Garmin, © OpenStreetMap',
  },
  satellite: {
    label: 'Satellite',
    layers: [{ url: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}` }, { url: `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`, pane: 'overlayPane' }],
    attribution: '© Esri, Maxar, Earthstar Geographics',
  },
};

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' });
  } catch {
    return null;
  }
})();
const countryName = (code: string) => {
  try {
    return regionNames?.of(code.toUpperCase()) || countryCenter(code)?.name || code;
  } catch {
    return countryCenter(code)?.name || code;
  }
};

const flag = (code: string) =>
  /^[A-Za-z]{2}$/.test(code) ? String.fromCodePoint(...code.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0))) : '🌍';

function toSpots(cities: City[]): Spot[] {
  return cities.flatMap((city) => {
    if (city.count <= 0) return [];
    const point = city.point || countryCenter(city.country)?.point || null;
    if (!point) return [];
    const name = placeLabel(city.country, city.label, city.point);
    return [{ ...city, point, name, key: `${city.country}/${name}` }];
  });
}

function nearGermany(s: Spot) {
  if (s.country === 'DE') return true;
  return Math.abs(s.point[0] - 51.2) < 8 && Math.abs(s.point[1] - 10.4) < 12;
}

function Sparkline({ minutes }: { minutes: number[] }) {
  const max = Math.max(1, ...minutes);
  return (
    <div className="mt-3 flex h-10 items-end gap-[2px]" aria-label="Active users per minute, last 30 minutes">
      {minutes.map((v, i) => (
        <span
          key={i}
          className={`flex-1 rounded-t-[2px] ${i >= minutes.length - 5 ? 'bg-[#3A64F6]' : 'bg-[#3A64F6]/35'}`}
          style={{ height: `${Math.max(6, (100 * v) / max)}%` }}
          title={`${minutes.length - 1 - i} min ago: ${v}`}
        />
      ))}
    </div>
  );
}

export default function WorldMap({ cities, last30, last5, minutes }: { cities: City[]; last30: number; last5: number; minutes: number[] }) {
  const root = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tiles = useRef<L.LayerGroup | null>(null);
  const markers = useRef<L.LayerGroup | null>(null);
  const seen = useRef('');
  const [style, setStyle] = useState<Style>('streets');
  const [selected, setSelected] = useState<string>('');
  const [scrollZoom, setScrollZoom] = useState(false);

  const spots = useMemo(() => toSpots(cities), [cities]);
  const total = spots.reduce((n, s) => n + s.count, 0);
  const current = spots.find((s) => s.key === selected) || null;

  const fitAll = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const near = spots.filter(nearGermany);
    const target = near.length ? near : spots;
    if (!target.length) map.flyTo(GERMANY, 6, { duration: 0.8 });
    else if (target.length === 1) map.flyTo(target[0].point, 7, { duration: 0.8 });
    else {
      const narrow = map.getSize().x < 560
      map.flyToBounds(L.latLngBounds(target.map((s) => s.point)), {
        duration: 0.9,
        maxZoom: 7,
        // leave room for the panels: numbers top-left, chips at the bottom
        paddingTopLeft: narrow ? [24, 140] : [320, 90],
        paddingBottomRight: narrow ? [24, 70] : [90, 80],
      });
    }
  }, [spots]);

  const flyTo = useCallback((s: Spot, zoom = 11) => {
    setSelected(s.key);
    mapRef.current?.flyTo(s.point, zoom, { duration: 1.1 });
  }, []);

  // map setup
  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const map = L.map(container, { scrollWheelZoom: false, zoomControl: false, minZoom: 2, maxZoom: 18, zoomSnap: 0.25, attributionControl: true, maxBounds: [[-86, -200], [86, 200]] });
    map.setView(GERMANY, container.clientWidth < 560 ? 5 : 6);
    tiles.current = L.layerGroup().addTo(map);
    markers.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    map.on('click', () => {
      map.scrollWheelZoom.enable();
      setScrollZoom(true);
    });
    map.on('mouseout', () => {
      map.scrollWheelZoom.disable();
      setScrollZoom(false);
    });
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // tiles for the chosen style
  useEffect(() => {
    const map = mapRef.current;
    const group = tiles.current;
    if (!map || !group) return;
    group.clearLayers();
    for (const l of STYLES[style].layers) {
      L.tileLayer(l.url, { maxZoom: 19, maxNativeZoom: 18, ...(l.pane ? { pane: l.pane } : {}), attribution: l === STYLES[style].layers[0] ? STYLES[style].attribution : undefined }).addTo(group);
    }
  }, [style]);

  // markers
  useEffect(() => {
    const map = mapRef.current;
    const layer = markers.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const max = Math.max(1, ...spots.map((s) => s.count));
    const named = new Set([...spots].sort((a, b) => b.count - a.count).slice(0, 15).map((x) => x.key));
    for (const s of spots) {
      const size = Math.round(12 + 14 * Math.sqrt(s.count / max));
      const active = s.key === selected;
      const icon = L.divIcon({
        className: 'rx-live-pin',
        html: `<span class="rx-live-dot${active ? ' is-active' : ''}" style="width:${size}px;height:${size}px"><span class="rx-live-wave"></span><span class="rx-live-wave rx-live-wave-2"></span>${s.count > 1 ? `<b>${s.count}</b>` : ''}</span>${named.has(s.key) || active ? `<span class="rx-live-name">${s.name.replace(/[<>&"]/g, '')}</span>` : ''}`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const tip = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = s.name;
      const sub = document.createElement('span');
      sub.textContent = `${s.region ? `${s.region}, ` : ''}${countryName(s.country)} · ${s.count} active`;
      tip.append(strong, sub);
      L.marker(s.point, { icon, keyboard: false, zIndexOffset: active ? 1000 : 500, riseOnHover: true })
        .bindTooltip(tip, { direction: 'top', offset: [0, -size / 2 - 4], className: 'rx-live-label', opacity: 1 })
        .on('click', () => flyTo(s))
        .addTo(layer);
    }
    const signature = spots.map((s) => s.key).sort().join('|');
    if (signature !== seen.current) {
      seen.current = signature;
      map.invalidateSize();
      if (!selected) fitAll();
    }
  }, [spots, selected, fitAll, flyTo]);

  const btn = 'inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[#2B3040] hover:bg-[#F1F4FF] hover:text-[#3A64F6] cursor-pointer';
  const sorted = [...spots].sort((a, b) => b.count - a.count);

  return (
    <div className="absolute inset-0">
      <div ref={root} role="region" aria-label="Map of active visitors" className="rx-live-map absolute inset-0 z-0" />

      {/* live numbers */}
      <div className="pointer-events-auto absolute left-3 top-3 z-[500] w-[150px] rounded-[16px] bg-white/90 p-3 md:p-4 shadow-[0_18px_40px_-18px_rgba(22,23,26,0.45)] ring-1 ring-black/5 backdrop-blur-md md:left-4 md:top-4 md:w-[290px] md:rounded-[18px]">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3A64F6]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
          </span>
          Active now
        </div>
        <div className="mt-2 flex items-end gap-3 md:gap-4">
          <div>
            <p className="text-[30px] font-bold leading-none tabular-nums text-[#16171A] md:text-[38px]">{last30}</p>
            <p className="mt-1 text-[11.5px] text-[#6B6E76]">last 30 min</p>
          </div>
          <div className="pb-0.5">
            <p className="text-[18px] font-bold leading-none tabular-nums text-[#3A64F6] md:text-[22px]">{last5}</p>
            <p className="mt-1 text-[11.5px] text-[#6B6E76]">last 5 min</p>
          </div>
        </div>
        {minutes?.length ? <div className="max-md:hidden"><Sparkline minutes={minutes} /></div> : null}
      </div>

      {/* style switch + fit */}
      <div className="pointer-events-auto absolute right-3 top-3 z-[500] flex flex-col items-end gap-2 md:right-4 md:top-4">
        <div className="flex rounded-[14px] bg-white/90 p-1 shadow-[0_12px_30px_-14px_rgba(22,23,26,0.45)] ring-1 ring-black/5 backdrop-blur-md" role="group" aria-label="Map style">
          {(Object.keys(STYLES) as Style[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setStyle(k)}
              aria-pressed={style === k}
              className={`inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-[12.5px] font-semibold cursor-pointer ${style === k ? 'sl-white bg-[#3A64F6]' : 'text-[#404042] hover:text-[#3A64F6]'}`}
            >
              {k === 'satellite' ? <Satellite size={14} /> : k === 'streets' ? <Navigation size={14} /> : <Layers size={14} />}
              <span className="max-sm:hidden">{STYLES[k].label}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col rounded-[14px] bg-white/90 p-1 shadow-[0_12px_30px_-14px_rgba(22,23,26,0.45)] ring-1 ring-black/5 backdrop-blur-md">
          <button type="button" className={btn} onClick={() => mapRef.current?.zoomIn()} aria-label="Zoom in"><Plus size={17} /></button>
          <button type="button" className={btn} onClick={() => mapRef.current?.zoomOut()} aria-label="Zoom out"><Minus size={17} /></button>
          <button type="button" className={btn} onClick={() => { setSelected(''); fitAll(); }} aria-label="Show all visitors" title="Show all visitors"><Globe2 size={17} /></button>
        </div>
      </div>

      {/* selected city */}
      {current ? (
        <div className="pointer-events-auto absolute bottom-[68px] left-3 right-3 z-[600] rounded-[18px] bg-white/95 p-4 shadow-[0_22px_50px_-20px_rgba(22,23,26,0.5)] ring-1 ring-black/5 backdrop-blur-md md:bottom-auto md:right-auto md:left-4 md:top-[196px] md:w-[290px]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#EEF2FF] text-[20px]" aria-hidden>{flag(current.country)}</span>
              <div>
                <p className="text-[17px] font-bold leading-tight text-[#16171A]">{current.name}</p>
                <p className="mt-0.5 text-[12.5px] text-[#5A6072]">{[current.region, countryName(current.country)].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
            <button type="button" onClick={() => { setSelected(''); fitAll(); }} className="rounded-full p-1 text-[#8A90A2] hover:bg-[#F2F3F5] cursor-pointer" aria-label="Close"><X size={16} /></button>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[26px] font-bold leading-none tabular-nums text-[#3A64F6]">{current.count}</p>
              <p className="mt-1 text-[11.5px] text-[#6B6E76]">active users · {total ? Math.round((100 * current.count) / total) : 0}% of all</p>
            </div>
            <span className="text-[11px] text-[#8A90A2]">{current.point[0].toFixed(2)}°, {current.point[1].toFixed(2)}°</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EEF2FF]">
            <span className="block h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#3A64F6]" style={{ width: `${total ? Math.max(6, (100 * current.count) / total) : 0}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => flyTo(current, 15)} className="sl-white inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-[#3A64F6] py-2 text-[12.5px] font-semibold cursor-pointer hover:bg-[#2F55E0]">
              <Navigation size={14} /> Street view
            </button>
            <button type="button" onClick={() => flyTo(current, 9)} className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-[#F1F4FF] py-2 text-[12.5px] font-semibold text-[#3A64F6] cursor-pointer hover:bg-[#E5EBFF]">
              <LocateFixed size={14} /> Area
            </button>
          </div>
          <p className="mt-2 text-[10.5px] leading-[140%] text-[#8A90A2]">Approximate city centre – Google Analytics does not share exact locations.</p>
        </div>
      ) : null}

      {/* city chips */}
      {sorted.length ? (
        <div className="pointer-events-auto absolute bottom-3 left-3 right-3 z-[500] flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:right-[300px]">
          {sorted.slice(0, 12).map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => flyTo(s)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold shadow-[0_8px_20px_-12px_rgba(22,23,26,0.5)] ring-1 backdrop-blur-md cursor-pointer ${
                s.key === selected ? 'sl-white bg-[#3A64F6] ring-transparent' : 'bg-white/92 text-[#2B3040] ring-black/5 hover:text-[#3A64F6]'
              }`}
            >
              <MapPin size={13} /> {s.name}
              <span className={`rounded-full px-1.5 text-[11px] tabular-nums ${s.key === selected ? 'bg-white/25' : 'bg-[#EEF2FF] text-[#3A64F6]'}`}>{s.count}</span>
            </button>
          ))}
        </div>
      ) : null}

      {!scrollZoom ? (
        <span className="sl-white pointer-events-none absolute bottom-7 right-4 z-[400] hidden rounded-full bg-[#16171A]/70 px-2.5 py-1 text-[11px] md:inline">
          Click the map, then scroll to zoom
        </span>
      ) : null}
    </div>
  );
}
