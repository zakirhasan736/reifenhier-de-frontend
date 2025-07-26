

'use client';
import React from 'react';
import ProductCard from '@/components/elements/cards/ProductCard';
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
import { Product } from '@/types/product';
import NotFound from '@/app/products/not-found';


interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {
  return (
    <div className="relative min-h-[200px]">
      <div className="">
        {products.length === 0 ? (
          <NotFound />
        ) : loading ? (
          <div className="grid grid-cols-4 max-md:grid-cols-1 max-lg:grid-cols-2 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductSkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 gap-4">
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
