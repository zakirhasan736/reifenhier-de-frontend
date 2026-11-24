import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, BadgeCheck, CarFront, Code2, Gauge, Globe2, KeyRound, Search, ServerCog, ShieldCheck } from 'lucide-react';
import PricingPlans from '@/components/autoApi/PricingPlans';
import { count, fetchFitmentStats, fetchPlanCatalog, FITMENT_V1 } from '@/libs/autoApi';
import { SITE_URL } from '@/libs/seo/site';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: 'Auto-API: Reifengrößen nach Fahrzeug – Preise & Tarife | Reifexa' },
  description:
    'Reifexa Auto-API für Shops und Portale: Modelle, Generationen, Baujahre und Werks-Reifengrößen für den deutschen Markt. Suche nach Fahrzeug oder Reifengröße. Free, Pro und Advanced.',
  alternates: { canonical: `${SITE_URL}/auto-api` },
};

const SAMPLE = `{
  "vehicles": [{
    "make": "VW",
    "model": "Golf",
    "verified": true,
    "fitments": [{
      "variant": "Golf 7 (5G)",
      "yearFrom": 2012, "yearTo": 2020,
      "size": "205/55 R16",
      "axle": "both",
      "loadIndex": "91", "speedIndex": "V"
    }]
  }],
  "total": 1
}`;

const FAQ = [
  ['Woher stammen die Daten?', 'Reifexa pflegt eine eigene Fahrzeugdatenbank für den deutschen Markt. Einträge, die unser Team geprüft hat, tragen in der API das Feld „verified: true“. Weitere Einträge sind KI-gestützt erstellte Vorschläge und werden laufend geprüft und ergänzt.'],
  ['Warum muss ich meine Server-IP angeben?', 'Ein Schlüssel funktioniert nur von den IP-Adressen, die wir für ihn freigegeben haben. So kann ein gestohlener Schlüssel nicht von fremden Servern genutzt werden. Neue oder geänderte IPs teilen Sie uns einfach mit.'],
  ['Was bedeutet „Top 50“ oder „Top 500“?', 'Die Tarife enthalten die häufigsten Modellfamilien auf deutschen Straßen – also zuerst Golf, Polo, 3er, A4 & Co. – jeweils mit allen Generationen, Baujahren und Reifengrößen. Advanced enthält alle Modelle.'],
  ['Wie wird bezahlt?', 'Nach Ihrer Bestellung prüfen wir die Angaben und senden eine Rechnung. Nach Zahlungseingang erhalten Sie Ihren API-Schlüssel. Der Free-Tarif ist kostenlos. Details stehen in den Preis- und Zahlungsbedingungen.'],
  ['Kann ich den Tarif wechseln oder kündigen?', 'Ja. Ein Upgrade ist jederzeit möglich, eine Kündigung zum Ende des laufenden Abrechnungszeitraums. Schreiben Sie uns einfach eine E-Mail.'],
];

export default async function AutoApiPage() {
  const [catalog, stats] = await Promise.all([fetchPlanCatalog(), fetchFitmentStats()]);
  const figures = [
    { value: count(stats?.models), fallback: '1.000+', label: 'Modellfamilien' },
    { value: count(stats?.variants), fallback: '3.000+', label: 'Generationen & Varianten' },
    { value: count(stats?.records), fallback: '10.000+', label: 'Reifengrößen-Zuordnungen' },
    { value: count(stats?.sizes), fallback: '400+', label: 'verschiedene Reifengrößen' },
  ];

  return (
    <main className="bg-[#F6F8FC] pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden text-white bg-gradient-to-br from-[#0B1437] via-[#1B2A6B] to-[#2F4FD8]">
        <span className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border-[48px] border-white/5" aria-hidden />
        <span className="pointer-events-none absolute right-40 top-40 h-[180px] w-[180px] rounded-full border-[22px] border-white/5" aria-hidden />
        <div className="custom-container relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="sl-white inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-medium ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full bg-[#4ADE80]" /> Reifexa Auto-API · Daten für den deutschen Markt
            </p>
            <h1 className="sl-white mt-5 text-[34px] font-bold leading-[115%] md:text-[50px]">
              Die passende Reifengröße zu jedem Auto – per API.
            </h1>
            <p className="sl-white mt-5 max-w-xl text-[17px] leading-[160%] opacity-85">
              Modelle, Generationen, Baujahre und Werks-Reifengrößen je Achse. Suchen Sie nach Fahrzeug oder umgekehrt nach Reifengröße –
              für Reifenshops, Werkstätten, Vergleichsportale und Apps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#tarife" className="inline-flex items-center gap-2 rounded-[14px] bg-white px-6 py-3.5 text-[15px] font-semibold text-[#1B2A6B] shadow-lg">
                Tarife ansehen <ArrowRight size={18} color="#1B2A6B" />
              </a>
              <Link href="/auto-api/dokumentation" className="sl-white inline-flex items-center gap-2 rounded-[14px] bg-white/10 px-6 py-3.5 text-[15px] font-semibold ring-1 ring-white/25 hover:bg-white/15">
                <Code2 size={18} /> Dokumentation
              </Link>
            </div>
          </div>
          <div className="rounded-[20px] bg-[#0A0F24]/80 shadow-2xl ring-1 ring-white/10 backdrop-blur">
            <div className="sl-white flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#F87171]" />
              <span className="h-3 w-3 rounded-full bg-[#FBBF24]" />
              <span className="h-3 w-3 rounded-full bg-[#34D399]" />
              <span className="ml-3 truncate font-mono text-[12px] opacity-70">GET /vehicles?make=VW&model=Golf&year=2016</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[165%] text-[#C7D2FE]">{SAMPLE}</pre>
          </div>
        </div>
      </section>

      {/* Figures */}
      <section className="custom-container -mt-10 relative">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-[#E4E7F0] shadow-[0_12px_40px_rgba(16,24,40,0.08)] md:grid-cols-4">
          {figures.map(f => (
            <div key={f.label} className="bg-white p-6 text-center">
              <p className="text-[28px] font-bold text-[#16171A] md:text-[32px]">{f.value || f.fallback}</p>
              <p className="mt-1 text-[13.5px] text-[#5A6072]">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="custom-container mt-20">
        <h2 className="text-center text-[28px] font-bold text-[#16171A] md:text-[34px]">Was die API kann</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <CarFront size={22} color="#3A64F6" />, bg: 'bg-[#EEF2FF]', t: 'Fahrzeug → Reifengröße', d: 'Marke, Modell und Baujahr rein – Generation und alle Werksgrößen raus, getrennt nach Vorder- und Hinterachse.' },
            { icon: <Search size={22} color="#059669" />, bg: 'bg-[#ECFDF5]', t: 'Reifengröße → Fahrzeuge', d: '„Welche Autos fahren 205/55 R16?“ – ideal für Produktseiten und Filter in Ihrem Shop (Pro & Advanced).' },
            { icon: <Gauge size={22} color="#D97706" />, bg: 'bg-[#FFFBEB]', t: 'Last- & Speedindex', d: 'Zu jeder Größe Tragfähigkeits- und Geschwindigkeitsindex wie im CoC-Papier (Pro & Advanced).' },
            { icon: <BadgeCheck size={22} color="#16A34A" />, bg: 'bg-[#F0FDF4]', t: 'Geprüfte Datensätze', d: 'Von unserem Team geprüfte Fahrzeuge sind mit „verified“ gekennzeichnet – Sie entscheiden, was Sie anzeigen.' },
            { icon: <ShieldCheck size={22} color="#E11D48" />, bg: 'bg-[#FFF1F2]', t: 'Schlüssel + IP-Freigabe', d: 'Zugriff nur mit API-Schlüssel und nur von Ihren freigegebenen Server-IPs. Kein Missbrauch fremder Schlüssel.' },
            { icon: <Globe2 size={22} color="#0891B2" />, bg: 'bg-[#ECFEFF]', t: 'Offene Dokumentation', d: 'REST + JSON, OpenAPI-Datei zum Import in Postman oder Ihren Code-Generator, Beispiele in curl, JS, PHP, Python.' },
          ].map(f => (
            <div key={f.t} className="rounded-[20px] bg-white p-6 ring-1 ring-[#E4E7F0] transition-shadow hover:shadow-[0_12px_32px_rgba(16,24,40,0.08)]">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-[14px] ${f.bg}`}>{f.icon}</span>
              <h3 className="mt-4 text-[17px] font-semibold text-[#16171A]">{f.t}</h3>
              <p className="mt-2 text-[14.5px] leading-[160%] text-[#5A6072]">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="tarife" className="custom-container mt-24 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-[28px] font-bold text-[#16171A] md:text-[34px]">Tarife für jede Größe</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[16px] leading-[160%] text-[#5A6072]">
            Die Tarife unterscheiden sich vor allem in der Zahl der Modellfamilien – die häufigsten Autos in Deutschland zuerst. Alle Preise netto.
          </p>
        </div>
        <div className="mt-10">
          <PricingPlans catalog={catalog} />
        </div>
        <p className="mt-6 text-center text-[13px] text-[#6B7280]">
          Es gelten die <Link href="/auto-api/bedingungen" className="underline">API-Nutzungsbedingungen</Link> und die{' '}
          <Link href="/auto-api/preise-und-zahlung" className="underline">Preis- und Zahlungsbedingungen</Link>.
        </p>
      </section>

      {/* How it works */}
      <section className="custom-container mt-24">
        <h2 className="text-center text-[28px] font-bold text-[#16171A] md:text-[34px]">In 3 Schritten zum Zugang</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: <ServerCog size={22} color="#fff" />, t: 'Tarif wählen & IP angeben', d: 'Bestellen Sie einen Tarif und nennen Sie die öffentlichen IP-Adressen der Server, die die API aufrufen.' },
            { icon: <ShieldCheck size={22} color="#fff" />, t: 'Wir prüfen & schalten frei', d: 'Wir prüfen Ihre Angaben, senden bei Bezahltarifen die Rechnung und geben Ihre IPs frei – meist in 1–2 Werktagen.' },
            { icon: <KeyRound size={22} color="#fff" />, t: 'Schlüssel erhalten & loslegen', d: 'Sie erhalten Ihren API-Schlüssel einmalig und sicher. Die Dokumentation zeigt den ersten Aufruf in einer Minute.' },
          ].map((s, i) => (
            <li key={s.t} className="relative rounded-[20px] bg-white p-6 ring-1 ring-[#E4E7F0]">
              <span className="absolute right-5 top-4 text-[40px] font-bold text-[#EEF0F5]">{i + 1}</span>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#4F46E5] to-[#3A64F6] shadow-[0_8px_20px_rgba(58,100,246,0.35)]">{s.icon}</span>
              <h3 className="mt-4 text-[17px] font-semibold text-[#16171A]">{s.t}</h3>
              <p className="mt-2 text-[14.5px] leading-[160%] text-[#5A6072]">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="custom-container mt-24 max-w-3xl">
        <h2 className="text-center text-[28px] font-bold text-[#16171A]">Häufige Fragen</h2>
        <div className="mt-8 divide-y divide-[#E4E7F0] rounded-[20px] bg-white ring-1 ring-[#E4E7F0]">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group p-5">
              <summary className="flex cursor-pointer list-none justify-between gap-4 font-semibold text-[#16171A]">
                {q}
                <span aria-hidden className="text-[20px] leading-none text-[#3A64F6] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[14.5px] leading-[165%] text-[#404042]">{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center text-[13px] text-[#6B7280]">
          API-Basis-URL: <code className="rounded bg-white px-2 py-1 ring-1 ring-[#E4E7F0]">{FITMENT_V1}</code>
        </p>
      </section>
    </main>
  );
}
