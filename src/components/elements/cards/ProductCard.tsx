"use client"
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, openModal } from '@/store/compareSlice';
import type { RootState } from '@/store/store'; 

interface ProductCardProps {
  _id: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string;
  brand_name: string;
  search_price: number;
  product_name: string;
  dimensions: string;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  showCompareButton?: boolean;
}


const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  brand_logo,
  product_image,
  merchant_product_third_category,
  brand_name,
  search_price,
  product_name,
  dimensions,
  fuel_class,
  wet_grip,
  noise_class,
  showCompareButton = false,
}) => {
  const dispatch = useDispatch();
  const compareProducts = useSelector((state: RootState) => state.compare.products
  );
  const isAlready = compareProducts.find(p => p._id === _id);
  const handleCompare = () => {

    if (isAlready) {
      toast.error('Product already added');
      return;
    }
    if (compareProducts.length >= 4) {
      toast.error('Compared products cannot exceed Maximum 4 products');
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
    toast.success('Product added to compare');
  };

  return (
    <div className="product-card-item bg-mono-0 border border-border-100 rounded-[4px] transition ease-in-out flex flex-col duration-300 min-h-[495px]">
      <div className="card-header pt-6 px-3 relative">
        <div className="status-area absolute top-0 z-50 px-3 py-2 uppercase text-mono-100 left-4 text-[11px] font-semibold rounded-br-[4px] rounded-bl-[4px] border border-t-transparent border-border-100 bg-mono-0">
          {brand_logo ? (
            <Image
              loading="lazy"
              src={brand_logo}
              alt="product brand"
              width={110}
              height={85}
            />
          ) : (
            brand_name
          )}
        </div>
        <div className="card-header-image w-full h-[200px] bg-mono-0 flex items-center justify-center rounded-[4px] mb-2">
          <Link href={`/products/${_id}`} passHref>
            <Image
              loading="lazy"
              className="w-auto h-[210px] max-md:h-[180px] object-cover"
              width={200}
              height={200}
              src={product_image}
              alt="product"
            />
          </Link>
        </div>
      </div>
      <div className="card-body px-4 py-0">
        <p className="tyres-category font-medium capitalize text-mono-100 text-[12px]">
          {merchant_product_third_category}
        </p>
        <div className="brand-box flex items-center justify-between w-full gap-2">
          <p className="product-brand text-primary-100 font-bold text-[16px] max-md:text-[14px] uppercase text-left">
            {brand_name}
          </p>
          <p className="product-price text-primary-100 font-medium text-[16px] uppercase text-right">
            <span className="text-[11px] text-mono-100">ab</span> €{search_price}
          </p>
        </div>
        <h5 className="h6 text-[16px]  text-primary-70 h-[42px] max-sm:h-auto font-semibold">
          <Link href={`/products/${_id}`} passHref>
            {product_name}
          </Link>
        </h5>
        <p className="product-sku font-medium text-mono-100 text-[14px]">
          {dimensions}
        </p>
        <ul className="attributes flex items-center justify-start">
          {fuel_class && (
            <>
              <li className="fuelclass flex items-center gap-2 font-bold text-[12px]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Fuel Class</title>
                  <path
                    d="M10.6667 6H0V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0L8.66667 0C9.1971 0 9.70581 0.210714 10.0809 0.585786C10.456 0.960859 10.6667 1.46957 10.6667 2V6ZM15.6093 2.66667L13.138 0.195333L12.1953 1.138L13.3333 2.276V4C13.3333 4.35362 13.4738 4.69276 13.7239 4.94281C13.9739 5.19286 14.313 5.33333 14.6667 5.33333V12C14.6667 12.1768 14.5964 12.3464 14.4714 12.4714C14.3464 12.5964 14.1768 12.6667 14 12.6667C13.8232 12.6667 13.6536 12.5964 13.5286 12.4714C13.4036 12.3464 13.3333 12.1768 13.3333 12V11.3333C13.3333 10.8029 13.1226 10.2942 12.7475 9.91912C12.3725 9.54405 11.8638 9.33333 11.3333 9.33333H10.6667V7.33333H0V16H10.6667V10.6667H11.3333C11.5101 10.6667 11.6797 10.7369 11.8047 10.8619C11.9298 10.987 12 11.1565 12 11.3333V12C12 12.5304 12.2107 13.0391 12.5858 13.4142C12.9609 13.7893 13.4696 14 14 14C14.5304 14 15.0391 13.7893 15.4142 13.4142C15.7893 13.0391 16 12.5304 16 12V3.60933C15.9991 3.2559 15.8587 2.91711 15.6093 2.66667Z"
                    fill="#3A64F6"
                  ></path>
                </svg>{' '}
                {fuel_class}
              </li>
              <li className="divider mx-2 w-[2px] h-3 bg-border-100"></li>
            </>
          )}
          {wet_grip && (
            <>
              <li className="fuelconsumption flex items-center gap-2 font-bold text-[12px]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Fuel Consumption</title>
                  <path
                    d="M8.00004 0C6.34315 0 5.00004 1.34315 5.00004 3V4H3C2.44772 4 2 4.44772 2 5V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V5C14 4.44772 13.5523 4 13 4H11V3C11 1.34315 9.65685 0 8.00004 0ZM6.00004 3C6.00004 1.89543 6.89547 1 8.00004 1C9.10461 1 10.0001 1.89543 10.0001 3V4H6.00004V3ZM12.5 6H3V13H12.5V6Z"
                    fill="#3A64F6"
                  ></path>
                </svg>{' '}
                {wet_grip}
              </li>
              <li className="divider mx-2 w-[2px] h-3 bg-border-100"></li>
            </>
          )}
          {noise_class && (
            <li className="externalrollingnoiseindbt flex items-center gap-2 font-bold text-[12px]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.8738 2.77916C13.7466 2.66398 13.5807 2.60263 13.4104 2.60771C13.24 2.6128 13.078 2.68393 12.9577 2.80651C12.8373 2.92909 12.7677 3.09381 12.7632 3.26686C12.7587 3.4399 12.8195 3.60814 12.9333 3.73703C14.0447 4.86865 14.6689 6.40172 14.6689 8.00004C14.6689 9.59835 14.0447 11.1314 12.9333 12.263C12.8656 12.3244 12.8109 12.3991 12.7726 12.4826C12.7342 12.5661 12.7131 12.6567 12.7104 12.7488C12.7078 12.8409 12.7236 12.9326 12.7571 13.0183C12.7905 13.104 12.8408 13.1818 12.9048 13.247C12.9689 13.3123 13.0454 13.3636 13.1297 13.3978C13.2139 13.432 13.3042 13.4483 13.3949 13.4459C13.4856 13.4435 13.5748 13.4222 13.6572 13.3836C13.7395 13.3449 13.8132 13.2895 13.8738 13.2209C15.2353 11.8352 15.9999 9.9576 15.9999 8.00004C15.9999 6.04247 15.2353 4.16485 13.8738 2.77916Z"
                  fill="#3A64F6"
                ></path>
                <path
                  d="M12.0683 4.81142C12.0067 4.74672 11.9331 4.69511 11.8518 4.65961C11.7704 4.62411 11.6829 4.60542 11.5943 4.60464C11.5057 4.60386 11.4179 4.621 11.3359 4.65506C11.2539 4.68912 11.1795 4.73942 11.1168 4.80303C11.0542 4.86663 11.0047 4.94227 10.9711 5.02552C10.9376 5.10877 10.9207 5.19797 10.9215 5.28792C10.9223 5.37787 10.9407 5.46676 10.9756 5.54941C11.0106 5.63205 11.0614 5.7068 11.1251 5.76929C11.7065 6.36154 12.033 7.16373 12.033 8.00004C12.033 8.83634 11.7065 9.63854 11.1251 10.2308C11.0614 10.2933 11.0106 10.368 10.9756 10.4507C10.9407 10.5333 10.9223 10.6222 10.9215 10.7122C10.9207 10.8021 10.9376 10.8913 10.9711 10.9746C11.0047 11.0578 11.0542 11.1334 11.1168 11.197C11.1795 11.2607 11.2539 11.311 11.3359 11.345C11.4179 11.3791 11.5057 11.3962 11.5943 11.3954C11.6829 11.3947 11.7704 11.376 11.8518 11.3405C11.9331 11.305 12.0067 11.2534 12.0683 11.1887C12.8996 10.3423 13.3665 9.19554 13.3665 8.00004C13.3665 6.80453 12.8996 5.65782 12.0683 4.81142Z"
                  fill="#3A64F6"
                ></path>
                <path
                  d="M9.21746 0.0111889C7.19076 0.397538 5.38767 1.55991 4.18084 3.25806H3.33507C2.45088 3.25914 1.60321 3.61634 0.977988 4.25131C0.352771 4.88628 0.00105912 5.74718 0 6.64516L0 9.35484C0.00105912 10.2528 0.352771 11.1137 0.977988 11.7487C1.60321 12.3837 2.45088 12.7409 3.33507 12.7419H4.18151C5.38798 14.4402 7.1909 15.6026 9.21746 15.9888C9.31364 16.0068 9.41253 16.0031 9.50713 15.9779C9.60174 15.9528 9.68974 15.9068 9.7649 15.8432C9.84006 15.7797 9.90055 15.7002 9.94208 15.6102C9.9836 15.5203 10.0052 15.4222 10.0052 15.3229V0.677093C10.0052 0.577774 9.9836 0.479681 9.94208 0.389761C9.90055 0.299842 9.84006 0.220296 9.7649 0.156759C9.68974 0.093221 9.60174 0.0472458 9.50713 0.0220898C9.41253 -0.00306628 9.31364 -0.00678776 9.21746 0.0111889Z"
                  fill="#3A64F6"
                >
                  <title>External Rolling Noise</title>
                </path>
              </svg>{' '}
              {noise_class}
            </li>
          )}
        </ul>
      </div>
      <div className="card-foot px-4 pb-5 mt-auto">
        <Link href={`/products/${_id}`} passHref>
          <button
            type="button"
            className="max-w-full w-full max-md:text-[14px] mt-4 ml-auto block border text-mono-0 bg-primary-100 rounded-full hover:bg-transparent hover:text-primary-100 transition ease !border-primary-100 cursor-pointer py-2 px-6"
          >
            View Details
          </button>
        </Link>
        {showCompareButton && (
          <button
            type="button"
            onClick={handleCompare}
            className="flex items-center gap-2 mt-3 text-[12px] justify-center w-full cursor-pointer"
          >
            {isAlready ? (
              <>
                <span className="text-green-600">✔</span> Added to comparison
              </>
            ) : (
              <>➕ Add to comparison</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
