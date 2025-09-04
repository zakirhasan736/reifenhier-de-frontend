

// 'use client';
// import React from 'react';
// import ProductCard from '@/components/elements/cards/ProductCard';
// import ProductSkeletonCard from '@/components/elements/cards/productskeletonCard';
// import { Product } from '@/types/product';


// interface ProductListProps {
//   products: Product[];
//   loading: boolean;
// }

// const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {
//   return (
//     <div className="relative min-h-[200px]">
//       <div className="">
//         {products.length === 0 ? (
//           <div className="grid lg:grid-cols-3 grid-cols-1 md:grid-cols-3 product-listing-grid-wrapper gap-4">
//             {Array.from({ length: 12 }).map((_, i) => (
//               <ProductSkeletonCard key={`skeleton-${i}`} />
//             ))}
//           </div>
//         ) : (
//           <div
//             className={`grid lg:grid-cols-3 grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6 product-listing-grid-wrapper ${
//               loading ? 'pointer-events-none' : ''
//             }`}
//           >
//             {products.map(p => (
//               <ProductCard key={p._id} {...p} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductList;
'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/elements/cards/ProductCard';
import { Product } from '@/types/product';
import ProductSkeletonCard from '../elements/cards/productskeletonCard';

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const OverlaySpinner = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div className="listing-product-loader absolute inset-0 h-[65vh] bg-white/60 backdrop-blur-[1px] flex items-start pt-[320px] justify-center z-10">
      <span className="loader" />
    </div>
  );
};

const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {
  // Sticky UI loading: hide a moment *after* loading=false so quick re-requests don’t flicker
  const [uiLoading, setUiLoading] = useState<boolean>(false);

  useEffect(() => {
    if (loading) {
      setUiLoading(true);
      return;
    }
    const t = setTimeout(() => setUiLoading(false), 120);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div className="relative min-h-[320px]">
      <OverlaySpinner show={uiLoading} />
      {products.length === 0 ? (
        <div className="grid lg:grid-cols-3 grid-cols-1 md:grid-cols-3 product-listing-grid-wrapper gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductSkeletonCard key={`skeleton-${i}`} />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-x-4 gap-y-6 product-listing-grid-wrapper">
          {products.map(p => (
            <ProductCard key={p._id} {...p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
