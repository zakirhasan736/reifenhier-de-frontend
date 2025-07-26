'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import {
  useAddWishlistMutation,
  useRemoveWishlistMutation,
  useGetWishlistQuery,
} from '@/store/api/wishlistApi';

import { addProduct, openModal } from '@/store/compareSlice';
import type { RootState, AppDispatch } from '@/store/store';

interface RelatedCheaperItem {
  _id: string;
  brand_name: string;
  price: number;
}

interface ProductCardProps {
  _id: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string;
  brand_name: string;
  search_price: number;
  average_rating: number;
  rating_count: number;
  cheapest_offer: number;
  expensive_offer: number;
  savings_percent: string;
  savings_amount: number;
  related_cheaper: RelatedCheaperItem[] | string;
  product_name: string;
  dimensions: string;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  in_stock: string;
  showCompareButton?: boolean;
}
interface WishlistProduct {
  _id: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string;
  brand_name: string;
  search_price: number;
  average_rating: number;
  rating_count: number;
  cheapest_offer: number;
  expensive_offer: number;
  savings_percent: string;
  savings_amount: number;
  product_name: string;
  dimensions: string;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  in_stock: string;
  favoritedAt?: string;
}
const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  brand_logo,
  product_image,
  merchant_product_third_category,
  brand_name,
  search_price,
  average_rating,
  cheapest_offer,
  expensive_offer,
  savings_percent,
  related_cheaper,
  product_name,
  dimensions,
  fuel_class,
  wet_grip,
  noise_class,
  in_stock,
  showCompareButton = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: wishlistData } = useGetWishlistQuery();
  const [addWishlist] = useAddWishlistMutation();
  const [removeWishlist] = useRemoveWishlistMutation();

  // Ensure wishlist is always an array

const wishlist: WishlistProduct[] = useMemo(() => {
  return wishlistData?.wishlist ?? [];
}, [wishlistData]);

const isFavorited = useMemo(() => {
  return wishlist.some(item => item._id === _id);
}, [wishlist, _id]);

  const handleToggleWishlist = async () => {
    try {
      if (isFavorited) {
        await removeWishlist(_id);
        toast.success('Removed from Wishlist');
      } else {
        await addWishlist(_id);
        toast.success('Added to Wishlist');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const compareProducts = useSelector(
    (state: RootState) => state.compare.products
  );

  const isAlreadyCompared = compareProducts.find(p => p._id === _id);
  const handleCompare = () => {
    if (isAlreadyCompared) {
      toast.error('Product already added');
      return;
    }

    if (compareProducts.length >= 4) {
      toast.error('Maximum 4 products allowed in comparison');
      return;
    }

    dispatch(
      addProduct({
        _id,
        product_name,
        brand_name,
        product_image,
        dimensions,
        search_price,
        fuel_class,
        wet_grip,
        noise_class,
      })
    );
    dispatch(openModal());
    toast.success('Product added to comparison');
  };

  const gradeFuelColor = (grade: string) => {
    switch ((grade || '').toUpperCase()) {
      case 'A':
        return '#2d8934';
      case 'B':
        return '#a4c600';
      case 'C':
        return '#f9ed02';
      case 'D':
        return '#f5b602';
      case 'E':
      case 'F':
      case 'G':
        return '#e81401';
      default:
        return '#404042';
    }
  };

  const gradeGripColor = (grade: string) => {
    switch ((grade || '').toUpperCase()) {
      case 'A':
        return '#2c5aa9';
      case 'B':
        return '#377ac1';
      case 'C':
        return '#5ba7db';
      case 'D':
        return '#87c2ea';
      default:
        return '#b7e4f9';
    }
  };

  return (
    <div className="product-card-item bg-mono-0 border border-border-100 rounded-[12px] transition ease-in-out flex flex-col duration-300">
      <div className="card-header py-3 px-4 relative">
        <div className="status-area absolute top-0 z-50 left-0 w-full py-3 px-4 flex items-center justify-between">
          <p className="review-rating text-[14px] font-normal font-secondary leading-[150%] text-[#404042] flex items-center gap-[3px]">
            <Image
              src="/images/icons/stars.svg"
              alt="average rating"
              width={16}
              height={16}
            />{' '}
            {average_rating > 0 && <span>{average_rating}</span>}
          </p>
          <button onClick={handleToggleWishlist} className="cursor-pointer">
            <Image
              src={
                isFavorited
                  ? '/images/icons/heart-filled.svg'
                  : '/images/icons/heart.svg'
              }
              alt="favorite"
              width={16}
              height={16}
              loading="lazy"
            />
          </button>
        </div>
        <div className="card-header-image w-full h-[159px] max-md:h-[159px] bg-mono-0 flex items-center justify-center rounded-[4px] mb-2">
          <Link href={`/products/${_id}`} passHref>
            <Image
              loading="lazy"
              className="w-auto h-[159px] max-md:h-[159px] object-cover"
              width={200}
              height={200}
              src={product_image}
              alt="product"
            />
          </Link>
        </div>
        <div className="card-header-bottom flex items-center gap-1 justify-between w-full">
          <div className="h-[35px] w-[130px] flex items-center justify-start">
            {brand_logo ? (
              <Image
                loading="lazy"
                src={brand_logo}
                className="h-[35px] object-contain mr-auto"
                alt="product brand"
                width={110}
                height={35}
              />
            ) : (
              <p className="flex items-center gap-[6px] text-[#404042] text-[14px] font-normal font-secondary">
                {brand_name}
              </p>
            )}
          </div>
          <p className="flex items-center gap-[6px] text-[#00BE00] text-[14px] font-normal font-secondary">
            <Image
              src="/images/icons/tick-square.svg"
              alt="search price"
              width={16}
              height={16}
            />
            {in_stock === 'true' ? 'In Stock' : 'Not Available'}
          </p>
        </div>
      </div>
      <div className="card-body !flex !flex-col !gap-0 px-4 pt-3 pb-0">
        <h5 className="h6 text-[15px]  text-[#404042] h-[37px] font-medium font-primary mb-3">
          <Link href={`/products/${_id}`} passHref>
            {product_name}
          </Link>
        </h5>
        <div className="cat-diameter-box flex items-center justify-between w-full gap-1">
          <p className="tyres-category text-left font-normal capitalize text-[#89898B] text-[14px] font-secondary">
            {merchant_product_third_category}
          </p>
          <p className="product-sku font-medium text-right text-[#89898B] text-[14px] font-secondary">
            {dimensions}
          </p>
        </div>
        <div className="divider !h-[1px] !my-3 !bg-[#F0F0F2]"></div>
        <div className="brand-box flex items-center justify-between w-full gap-2">
          <ul className="attributes h-[44px] flex items-center w-full justify-start">
            {fuel_class && (
              <>
                <li className="fuelclass flex items-center gap-2 font-medium font-secondary text-[14px]">
                  <Image
                    src="/images/icons/fuel.svg"
                    alt="Fuel Class"
                    width={16}
                    height={16}
                  />{' '}
                  <span
                    style={{
                      color: gradeFuelColor(fuel_class),
                      fontWeight: 500,
                    }}
                  >
                    {fuel_class}
                  </span>
                </li>
                <li className="divider mx-3 w-[2px] h-3 bg-[#F0F0F2]"></li>
              </>
            )}
            {wet_grip && (
              <>
                <li className="fuelconsumption flex items-center gap-2 font-medium font-secondary text-[14px]">
                  <Image
                    src="/images/icons/weight.svg"
                    alt="Weight"
                    width={16}
                    height={16}
                  />{' '}
                  <span
                    style={{
                      color: gradeGripColor(wet_grip),
                      fontWeight: 500,
                    }}
                  >
                    {wet_grip}
                  </span>
                </li>
                <li className="divider mx-3 w-[2px] h-3 bg-[#F0F0F2]"></li>
              </>
            )}
            {noise_class && (
              <li className="externalrollingnoiseindbt flex items-center gap-2 font-medium font-secondary text-[14px]">
                <Image
                  src="/images/icons/noise.svg"
                  alt="External Rolling Noise"
                  width={16}
                  height={16}
                />{' '}
                {noise_class}
              </li>
            )}
          </ul>
          {savings_percent &&
            savings_percent !== '0%' &&
            savings_percent !== '-0%' && (
              <p className="px-2 py-[3px] border text-[14px] border-[#E66605] gap-1 flex items-center justify-center text-[#E66605] h-[26px] max-w-[65px] rounded-[6px] w-full">
                {savings_percent}
                <span
                  className="tooltip tooltip-left cursor-pointer flex items-center"
                  data-tip="Savings compared to the most expensive offer"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Savings Info</title>
                    <circle cx="12" cy="12" r="12" fill="#E66605" />
                    <text
                      x="12"
                      y="16"
                      textAnchor="middle"
                      fontSize="14"
                      fill="#fff"
                      fontFamily="Arial"
                      fontWeight="bold"
                    >
                      i
                    </text>
                  </svg>
                </span>
              </p>
            )}
        </div>
        <p className="product-price text-primary-100 font-normal font-secondary text-[14px] leading-[150%] mt-4 flex items-center gap-1">
          <span className="text-[14px] font-normal font-secondary text-[#86878A]">
            From:
          </span>{' '}
          <span className="text-[20px] font-normal font-secondary text-[#404042]">
            €
          </span>
          {cheapest_offer === expensive_offer ? (
            <span className="text-[18px] font-medium font-secondary text-[#404042]">
              {search_price}
            </span>
          ) : (
            <>
              <span className="text-[18px] font-medium font-secondary text-[#404042]">
                {cheapest_offer}
              </span>
              <span className="ml-3 text-[#C6C7CC]"></span>
              <span
                style={{ textDecoration: 'line-through' }}
                className="text-[16px] font-secondary font-normal text-[#C6C7CC] leading-[140%] text-line-through"
              >
                €{expensive_offer}
              </span>{' '}
            </>
          )}
        </p>
      </div>
      <div className="card-foot px-4 pb-3 pt-4 mt-auto">
        <Link href={`/products/${_id}`} passHref>
          <button
            type="button"
            className="max-w-full w-full text-[14px] font-medium leading-[120%] font-secondary max-md:text-[14px] ml-auto block border text-primary-100 bg-transparent rounded-full hover:bg-primary-100 hover:text-mono-0 transition ease !border-primary-100 cursor-pointer py-[11.5px] px-8"
          >
            View Details
          </button>
        </Link>
        {showCompareButton && (
          <button
            type="button"
            onClick={handleCompare}
            className="flex items-center gap-2 mt-3 text-[14px] font-normal font-secondary text-primary-100 justify-center w-full cursor-pointer"
          >
            {isAlreadyCompared ? (
              <>
                <span className="text-green-600">✔</span> Added to comparison
              </>
            ) : (
              <>
                <Image
                  src="/images/icons/tabler_plus.svg"
                  alt="Add to comparison"
                  width={20}
                  height={20}
                />{' '}
                Add to comparison
              </>
            )}
          </button>
        )}
        {Array.isArray(related_cheaper) && related_cheaper.length > 0 && (
          <>
            <div className="divider !h-[1px] !my-3 !bg-[#F0F0F2]"></div>
            <ul className="competitor-product-lists flex flex-col gap-[2px]">
              {related_cheaper.map(item => (
                <li
                  key={item._id}
                  className="competitor-lists-item flex items-center justify-between"
                >
                  <Link
                    href={`/products/${item._id}`}
                    className="font-secondary font-normal text-[14px] text-left text-primary-100 underline leading-[140%]"
                  >
                    {item.brand_name}
                  </Link>
                  <span className="font-secondary font-normal text-[14px] text-left text-[#86878A] leading-[140%]">
                    €{item.price}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
