'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import ProductBanner from '@/components/productpage/ProductBanner';
import ProductListingsSec from '@/components/productpage/ProductListingsSec';
import type { RootState } from '@/store/store'; 

const ProductsListing = () => {
  const filters = useSelector((state: RootState) => state.products.filters);
  const selectedCategory = filters?.category?.[0] || 'All Products';

  return (
    <div className="product-listing-main-wrapper">
      <ProductBanner categoryName={selectedCategory} />
      <ProductListingsSec />
    </div>
  );
};

export default ProductsListing;
