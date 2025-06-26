'use client';
import React from 'react';


const ProductSkeletonCard: React.FC = () => {

  return (
    <div className="product-card-item bg-mono-0 max-w-[289px] sm:min-w-[160px] w-full px-[15px] py-4 flex flex-col gap-[33px]">
      {/* Product Header */}
      <div className="product-head-cont flex justify-between">
        <div className="donate-charity-img h-[46px] flex items-center">
          <div className="skeleton bg-mono-40 block h-8 w-[110px] rounded-none rounded-br-[4px] rounded-bl-[4px]"></div>
        </div>
        {/* <div className="skeleton bg-mono-40 block h-5 w-5 rounded-full"></div> */}
      </div>

      {/* Product Image */}
      <div className="product-body-cont px-8 sm:px-0 w-full flex justify-center items-center">
        <div className="skeleton bg-mono-40 block max-w-[116px] h-[110px] w-full"></div>
      </div>

      {/* Product Information */}
      <div className="product-info-box">
        <div className="product-info">
          <div className="prod-title-box flex gap-1 justify-between items-start">
            <h6 className="product-brand-title eyebrow-medium">
              <span className="skeleton bg-mono-40 block h-2 w-full"></span>
            </h6>
            <p className="product-price body-bold-small">
              <span className="skeleton bg-mono-40 block h-2 w-full"></span>
            </p>
          </div>
          <p className="product-title h-4 text-mono-60 caption-bold">
            <span className="skeleton bg-mono-40 block h-4 w-full"></span>
          </p>
          <div className="product-size eyebrow-small mt-3">
            <span className="skeleton bg-mono-40 block h-2 w-full"></span>
          </div>
        </div>

        {/* Location Information */}
        <div className="product-location flex items-center gap-2 mt-4">
          <span className="skeleton bg-mono-40 block h-2 w-full"></span>
        </div>

        {/* Add to Basket Button */}
        <div className="product-card-btn-states mt-3">
          <span className="skeleton bg-mono-40 block h-10 w-full"></span>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeletonCard;
