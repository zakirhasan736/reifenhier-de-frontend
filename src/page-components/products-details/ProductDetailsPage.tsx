'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import ProductSinglepage from '@/components/productpage/ProductDetailsSec';
import RelatedProducts from '@/components/productpage/RelatedProducts';
import CompareModal from '@/components/productpage/CompareModal';
import CompareFloatingButton from '@/components/productpage/CompareFloatingButton';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Offer {
  brand: string;
  vendor_logo: string;
  vendor: string;
  brand_name: string;
  product_category: string;
  product_name: string;
  price: number;
  delivery_cost: string;
  delivery_time: string;
  original_affiliate_url: string;
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
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string;
  brand_name: string;
  search_price: number;
  product_name: string;
  dimensions: string;
  descriptions: string;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  in_stock: string;
  delivery_time: string;
  ean: string;
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
      {product &&
      <ProductSinglepage product={product} loading={loading} />
    }
      <RelatedProducts relatedProductData={relatedProducts} />
      <CompareFloatingButton />
      <CompareModal relatedProducts={relatedProducts} />
    </div>
  );
};

export default ProductDetailsPage;
