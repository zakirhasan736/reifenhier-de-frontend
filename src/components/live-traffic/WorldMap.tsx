'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { City } from './types';
import { countryCenter } from './countryCenters';

const GERMANY: L.LatLngExpression = [51.1, 10.4];

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

function focus(map: L.Map, cities: City[]) {
  const points = placed(cities).map((city) => L.latLng(city.point![0], city.point![1]));
  if (points.length === 0) {
    map.setView(GERMANY, 5);
    return;
  }
  if (points.length === 1) {
    map.setView(points[0], 6);
    return;
  }
  map.fitBounds(L.latLngBounds(points).pad(0.4), {
    animate: true,
    maxZoom: 6,
    padding: [56, 56],
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
    map.setView(GERMANY, 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
      const placeName = city.label || countryCenter(city.country)?.name || city.country;
      tip.textContent = `${placeName} · ${city.count} aktiv`;
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
