import ProductsListing from '@/page-components/products/ProductsListing'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Produktübersicht: Reifen günstig vergleichen & kaufen',
  description:
    'Stöbern Sie durch unsere Produktübersicht und finden Sie die besten Angebote für Reifen. Vergleichen Sie Preise und kaufen Sie günstig bei Reifenhier.de.',
  openGraph: {
    title: 'Produktübersicht: Reifen günstig vergleichen & kaufen',
    description:
      'Entdecken Sie die Produktübersicht auf Reifencheck.de und finden Sie die günstigsten Reifenangebote. Jetzt Preise vergleichen und sparen!',
    url: 'https://reifencheck.de/produkte',
    siteName: 'Reifencheck.de',
    images: [
      {
        url: '/images/product-detailspage.png', // Use a relevant OG image for product listing
        width: 1200,
        height: 630,
        alt: 'Produktübersicht bei Reifenhier.de',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
};

const ProductsPage = () => {
  return (
    <>
      <ProductsListing />
    </>
  )
}

export default ProductsPage
