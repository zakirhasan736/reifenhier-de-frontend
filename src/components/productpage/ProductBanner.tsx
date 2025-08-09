import React from 'react';
import Link from 'next/link';

interface ProductBannerProps {
  categoryName: string;
}

const ProductBanner: React.FC<ProductBannerProps> = ({ categoryName }) => {
  return (
    <section className="product-banner-section bg-mono-0 py-9 max-sm:py-5">
      <div className="custom-container">
        <div className="product-banner-wrapper flex flex-col items-center justify-center">
          <ul className="breadcrumb-area flex items-center gap-[10px]">
            <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
              <Link className="body-caption text-mono-100" href="/" passHref>
                Heim
              </Link>
              <span className="angle">&gt;</span>
            </li>
            <li className="breadcrumb-item body-caption capitalize text-mono-70">
              Reifen
            </li>
          </ul>
          <h4 className="h4 current-category-title capitalize mt-[15px] max-md:mt-2">
            {categoryName}
          </h4>
        </div>
      </div>
    </section>
  );
};

export default ProductBanner;
