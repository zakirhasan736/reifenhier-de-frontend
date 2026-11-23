'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { feature } from 'topojson-client';
import countries from 'world-atlas/countries-110m.json';
import type { GeometryCollection, Topology } from 'topojson-specification';
import type { City } from './types';

export default function WorldMap({ cities }: { cities: City[] }) {
  const root = useRef<HTMLDivElement>(null);
  const markers = useRef<L.LayerGroup | null>(null);
  useEffect(() => {
    if (!root.current) return;
    const container = root.current;
    const map = L.map(container, { scrollWheelZoom: false, minZoom: 0, maxZoom: 9, zoomSnap: 0.25, maxBounds: [[-86,-200],[86,200]] });
    const bounds: L.LatLngBoundsExpression = [[-58,-177],[77,177]];
    map.fitBounds(bounds);
    const topo = countries as unknown as Topology<{countries: GeometryCollection}>;
    L.geoJSON(feature(topo, topo.objects.countries), {
      style: { fillColor: '#cddbdc', fillOpacity: 1, color: '#fff', weight: 1 },
      onEachFeature: (f, layer) => {
        const name = document.createElement('span');
        name.textContent = String(f.properties?.name ?? '');
        layer.bindTooltip(name, { sticky: true });
      },
    }).addTo(map);
    map.attributionControl.addAttribution('Natural Earth · Städte: <a href="https://www.geonames.org/">GeoNames</a> (CC BY)');
    markers.current = L.layerGroup().addTo(map);
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => { observer.disconnect(); map.remove(); markers.current = null; };
  }, []);
  useEffect(() => {
    const layer = markers.current;
    if (!layer) return;
    layer.clearLayers();
    for (const city of cities) {
      if (!city.point) continue;
      const name = document.createElement('span');
      name.textContent = `${city.label} (${city.country}) · ${city.count} aktive Nutzer`;
      L.circleMarker(city.point, { radius: Math.min(28, 5 + 3 * Math.sqrt(city.count)), color: '#147488', weight: 1.5,
        fillColor: '#1397ab', fillOpacity: 0.7 }).bindTooltip(name).bindPopup(name.cloneNode(true) as HTMLElement).addTo(layer);
    }
  }, [cities]);
  return <div ref={root} role="region" aria-label="Weltkarte mit aktiven Nutzern nach Stadt" className="relative z-0 h-[320px] w-full rounded-xl !bg-[#eaf2f4] md:h-[430px]" />;
}
