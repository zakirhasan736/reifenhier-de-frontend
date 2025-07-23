

'use client';
import React from 'react';
import ProductCard from '@/components/elements/cards/ProductCard';
import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
import { Product } from '@/types/product';


interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="relative min-h-[200px]">
      {/* {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-100 rounded-full animate-spin"></div>
        </div>
      )} */}

      <div className="">
        {products.length === 0  ? (
          <div className="grid grid-cols-4 max-md:grid-cols-1 max-lg:grid-cols-2 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductSkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 gap-4">
            {products.map((p) => (
                  <ProductCard key={p._id} {...p} />
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
