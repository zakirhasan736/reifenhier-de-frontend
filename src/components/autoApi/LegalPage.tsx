import Link from 'next/link';

export type LegalSection = { id: string; title: string; paras: React.ReactNode[] };

/** Shared layout for the Auto-API terms pages. */
export default function LegalPage({ title, intro, version, sections, other }: {
  title: string;
  intro: string;
  version: string;
  sections: LegalSection[];
  other: { href: string; label: string };
}) {
  return (
    <main className="bg-[#F6F8FC] pb-20">
      <div className="custom-container max-w-4xl pt-10">
        <Link href="/auto-api" className="text-[14px] font-medium text-[#3A64F6] hover:underline">← Reifexa Auto-API</Link>
        <h1 className="mt-3 text-[30px] font-bold text-[#16171A] md:text-[36px]">{title}</h1>
        <p className="mt-2 text-[14px] text-[#6B7280]">Stand: {version}</p>
        <p className="mt-4 text-[15.5px] leading-[165%] text-[#404042]">{intro}</p>
        <nav aria-label="Inhalt" className="mt-6 rounded-[16px] bg-white p-5 ring-1 ring-[#E4E7F0]">
          <ol className="grid list-decimal gap-x-8 gap-y-1 pl-5 text-[14px] sm:grid-cols-2">
            {sections.map(s => (
              <li key={s.id}><a href={`#${s.id}`} className="text-[#3A64F6] hover:underline">{s.title}</a></li>
            ))}
          </ol>
        </nav>
        <div className="mt-8 space-y-8 rounded-[20px] bg-white p-6 ring-1 ring-[#E4E7F0] md:p-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-[19px] font-semibold text-[#16171A]">§ {i + 1} {s.title}</h2>
              <div className="mt-3 space-y-3 text-[15px] leading-[170%] text-[#2B3040]">
                {s.paras.map((p, k) => (
                  <p key={k}>({k + 1}) {p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-6 text-[14px] text-[#404042]">
          Siehe auch: <Link href={other.href} className="text-[#3A64F6] underline">{other.label}</Link> ·{' '}
          <Link href="/AGB" className="text-[#3A64F6] underline">AGB von Reifexa.de</Link> ·{' '}
          <Link href="/impressum-datenschutz" className="text-[#3A64F6] underline">Impressum & Datenschutz</Link>
        </p>
      </div>
    </main>
  );
}
