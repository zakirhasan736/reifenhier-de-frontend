'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import ProductSinglepage from '@/components/productpage/ProductDetailsSec';
import RelatedProducts from '@/components/productpage/RelatedProducts';
import CompareModal from '@/components/productpage/CompareModal';
import CompareFloatingButton from '@/components/productpage/CompareFloatingButton';
import HowItWorks from '@/components/homepage/HowItWorks';
import Loading from '@/app/loading';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
// import {Product} from '@/types/product';
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

const ProductDetailsPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const productid = params?.productid as string;

  useEffect(() => {
    if (!productid) return;

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiUrl}/api/products/product-details/${productid}`
        );
        setProduct(response.data.product);
        setRelatedProducts(response.data.relatedProducts);
        console.log('response related product', response.data.relatedProducts);

      } catch {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productid]);

  if (error) return <div>{error}</div>;

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
};

export default ProductDetailsPage;
