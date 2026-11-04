import { NextResponse } from 'next/server';

/**
 * Blog categories for the header mega menu.
 * Fetched server-side (no CORS problems in the browser) with ONE request
 * instead of 1 + N, cached for an hour.
 */
const WP_API =
  process.env.NEXT_PUBLIC_WP_API_URL || 'https://wp.reifexa.de/wp-json/wp/v2';

export const revalidate = 3600;

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

type Group = {
  name: string;
  slug: string;
  sub: { id: number; name: string; slug: string }[];
};

export async function GET() {
  try {
    const res = await fetch(
      `${WP_API}/categories?per_page=100&orderby=name&order=asc&_fields=id,name,slug,parent`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error(`WP ${res.status}`);
    const all: WPCategory[] = await res.json();
    const list = Array.isArray(all) ? all : [];

    const structure: Record<string, Group> = {};
    for (const parent of list.filter(c => c.parent === 0)) {
      structure[parent.slug] = {
        name: parent.name,
        slug: parent.slug,
        sub: list
          .filter(c => c.parent === parent.id)
          .map(c => ({ id: c.id, name: c.name, slug: c.slug })),
      };
    }
    return NextResponse.json(structure, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    // Menu simply shows no blog sub-categories — never an error in the console.
    return NextResponse.json({}, { headers: { 'Cache-Control': 'public, s-maxage=300' } });
  }
}
