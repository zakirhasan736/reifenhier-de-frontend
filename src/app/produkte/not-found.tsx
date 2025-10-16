// 'use client';
// import Link from 'next/link';

// export default function NotFound() {
//   return (
//     <div className="not-found-wrapper py-12 h-[80vh]">
//       <div className="custom-container h-full">
//         <div className="not-found-cont flex flex-col justify-center items-center h-full">
//           <h4 className="text-center">Not Found</h4>
//           <p className="text-center">
//             Could not find product requested resource
//           </p>
//           <Link href="/" className="primary-btn btn-styles mt-6 mx-auto block">
//             Return Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.reifencheck.de';

interface RelatedProduct {
  _id: string;
  slug: string;
  product_name: string;
  brand_name: string;
  product_image: string;
  dimensions: string;
  search_price: number;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  in_stock: string;
  delivery_time: string;
  average_rating: number;
  rating_count: number;
  cheapest_offer: number;
  expensive_offer: number;
  ean: string;
  product_url: string;
  brand_logo: string;
  merchant_product_third_category: string;
  descriptions?: string;
  description?: string;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  speedIndex?: string;
  savings_percent: string;
  savings_amount: number;
  related_cheaper: [];
  showCompareButton?: boolean;
}
export const metadata: Metadata = {
  title: 'Produkt nicht gefunden | Reifencheck.de',
  description:
    'Dieses Produkt ist nicht mehr verfügbar. Entdecken Sie ähnliche Reifen zum besten Preis auf Reifencheck.de.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://www.reifencheck.de/404' },
};

// ---- Helper to fetch related items ----
async function fetchRelatedProducts(searchParams: {
  brand?: string;
  dimension?: string;
  category?: string;
}) {
  try {
    const query = new URLSearchParams({
      brand: searchParams.brand || '',
      dimensions: searchParams.dimension || '',
      category: searchParams.category || '',
      limit: '4',
    });

    const url = `${API.replace(/\/$/, '')}/api/products?${query.toString()}`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.products) ? data.products.slice(0, 4) : [];
  } catch {
    return [];
  }
}

export default async function NotFound({
  searchParams,
}: {
  searchParams?: { brand?: string; dimension?: string; category?: string };
}) {
  const related = await fetchRelatedProducts(searchParams || {});

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Image
          src="/images/icons/404-tyre.svg"
          alt="Produkt nicht gefunden"
          width={200}
          height={200}
          className="mx-auto mb-6"
        />

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Produkt nicht gefunden
        </h1>
        <p className="text-gray-600 mb-8">
          Das gesuchte Produkt ist leider nicht mehr verfügbar. Hier sind
          ähnliche Reifen, die Sie interessieren könnten:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {related.length > 0 ? (
            related.map((p: RelatedProduct) => (
              <Link
                key={p._id || p.slug}
                href={`/produkte/${p.slug}`}
                className="border rounded-2xl p-4 hover:shadow-md transition text-left bg-white"
              >
                <Image
                  src={p.product_image || '/images/product-placeholder.png'}
                  alt={`${p.brand_name ?? ''} ${p.product_name ?? ''}`}
                  width={200}
                  height={200}
                  className="mx-auto mb-3 object-contain h-[160px] w-auto"
                />
                <div className="font-semibold text-sm text-gray-800 mb-1">
                  {p.brand_name}
                </div>
                <div className="text-gray-600 text-xs line-clamp-2 mb-2">
                  {p.product_name}
                </div>
                {p.search_price && (
                  <div className="text-blue-600 font-bold text-sm">
                    ab {p.search_price.toFixed(2)} €
                  </div>
                )}
              </Link>
            ))
          ) : (
            <p className="text-gray-500">Keine ähnlichen Produkte gefunden.</p>
          )}
        </div>

        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition"
        >
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
