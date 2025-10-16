'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductSinglepage from '@/components/productpage/ProductDetailsSec';
import RelatedProducts from '@/components/productpage/RelatedProducts';
import CompareModal from '@/components/productpage/CompareModal';
import CompareFloatingButton from '@/components/productpage/CompareFloatingButton';
import HowItWorks from '@/components/homepage/HowItWorks';
import Loading from '@/app/loading';

const API = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.reifencheck.de'
).replace(/\/$/, '');

interface Offer {
  brand: string;
  vendor_logo: string;
  vendor: string;
  brand_name: string;
  product_category: string;
  product_name: string;
  price: number;
  affiliate_product_cloak_url: string;
  aw_deep_link: string;
  savings_percent: string;
  delivery_cost: string | number; // ← Adjusted for flexibility (string or number)
  delivery_time: string;
  payment_icons: string[];
  original_affiliate_url: string;
}

interface CheapestVendor {
  aw_deep_link: string;
  delivery_cost: string | number; // ← Adjusted here too
  payment_icons: string[];
  vendor: string;
  affiliate_product_cloak_url: string;
  vendor_id: string;
  vendor_logo: string;
}

interface Product {
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
  review_count: number;
  average_rating: number;
  cheapest_offer: number;
  expensive_offer: number;
  savings_percent: string;
  related_cheaper: Product[];
  cheapest_vendor: CheapestVendor;
  ean: string;
  product_url: string;
  brand_logo?: string;
  merchant_product_third_category?: string;
  descriptions?: string;
  description?: string;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  speedIndex?: string;
  offers?: Offer[];
}

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

export default function ProductDetailsPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API}/api/products/product-details/${encodeURIComponent(slug)}`
        );
        if (!mounted) return;

        const data = res.data || {};
        setProduct(data.product || null);
        setRelatedProducts(
          Array.isArray(data.relatedProducts) ? data.relatedProducts : []
        );
        setError(null);
      } catch {
        if (!mounted) return;
        setError('Failed to load product details.');
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="product-details-cont-wrapper">
      {product ? (
        <ProductSinglepage product={product} loading={loading} />
      ) : (
        <Loading />
      )}
      <HowItWorks />
      <RelatedProducts relatedProductData={relatedProducts} loading={loading} />
      <CompareFloatingButton />
      <CompareModal relatedProducts={relatedProducts} />
    </div>
  );
}
