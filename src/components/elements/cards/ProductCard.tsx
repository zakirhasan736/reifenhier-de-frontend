'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import {
  useAddWishlistMutation,
  useRemoveWishlistMutation,
  useGetWishlistQuery,
} from '@/store/api/wishlistApi';

import { addProduct, openModal } from '@/store/compareSlice';
import type { RootState, AppDispatch } from '@/store/store';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
interface RelatedCheaperItem {
  _id: string;
  brand_name: string;
  price: number;
}

interface ProductCardProps {
  _id: string;
  slug: string;
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
  offers?: Offer[];
  isPriority?: boolean;
}
interface Offer {
  brand: string;
  vendor_logo: string;
  vendor: string;
  brand_name: string;
  product_category: string;
  product_name: string;
  price: string; // ← Adjusted for flexibility (string or number)
  vendor_id: string;
  aw_deep_link: string;
  savings_percent: string;
  delivery_cost: string | number; // ← Adjusted for flexibility (string or number)
  delivery_time: string;
  payment_icons: string[];
  original_affiliate_url: string;
  affiliate_product_cloak_url: string;
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
  slug,
  brand_logo,
  product_image,
  merchant_product_third_category,
  brand_name,
  search_price,
  average_rating,
  cheapest_offer,
  expensive_offer,
  savings_percent,
  offers,
  product_name,
  dimensions,
  fuel_class,
  wet_grip,
  noise_class,
  in_stock,
  showCompareButton = false,
  isPriority = false,
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
        slug,
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
        return '#FFC300'; // Deeper yellow, better contrast on white
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

  const uuidCookie = Cookies.get('uuid') || 'guest';
  return (
    <div className="product-card-item bg-mono-0 border border-border-100 rounded-[12px] transition ease-in-out flex flex-col duration-300">
      <div className="p-card-header py-3 px-4 relative">
        <div className="status-area absolute top-0 z-50 left-0 w-full py-3 px-4 flex items-center justify-between">
          <p className="review-rating text-[14px] font-normal font-secondary leading-[150%] text-[#404042] flex items-center gap-[3px]">
            <Image
              src="/images/icons/stars.svg"
              alt="average rating"
              width={16}
              height={16}
              loading="lazy"
            />
            {average_rating > 0 && (
              <span>{average_rating.toFixed(1).replace('.', ',')}</span>
            )}
          </p>

          <button onClick={handleToggleWishlist} className="cursor-pointer">
            <div className="relative w-5 h-5">
              <Image
                src={
                  isFavorited
                    ? '/images/icons/heart-filled.svg'
                    : '/images/icons/heart.svg'
                }
                alt="favorite"
                fill
                className="object-contain"
                loading="lazy"
              />
            </div>
          </button>
        </div>
        <div className="card-header-image w-full h-[159px] max-md:h-[159px] bg-mono-0 flex items-center justify-center rounded-[4px] mb-2">
         
          <Link href={`/products/${slug}`} prefetch passHref>
            <Image
              className="w-auto h-[159px] max-md:h-[159px] object-cover"
              // pick a realistic intrinsic size close to display; Next will downscale via `sizes`
              width={320}
              height={159}
              src={product_image}
              alt={`${brand_name} ${product_name}`}
              // ✅ LCP: only for the first/above-the-fold card
              priority={isPriority}
              // Next calculates lazy/eager from priority; no need for fetchPriority here
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              onError={e => {
                // Optional: fallback if an image 404s
                (e.currentTarget as HTMLImageElement).src =
                  '/images/fallback-product.png';
              }}
            />
          </Link>
        </div>
        <div className="card-header-bottom flex items-center gap-1 justify-between w-full">
          <div className="h-[35px] w-[130px] flex items-center justify-start">
            {brand_logo ? (
              <Image
                loading="lazy"
                src={brand_logo}
                className="h-[30px] object-contain mr-auto"
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
          <p className="flex items-center gap-[6px] text-[#16171A] text-[16px] font-normal font-secondary">
            <Image
              src="/images/icons/tick-square.svg"
              alt="search price"
              width={16}
              loading="lazy"
              height={16}
            />
            {in_stock === 'true' ? 'Auf Lager' : 'Nicht Verfügbar'}
          </p>
        </div>
      </div>
      <div className="p-card-body px-4 pt-3 pb-0">
        <h3 className="h6 text-[16px] text-[#404042] h-[37px] font-medium font-primary mb-3 leading-tight line-clamp-2">
          <Link href={`/products/${slug}`} passHref>
            {[brand_name, product_name].filter(Boolean).join(' ').toUpperCase()}
          </Link>
        </h3>

        <div className="cat-diameter-box flex items-center justify-between w-full gap-1">
          <p className="tyres-category text-left font-normal capitalize text-[#16171A] text-[14px] font-secondary">
            {merchant_product_third_category}
          </p>
          <p className="product-sku font-medium text-right text-[#16171A] text-[14px] font-secondary">
            {dimensions}
          </p>
        </div>
        <div className="divider !h-[1px] !my-3 !bg-[#F0F0F2]"></div>
        <div className="brand-box flex items-center justify-between w-full gap-2">
          <ul className="attributes h-[44px] flex items-center w-full justify-start">
            {fuel_class && (
              <>
                <li className="fuelclass flex items-center gap-2 font-medium font-secondary text-[14px]">
                  <span
                    className="tooltip tooltip-bottom cursor-pointer flex items-center"
                    data-tip="Kraftstoffeffizienzklasse"
                  >
                    <Image
                      src="/images/icons/fuel.svg"
                      alt="Fuel Class"
                      width={16}
                      height={16}
                      loading="lazy"
                    />
                  </span>
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
                  <span
                    className="tooltip tooltip-bottom cursor-pointer flex items-center"
                    data-tip="Kraftstoffeffizienz: Wie sparsam ist der Reifen beim Verbrauch."
                  >
                    <Image
                      src="/images/icons/heavy-rain.png"
                      alt="Wet Grip"
                      width={16}
                      height={16}
                      loading="lazy"
                    />
                  </span>
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
                <span
                  className="tooltip tooltip-bottom cursor-pointer flex items-center"
                  data-tip="Nasshaftung: Wie gut ist der Reifen bei Nässe."
                >
                  <Image
                    src="/images/icons/noise.svg"
                    alt="External Rolling Noise"
                    width={16}
                    height={16}
                    loading="lazy"
                  />
                </span>
                {noise_class}
              </li>
            )}
          </ul>
          {savings_percent &&
            savings_percent !== '0%' &&
            savings_percent !== '-0%' && (
              <p className="px-3 py-[3px] border text-[14px] border-[#16171A] gap-1 flex items-center justify-center text-[#16171A] h-[26px] max-w-[65px] rounded-[6px] w-full">
                {savings_percent}
                <span
                  className="tooltip tooltip-left cursor-pointer flex items-center"
                  data-tip="Ersparnis gegenüber dem teuersten Angebot"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Sparinformationen</title>
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
        <p className="product-price text-primary-100 font-normal font-secondary text-[14px] mt-4 flex items-center gap-1">
          <span className="text-[14px] font-normal font-secondary text-[#16171A]">
            Ab:
          </span>{' '}
          {cheapest_offer === expensive_offer ? (
            <>
              <span className="text-[18px] font-medium font-secondary text-[#404042]">
                {search_price}
              </span>
              <span className="text-[20px] font-normal font-secondary text-[#404042]">
                €
              </span>
            </>
          ) : (
            <>
              <span className="text-[18px] font-medium font-secondary text-[#404042]">
                {cheapest_offer} €
              </span>
              <span className="ml-3 text-[#C6C7CC]"></span>
              <span
                style={{ textDecoration: 'line-through' }}
                className="text-[16px] font-secondary font-normal text-[#404042] leading-[140%] text-line-through"
              >
                {expensive_offer} €
              </span>{' '}
            </>
          )}
        </p>
        <div className="button-box pt-4">
          <Link href={`/products/${slug}`} passHref>
            <button
              type="button"
              className="max-w-full flex items-center w-full text-[14px] md:text-[14px] font-medium leading-[120%] font-secondary xl:text-[14px] ml-auto border text-primary-100 bg-transparent rounded-full hover:bg-primary-100 hover:text-mono-0 transition ease !border-primary-100 justify-center cursor-pointer py-[11.5px] px-4"
            >
              Alle Angebote{' '}
              {Array.isArray(offers) && offers.length > 0 && (
                <>({offers.length})</>
              )}{' '}
              anzeigen
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
                  <span className="text-green-600">✔</span> Zum Vergleich
                  hinzugefügt
                </>
              ) : (
                <>
                  <Image
                    src="/images/icons/tabler_plus.svg"
                    alt="Add to comparison"
                    width={20}
                    height={20}
                  />{' '}
                  Zum Vergleich hinzufügen
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="p-card-foot   px-4 pb-3 ">
        {Array.isArray(offers) && offers.length > 0 && (
          <>
            <div className="divider !h-[1px] !mt-3 !mb-1 !bg-[#F0F0F2]"></div>
            <div className="mt-auto">
              <h4 className="font-primary font-normal text-[14px] mb-[6px] text-left text-[#404042] leading-[140%]">
                Direkt zum günstigsten Angebot
              </h4>
              <ul className="competitor-product-lists flex flex-col">
                {[...offers]
                  .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                  .slice(0, 3)
                  .map(item => {
                    return (
                      <li
                        key={item.vendor_id}
                        className="competitor-lists-item flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Link
                            href={`${apiUrl}/out/${
                              item.affiliate_product_cloak_url
                            }?product=${_id}&uuid=${
                              uuidCookie || 'guest'
                            }&from=product-page`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-secondary py-[4px] px-[6px] font-normal text-[14px] text-left text-primary-100 underline leading-[140%]"
                          >
                            {item.vendor}
                          </Link>
                        </div>
                        <span className="font-secondary font-normal text-[14px] text-left text-[#404042] leading-[140%]">
                          <span>{item.price + ' €'}</span>
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
