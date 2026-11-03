'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useVisitorUuid } from '@/utils/uuidContext';

import {
  useAddWishlistMutation,
  useRemoveWishlistMutation,
  useGetWishlistQuery,
} from '@/store/api/wishlistApi';

import { addProduct, openModal, removeProduct } from '@/store/compareSlice';
import type { RootState, AppDispatch } from '@/store/store';
import OptimizedImage from '../OptimizedImage';
import { CloudRain, Leaf } from 'lucide-react';
import { EU_LABEL_TIPS, getFuelEfficiencyMeta, getWetGripMeta } from '@/utils/euLabelMapping';
import { resolveEuLabelData, type TyreLabelInfo } from '@/utils/euTyreLabel';
import SavingsPercentBadge from '@/components/elements/SavingsPercentBadge';
import {
  formatSavingsPercent,
  highestPrice,
  lowestPrice,
} from '@/libs/savings';
import {
  buildVendorExitUrl,
  onVendorExitClick,
} from '@/libs/analytics/vendorExit';
import { formatEuro, toMoneyNumber } from '@/libs/money';
import PriceSparkline from '@/components/elements/PriceSparkline';
import { productImageSrc } from '@/libs/productImage';

interface RelatedCheaperItem {
  _id: string;
  brand_name: string;
  price: number;
}

interface ProductCardProps {
  _id: string;
  slug: string;
  brand_logo: string;
  product_image: string | string[];
  awin_image_url?: string;
  merchant_thumb_url?: string;
  merchant_image_url?: string;
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
  total_offers?: number;
  isPriority?: boolean;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  speedIndex?: string;
  ean?: string;
  tyre_label_info?: TyreLabelInfo | null;
  price_trend?: { points?: [string, number][] } | null;
}
interface Offer {
  brand: string;
  vendor_logo: string;
  vendor: string;
  brand_name: string;
  product_category: string;
  product_name: string;
  price: string;
  vendor_id: string;
  aw_deep_link: string;
  savings_percent: string;
  delivery_cost: string | number;
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
  awin_image_url,
  merchant_thumb_url,
  merchant_image_url,
  merchant_product_third_category,
  brand_name,
  search_price,
  average_rating,
  cheapest_offer,
  expensive_offer,
  savings_percent,
  offers,
  total_offers,
  product_name,
  dimensions,
  fuel_class,
  wet_grip,
  noise_class,
  in_stock,
  price_trend,
  showCompareButton = true,
  isPriority = true,
  width,
  height,
  diameter,
  lastIndex,
  speedIndex,
  ean,
  tyre_label_info,
}) => {

  const dispatch = useDispatch<AppDispatch>();
  const uuid = useVisitorUuid();
  const { src: mainImage, fallbacks: imageFallbacks } = productImageSrc(
    product_image,
    awin_image_url,
    [merchant_thumb_url, merchant_image_url]
  );

  const savingsLabel = useMemo(() => {
    return formatSavingsPercent(
      lowestPrice(cheapest_offer, search_price),
      highestPrice(expensive_offer),
    );
  }, [expensive_offer, cheapest_offer, search_price]);

  const euLabel = useMemo(
    () =>
      resolveEuLabelData({
        brand_name,
        product_name,
        ean,
        dimensions,
        width,
        lastIndex,
        speedIndex,
        fuel_class,
        wet_grip,
        noise_class,
        merchant_product_third_category,
        tyre_label_info,
        slug,
      }),
    [
      brand_name,
      product_name,
      ean,
      dimensions,
      width,
      lastIndex,
      speedIndex,
      fuel_class,
      wet_grip,
      noise_class,
      merchant_product_third_category,
      tyre_label_info,
      slug,
    ],
  );

  const fuelLetter = euLabel.fuel;
  const wetLetter = euLabel.wet;
  const noiseLetter = euLabel.noiseClass;

  const { data: wishlistData } = useGetWishlistQuery();
  const [addWishlist] = useAddWishlistMutation();
  const [removeWishlist] = useRemoveWishlistMutation();
const fuelMeta = getFuelEfficiencyMeta(fuelLetter || fuel_class);
const wetMeta = getWetGripMeta(wetLetter || wet_grip);
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
        toast.success('Von der Wunschliste entfernt');
      } else {
        await addWishlist(_id);
        toast.success('Zu den Favoriten hinzugefügt');
      }
    } catch {
      toast.error('Etwas ist schiefgelaufen.');
    }
  };

  const compareProducts = useSelector(
    (state: RootState) => state.compare.products
  );

  const isAlreadyCompared = compareProducts.find(p => p._id === _id);
  const handleCompare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAlreadyCompared) {
      dispatch(removeProduct(_id));
      toast.success('Aus dem Vergleich entfernt');
      return;
    }

    if (compareProducts.length >= 4) {
      toast.error('Maximal 4 Reifen im Vergleich');
      dispatch(openModal());
      return;
    }

    dispatch(
      addProduct({
        _id,
        slug,
        product_name,
        brand_name,
        product_image: mainImage,
        awin_image_url,
        dimensions,
        search_price,
        cheapest_offer,
        expensive_offer,
        savings_percent: savingsLabel || savings_percent,
        fuel_class,
        wet_grip,
        noise_class,
        lastIndex,
        speedIndex,
        width,
        height,
        diameter,
        merchant_product_third_category,
        average_rating,
        in_stock,
      })
    );
    toast.success(
      compareProducts.length === 0
        ? 'Erster Reifen im Vergleich — wählen Sie einen zweiten'
        : 'Zum Vergleich hinzugefügt'
    );
    if (compareProducts.length >= 1) dispatch(openModal());
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
  const gradeFuelBgColor = (grade: string) => {
    switch ((grade || '').toUpperCase()) {
      case 'A':
        return '#2d893445';
      case 'B':
        return '#a4c60045';
      case 'C':
        return '#FFC30045'; // Deeper yellow, better contrast on white
      case 'D':
        return '#f5b60245';
      case 'E':
      case 'F':
      case 'G':
        return '#e8140145';
      default:
        return '#40404245';
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
  const gradeGripBgColor = (grade: string) => {
    switch ((grade || '').toUpperCase()) {
      case 'A':
        return '#2c5aa945';
      case 'B':
        return '#377ac145';
      case 'C':
        return '#5ba7db45';
      case 'D':
        return '#87c2ea45';
      default:
        return '#b7e4f945';
    }
  };
 
  const offerCount = Math.max(
    Array.isArray(offers) ? offers.length : 0,
    Number(total_offers) || 0,
  );
  const isInStock = in_stock === 'true';
  const singlePrice =
    toMoneyNumber(cheapest_offer) === toMoneyNumber(expensive_offer);

  return (
    <div className="product-card-item product-card-v2 group bg-mono-0 border border-[#E9ECF3] rounded-[16px] transition-all ease-out flex h-full w-full flex-col duration-300 hover:border-[#C9D6FC] hover:-translate-y-0.5">
      {/* ---------- Image stage ---------- */}
      <div className="p-card-header p-2.5 relative">
        <div className="card-header-image relative w-full h-[170px] bg-[#F5F7FB] flex items-center justify-center rounded-[12px] overflow-hidden">
          <Link href={`/produkte/${slug}`} prefetch passHref>
            <OptimizedImage
              className="w-auto h-[150px] object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              width={320}
              height={159}
              src={mainImage}
              alt={`${brand_name} ${product_name}`}
              fetchPriority="high"
              priority={isPriority}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              fallbacks={imageFallbacks}
              fallback="/images/realistic-complete-set-car-wheels-2.png"
            />
          </Link>

          <div className="status-area absolute top-2 left-2 right-2 z-50 flex items-start justify-between pointer-events-none">
            <p className="review-rating pointer-events-auto inline-flex items-center gap-1 rounded-full bg-mono-0/95 px-2 py-1 text-[12px] font-medium font-secondary leading-none text-[#16171A] shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
              <Image
                src="/images/icons/stars.svg"
                alt="average rating"
                width={13}
                height={13}
                loading="lazy"
              />
              {Number(average_rating) > 0 ? (
                <span>
                  {Number(average_rating).toFixed(1).replace('.', ',')}
                </span>
              ) : null}
            </p>

            <button
              onClick={handleToggleWishlist}
              aria-label={isFavorited ? 'Von der Wunschliste entfernen' : 'Zu den Favoriten hinzufügen'}
              className="pointer-events-auto cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full bg-mono-0/95 shadow-[0_1px_3px_rgba(16,24,40,0.08)] transition-transform hover:scale-110"
            >
              <div className="relative w-[18px] h-[18px]">
                <OptimizedImage
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

          <span className="product-sku absolute bottom-2 left-2 z-40 rounded-[6px] bg-[#16171A]/85 px-2 py-1 text-[12px] font-semibold font-secondary leading-none text-mono-0 tabular-nums">
            {dimensions}
          </span>
          {savingsLabel ? (
            <div className="absolute bottom-2 right-2 z-40 rounded-[6px] bg-mono-0">
              <SavingsPercentBadge label={savingsLabel} tooltipPlacement="left" />
            </div>
          ) : null}
        </div>
      </div>

      {/* ---------- Body ---------- */}
      <div className="p-card-body flex flex-1 flex-col px-4 pt-2 pb-0">
        <div className="card-header-bottom flex items-center gap-2 justify-between w-full mb-2">
          <div className="h-[35px] min-w-0 max-w-[130px] flex items-center justify-start">
            {brand_logo ? (
              <Image
                loading="lazy"
                src={brand_logo}
                className="h-[30px] w-auto object-contain mr-auto"
                alt="product brand"
                width={110}
                height={35}
              />
            ) : (
              <p className="text-[#404042] text-[14px] font-semibold font-secondary">
                {brand_name}
              </p>
            )}
          </div>
          <p
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12px] font-medium font-secondary ${
              isInStock ? 'text-[#1F7A3A]' : 'text-[#B42318]'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isInStock ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
              }`}
            />
            {isInStock ? 'Auf Lager' : 'Nicht Verfügbar'}
          </p>
        </div>

        <h3 className="h6 text-[15px] text-[#16171A] min-h-[38px] font-semibold font-primary leading-[1.3] line-clamp-2 mb-1">
          <Link href={`/produkte/${slug}`} passHref className="hover:text-primary-100 transition-colors">
            {[brand_name, product_name].filter(Boolean).join(' ')}
          </Link>
        </h3>

        <p className="tyres-category text-left capitalize text-[#6B6E76] text-[13px] font-secondary mb-3">
          {merchant_product_third_category}
          {merchant_product_third_category && dimensions ? ' · ' : ''}
          {dimensions}
        </p>

        {/* EU label */}
        <ul className="attributes flex items-center gap-1.5 flex-wrap mb-2">
          {fuelLetter && (
            <li className="fuelclass inline-flex items-center gap-1.5 rounded-[8px] border border-[#EEF0F4] pl-1.5 pr-1 py-1 font-secondary text-[13px]">
              <span
                className="tooltip tooltip-bottom cursor-pointer flex items-center"
                data-tip={EU_LABEL_TIPS.fuel}
              >
                <Image src="/images/icons/fuel.svg" alt="Fuel Class" width={14} height={14} loading="lazy" />
              </span>
              <span
                className="rounded-[5px] px-1.5 leading-[20px] font-semibold"
                style={{ color: gradeFuelColor(fuelLetter), background: gradeFuelBgColor(fuelLetter) }}
              >
                {fuelLetter}
              </span>
            </li>
          )}
          {wetLetter && (
            <li className="fuelconsumption inline-flex items-center gap-1.5 rounded-[8px] border border-[#EEF0F4] pl-1.5 pr-1 py-1 font-secondary text-[13px]">
              <span
                className="tooltip tooltip-bottom cursor-pointer flex items-center"
                data-tip={EU_LABEL_TIPS.wet}
              >
                <Image src="/images/icons/heavy-rain.png" alt="Wet Grip" width={14} height={14} loading="lazy" />
              </span>
              <span
                className="rounded-[5px] px-1.5 leading-[20px] font-semibold"
                style={{ color: gradeGripColor(wetLetter), background: gradeGripBgColor(wetLetter) }}
              >
                {wetLetter}
              </span>
            </li>
          )}
          {noiseLetter && (
            <li className="externalrollingnoiseindbt inline-flex items-center gap-1.5 rounded-[8px] border border-[#EEF0F4] px-1.5 py-1 font-secondary text-[13px] font-semibold text-[#404042]">
              <span
                className="tooltip tooltip-bottom cursor-pointer flex items-center"
                data-tip={EU_LABEL_TIPS.noise}
              >
                <Image src="/images/icons/noise.svg" alt="External Rolling Noise" width={14} height={14} loading="lazy" />
              </span>
              <span className="leading-[20px]">{noiseLetter}</span>
            </li>
          )}
        </ul>

        {/* Human-readable highlights */}
        <div className="grid grid-cols-2 gap-1.5 w-full">
          <div
            style={{ backgroundColor: fuelMeta.bg }}
            className="min-w-0 rounded-[8px] px-2 py-1.5 flex flex-col gap-0.5 items-start"
          >
            <div className="flex items-center gap-1 text-[#6B6E76] max-w-full">
              <Leaf size={11} />
              <span className="text-[10px] font-semibold leading-none truncate">
                Kraftstoffeffizienz
              </span>
            </div>
            <span className="text-[10px] font-bold leading-tight max-w-full" style={{ color: fuelMeta.color }}>
              {fuelMeta.textDE}
            </span>
          </div>
          <div
            style={{ backgroundColor: wetMeta.bg }}
            className="min-w-0 rounded-[8px] px-2 py-1.5 flex flex-col gap-0.5 items-start"
          >
            <div className="flex gap-1 items-center text-[#6B6E76] max-w-full">
              <CloudRain size={11} />
              <span className="text-[10px] font-semibold leading-none truncate">
                Nasshaftung
              </span>
            </div>
            <span className="text-[10px] font-bold leading-tight max-w-full" style={{ color: wetMeta.color }}>
              {wetMeta.textDE}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-auto pt-4">
          <div className="product-price flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[12px] font-secondary text-[#6B6E76] leading-none mb-1">
                Ab
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[22px] font-semibold font-primary text-[#16171A] leading-none tabular-nums">
                  {singlePrice
                    ? `${formatEuro(search_price, { suffix: false })} €`
                    : formatEuro(cheapest_offer)}
                </span>
                {!singlePrice && (
                  <span
                    style={{ textDecoration: 'line-through' }}
                    className="text-[14px] font-secondary text-[#9AA0A8] tabular-nums"
                  >
                    {formatEuro(expensive_offer)}
                  </span>
                )}
              </div>
            </div>
            {offerCount > 0 && (
              <span className="shrink-0 rounded-full bg-[#EEF2FF] px-2 py-1 text-[11px] font-semibold text-primary-100 font-secondary">
                {offerCount} {offerCount === 1 ? 'Angebot' : 'Angebote'}
              </span>
            )}
          </div>
          <PriceSparkline
            points={price_trend?.points}
            current={toMoneyNumber(cheapest_offer) ?? toMoneyNumber(search_price)}
            className="mt-2"
          />
        </div>

        <div className="button-box pt-3">
          <Link href={`/produkte/${slug}`} passHref>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-1.5 rounded-[10px] bg-primary-100 py-[11px] px-4 text-[14px] font-semibold font-secondary text-mono-0 cursor-pointer transition hover:opacity-90"
            >
              Alle Angebote{offerCount > 0 ? ` (${offerCount})` : ''} anzeigen
            </button>
          </Link>
          {showCompareButton && (
            <button
              type="button"
              onClick={handleCompare}
              className={`flex items-center gap-1.5 mt-2 text-[13px] font-medium font-secondary justify-center w-full cursor-pointer py-1.5 rounded-[8px] transition-colors hover:bg-[#F5F7FB] ${
                isAlreadyCompared ? 'text-[#2d8934]' : 'text-primary-100'
              }`}
            >
              {isAlreadyCompared ? (
                <>
                  <span aria-hidden>✔</span> Im Vergleich
                </>
              ) : (
                <>
                  <Image src="/images/icons/tabler_plus.svg" alt="" width={18} height={18} />
                  Vergleichen
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ---------- Cheapest offers ---------- */}
      <div className="p-card-foot px-4 pb-4">
        {Array.isArray(offers) && offers.length > 0 && (
          <div className="mt-3 rounded-[12px] bg-[#F7F8FB] p-2.5">
            <h4 className="font-secondary font-semibold text-[12px] mb-1.5 text-left text-[#6B6E76] leading-[140%]">
              Direkt zum günstigsten Angebot
            </h4>
            <ul className="competitor-product-lists flex flex-col gap-1">
              {[...offers]
                .sort(
                  (a, b) =>
                    Number((a as { in_stock?: boolean }).in_stock === false) -
                      Number((b as { in_stock?: boolean }).in_stock === false) ||
                    (toMoneyNumber(a.price) ?? 0) - (toMoneyNumber(b.price) ?? 0)
                )
                .slice(0, 3)
                .map(item => (
                  <li
                    key={item.vendor_id}
                    className="competitor-lists-item flex items-center justify-between rounded-[8px] bg-mono-0 px-2 py-1.5"
                  >
                    <a
                      href={buildVendorExitUrl({
                        token: item.affiliate_product_cloak_url,
                        productId: _id,
                        uuid,
                        from: 'product-card',
                        vendor: item.vendor,
                        vendorId: item.vendor_id,
                        brand: brand_name,
                        instruction: 'Direkt zum Angebot',
                      })}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      onClick={() => {
                        onVendorExitClick({
                          productId: _id,
                          productName: product_name,
                          brandName: brand_name,
                          vendor: item.vendor,
                          vendorId: item.vendor_id,
                          source: 'product-card',
                          instruction: 'Direkt zum Angebot',
                          vendorPrice: toMoneyNumber(item.price) ?? undefined,
                        });
                      }}
                      className="font-secondary font-medium text-[13px] text-left text-primary-100 hover:underline leading-[140%] truncate"
                    >
                      {item.vendor}
                    </a>
                    <span className="shrink-0 font-secondary font-semibold text-[13px] text-[#16171A] tabular-nums">
                      {formatEuro(item.price)}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
