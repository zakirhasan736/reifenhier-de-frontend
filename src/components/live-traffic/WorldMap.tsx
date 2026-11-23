'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { City } from './types';

const GERMANY: L.LatLngExpression = [51.1, 10.4];

function placed(cities: City[]) {
  return cities.filter((city) => city.point && city.count > 0);
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
  map.fitBounds(L.latLngBounds(points).pad(0.45), {
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
      minZoom: 3,
      maxZoom: 12,
      zoomSnap: 0.25,
    });
    map.setView(GERMANY, 5);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);
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
    const max = Math.max(1, ...placed(cities).map((city) => city.count));
    for (const city of placed(cities)) {
      const size = Math.round(22 + 30 * Math.sqrt(city.count / max));
      const icon = L.divIcon({
        className: 'rx-live-pin',
        html: `<span class="rx-live-dot" style="width:${size}px;height:${size}px"></span>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const tip = document.createElement('span');
      tip.textContent = `${city.label}, ${city.country} · ${city.count} aktiv`;
      L.marker(city.point!, { icon, keyboard: false }).bindTooltip(tip).addTo(layer);
    }
    const signature = placed(cities).map((city) => city.point!.join(',')).sort().join('|');
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
