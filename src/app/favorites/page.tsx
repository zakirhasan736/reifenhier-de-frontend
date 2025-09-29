import type { Metadata } from 'next';
import FavoritesClient from '@/page-components/Favorite/FavoritePage';

const SITE = 'https://www.reifencheck.de';

// Page-level SEO: noindex + canonical (keeps crawlers happy)
export const metadata: Metadata = {
  title: 'Favoriten | Reifencheck.de',
  description:
    'Ihre gespeicherten Reifenangebote im Überblick. Melden Sie sich an, um Ihre Favoriten zu sehen.',
  alternates: { canonical: `${SITE}/favorites` },
  robots: { index: false, follow: true },
};

// This file stays a Server Component — no hooks here.
export default function FavoritesPage() {
  return (
    <section className="favorite-page-section pt-8 pb-9">
      <div className="custom-container">
        <h1 className="h4 font-medium font-primary text-[#404042] mb-5">
          Ihre Wunschliste
        </h1>
        {/* Client side fetch & render */}
        <FavoritesClient />
      </div>
    </section>
  );
}
