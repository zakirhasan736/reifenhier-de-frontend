import Link from 'next/link';
import { SITE_URL } from '@/libs/seo/site';

/**
 * Visible breadcrumb trail. Besides helping users, these are crawlable
 * internal links from every product to its season, size and brand pages.
 */
export default function Breadcrumbs({
  crumbs,
}: {
  crumbs: { name: string; url: string }[];
}) {
  if (!crumbs?.length) return null;
  const toPath = (u: string) => (u.startsWith(SITE_URL) ? u.slice(SITE_URL.length) || '/' : u);
  return (
    <nav aria-label="Brotkrumen" className="custom-container pt-4 pb-1">
      <ol className="flex flex-wrap items-center gap-1 text-[12px] md:text-[13px] text-[#5A5B61]">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.url} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-[#16171A] line-clamp-1">
                  {c.name}
                </span>
              ) : (
                <Link href={toPath(c.url)} className="hover:text-primary-100 hover:underline">
                  {c.name}
                </Link>
              )}
              {!last ? <span aria-hidden="true">›</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
