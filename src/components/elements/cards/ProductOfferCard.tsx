'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type ProductOfferCardProps = {
  brand: string;
  category: string;
  title: string;
  logo: string;
  shipping: string;
  availability: string;
};

const ProductOfferCard = ({
  brand,
  category,
  title,
  logo,
  shipping,
  availability,
}: ProductOfferCardProps) => {
  return (
    <div className="offer-product-card-item border border-border-100 rounded-[4px] bg-mono-0 p-4">
      <div className="offer-product-card-inner flex flex-col gap-4">
        <div className="offer-product-card-img pt-4 pb-3">
          <Image
            src={logo}
            alt="product image"
            width={300}
            height={20}
            className="w-auto h-[20px] object-cover rounded-[4px]"
          />
        </div>

        <div className="offer-product-card-content flex flex-col gap-2">
          <p className="product-brand text-primary-100 font-bold text-[14px] uppercase text-left">
            {brand}
          </p>
          <p className="product-brand text-mono-100 font-bold text-[12px] capitalize text-left">
            {category}
          </p>
          <h5 className="product-title h6 font-secondary text-primary-70 mb-2">
            {title}
          </h5>
          <p className="product-brand text-primary-70 font-bold text-[12px] text-left">
            {shipping}
          </p>
          <p className="product-brand text-primary-70 font-bold text-[12px] text-left">
            {availability}
          </p>
        </div>

        <div className="offer-product-card-btn-states">
          <Link href="" className="block w-full">
            <button
              type="button"
              className="w-full !border-primary-100 bg-primary-100 text-mono-0 border py-2 px-6 rounded-full cursor-pointer hover:!text-primary-100 transition ease-in hover:!border-primary-100 hover:bg-transparent"
            >
              To the offer
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductOfferCard;
