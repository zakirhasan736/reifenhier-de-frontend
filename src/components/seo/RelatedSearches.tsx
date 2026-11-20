import Link from 'next/link';
import { Search } from 'lucide-react';

export type RelatedSearchLink = { label: string; href: string };

/**
 * Crawlable keyword-anchor links ("Ähnliche Suchanfragen") to indexable
 * landing pages, optionally with a short intro paragraph.
 */
export default function RelatedSearches({
  title = 'Ähnliche Suchanfragen',
  text,
  links,
  className = '',
  contained = true,
}: {
  title?: string;
  text?: string;
  links: RelatedSearchLink[];
  className?: string;
  contained?: boolean;
}) {
  if (!links.length) return null;
  const body = (
    <>
      <h2 className="flex items-center gap-2 text-[20px] md:text-[24px] font-semibold text-[#16171A] mb-3">
        <Search size={20} className="text-primary-100" aria-hidden /> {title}
      </h2>
      {text ? (
        <p className="text-[15px] leading-[1.65] text-[#4B4F58] font-secondary max-w-[860px] mb-4">{text}</p>
      ) : null}
      <ul className="flex flex-wrap gap-2">
        {links.map(l => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="inline-flex items-center rounded-full border border-[#E1E5EE] bg-mono-0 px-4 py-2 text-[14px] font-medium text-[#16171A] hover:border-primary-100 hover:text-primary-100 transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
  return (
    <section className={`related-searches ${className}`} aria-label={title}>
      {contained ? <div className="custom-container">{body}</div> : body}
    </section>
  );
}
