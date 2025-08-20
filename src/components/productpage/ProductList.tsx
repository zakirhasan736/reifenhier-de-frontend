

'use client';
import React from 'react';
import ProductCard from '@/components/elements/cards/ProductCard';
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
import { Product } from '@/types/product';


interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {
  return (
    <div className="relative min-h-[200px]">
      <div className="">
        {products.length === 0 ? (
          <div className="grid lg:grid-cols-3 grid-cols-1 md:grid-cols-3 product-listing-grid-wrapper gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductSkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div
            className={`grid lg:grid-cols-3 grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6 product-listing-grid-wrapper ${
              loading ? 'pointer-events-none' : ''
            }`}
          >
            {products.map(p => (
              <ProductCard key={p._id} {...p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
