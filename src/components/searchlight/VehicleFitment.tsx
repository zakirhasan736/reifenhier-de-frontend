type Vehicle = {
  make: string;
  model: string;
  fitments: { variant: string; yearFrom: number; yearTo: number; axle: string }[];
};

export default async function VehicleFitment({ size }: { size?: string }) {
  if (!size) return null;
  const api = process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de';
  const result = await fetch(`${api}/api/fitment/examples?size=${encodeURIComponent(size)}`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(2000),
  }).then(response => response.ok ? response.json() : null).catch(() => null) as { vehicles: Vehicle[] } | null;
  if (!result?.vehicles.length) return null;
  return <section className="mx-auto my-8 max-w-5xl rounded-xl border p-5">
    <h2 className="text-xl font-bold">Passt z. B. auf diese Fahrzeugvarianten</h2>
    <ul className="my-3 list-disc pl-5">
      {result.vehicles.flatMap(vehicle => vehicle.fitments.slice(0, 2).map((fitment, index) =>
        <li key={`${vehicle.make}-${vehicle.model}-${index}`}>
          {vehicle.make} {vehicle.model}, {fitment.variant} ({fitment.yearFrom}–{fitment.yearTo}, {({ front: 'Vorderachse', rear: 'Hinterachse', both: 'beide Achsen' })[fitment.axle]})
        </li>
      ))}
    </ul>
    <p>Bitte vor dem Kauf Fahrzeugfreigabe, Achse, Traglast und Geschwindigkeitsindex im CoC prüfen.</p>
  </section>;
}
