'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { City } from './types';
import { countryCenter, placeLabel } from './countryCenters';

const GERMANY: L.LatLngExpression = [51.2, 10.4];

function spot(city: City): [number, number] | null {
  if (city.count <= 0) return null;
  if (city.point) return city.point;
  return countryCenter(city.country)?.point ?? null;
}

function placed(cities: City[]) {
  return cities.flatMap((city) => {
    const point = spot(city);
    return point ? [{ ...city, point }] : [];
  });
}

function nearGermany(city: { country: string; point: [number, number] }) {
  if (city.country === 'DE') return true;
  const [lat, lng] = city.point;
  return Math.abs(lat - 51.2) < 8 && Math.abs(lng - 10.4) < 12;
}

function focus(map: L.Map, cities: City[]) {
  const spots = placed(cities);
  const germany = spots.filter(nearGermany);
  const target = germany.length ? germany : spots;
  if (target.length === 0) {
    map.flyTo(GERMANY, 6, { duration: 0.7 });
    return;
  }
  if (target.length === 1) {
    map.flyTo(target[0].point, 6, { duration: 0.8 });
    return;
  }
  map.flyToBounds(L.latLngBounds(target.map((city) => city.point)), {
    duration: 0.8,
    maxZoom: 6,
    padding: [64, 64],
  });
}

export default function WorldMap({ cities }: { cities: City[] }) {
  const root = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markers = useRef<L.LayerGroup | null>(null);
  const seen = useRef('');

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const map = L.map(container, {
      scrollWheelZoom: false,
      zoomControl: false,
      minZoom: 2,
      maxZoom: 12,
      zoomSnap: 0.25,
      maxBounds: [[-86, -200], [86, 200]],
    });
    map.setView(GERMANY, 6);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: '© Esri',
    }).addTo(map);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      pane: 'overlayPane',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    markers.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markers.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markers.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const spots = placed(cities);
    const max = Math.max(1, ...spots.map((city) => city.count));
    for (const city of spots) {
      const size = Math.round(22 + 30 * Math.sqrt(city.count / max));
      const icon = L.divIcon({
        className: 'rx-live-pin',
        html: `<span class="rx-live-dot" style="width:${size}px;height:${size}px"></span>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const tip = document.createElement('span');
      tip.textContent = `${placeLabel(city.country, city.label, city.point)} · ${city.count} active`;
      const marker = L.marker(city.point!, { icon, keyboard: false, zIndexOffset: 500 });
      marker.bindTooltip(tip, {
        permanent: true,
        direction: 'top',
        offset: [0, -Math.round(size / 2)],
        className: 'rx-live-label',
        opacity: 1,
      }).addTo(layer);
    }
    const signature = spots.map((city) => city.point!.join(',')).sort().join('|');
    if (signature !== seen.current) {
      seen.current = signature;
      map.invalidateSize();
      focus(map, cities);
    }
  }, [cities]);

  return (
    <div
      ref={root}
      role="region"
      aria-label="Karte der aktiven Besucher"
      className="rx-live-map absolute inset-0 z-0"
    />
  );
}
