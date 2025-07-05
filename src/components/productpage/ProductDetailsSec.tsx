'use client';

import React , { useState} from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import {
  EffectFade,
  FreeMode,
  Navigation,
  Thumbs,
  Autoplay,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/swiper-bundle.css';
import { useDispatch } from 'react-redux';
import { addProduct, openModal } from '@/store/compareSlice';
import { AppDispatch } from '@/store/store';
import type { Swiper as SwiperClass } from 'swiper';

interface Offer {
  brand: string;
  vendor_logo: string;
  vendor: string;
  brand_name: string;
  product_category: string;
  product_name: string;
  price: number;
  delivery_cost: string;
  delivery_time: string;
  original_affiliate_url: string;
}

interface Product {
  _id: string;
  product_name: string;
  brand_name: string;
  product_image: string;
  dimensions: string;
  search_price: number;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  in_stock: string;
  delivery_time: string;
  ean: string;
  product_url: string;
  brand_logo?: string;
  merchant_product_third_category?: string;
  descriptions?: string;
  description?: string;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  speedIndex?: string;
  offers?: Offer[];
}
interface ProductProps {
  product: Product;
  loading: boolean;
}
const ProductSinglepage: React.FC<ProductProps> = ({
    product,
    loading
  }) => {

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

   const dispatch = useDispatch<AppDispatch>();
  const handleCompareClick = () => {
    dispatch(
      addProduct({
        _id: product._id,
        product_name: product.product_name,
        brand_name: product.brand_name,
        product_image: product.product_image,
        dimensions: product.dimensions,
        search_price: product.search_price,
        fuel_class: product.fuel_class,
        wet_grip: product.wet_grip,
        noise_class: product.noise_class,
      })
    );
    dispatch(openModal());
  };

  return (
    <>
      {loading ? (
        <section className="product-singlepage-section">
          <div className="custom-container max-w-[960px] w-full">
            {/* product details banner area */}
            <div className="product-breadcrumb-area pt-4 pb-10 max-sm:pb-4">
              <ul className="breadcrumb-area flex items-center justify-center gap-[10px]">
                <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
                  <Link
                    className="body-caption capitalize text-mono-100"
                    href="/"
                  >
                    Home
                  </Link>
                  <span className="angle">{'>'}</span>
                </li>
                <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
                  <Link
                    className="body-caption capitalize text-mono-100"
                    href=""
                  >
                    <div className="skeleton h-2 w-24 bg-mono-60"></div>
                  </Link>
                  <span className="angle">{'>'}</span>
                </li>
                <li className="breadcrumb-item body-caption current-page text-mono-70 flex items-center gap-[10px]">
                  <span className="body-caption text-mono-70">
                    <div className="skeleton h-2 w-24 bg-mono-60"></div>
                  </span>
                </li>
              </ul>
            </div>
            {/* product details banner area end*/}

            <div className="product-singlepage-cont-wrapper w-full max-w-[895px] flex items-start justify-between gap-9 max-lg:gap-12 max-md:gap-10 max-sm:gap-12 pb-6 max-sm:pb-12 max-sm:flex-col">
              <div className="product-singlepage-left-cont px-3 py-2 max-w-[415px] sticky top-6 w-full">
                <div className="swiper-product-slider-area relative">
                  <div className="brand-logo inline-block px-4 py-2 border border-primary-100 rounded-[4px] bg-mono-0">
                    <div className="skeleton h-10 w-[110px] bg-mono-60"></div>
                  </div>
                  <div className="swiper-slider-view w-full relative">
                    <div className="slide-view-item">
                      <div className="skeleton h-[485px] w-[319px] bg-mono-60"></div>
                    </div>
                    <div className="selected-charity-image"></div>
                  </div>

                  <div className="swiper-product-slide-tab-item mt-8 flex justify-center items-center">
                    <div className="slide-tab-item w-14 h-14">
                      <div className="skeleton h-12 w-12 bg-mono-60"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="product-singlepage-right-cont  w-full">
                <ul className="product-highlight-info mb-4 flex items-center flex-wrap gap-2">
                  <li className="product-highlight-info-item text-[12px] caption py-1 px-3 rounded-[16px] bg-border-100 text-primary-70 font-semibold border border-border-100">
                    <div className="skeleton h-3 w-20 bg-mono-60"></div>
                  </li>
                  <li className="product-highlight-info-item text-[12px] caption py-1 px-3 rounded-[16px] bg-border-100 text-primary-70 font-semibold border border-border-100">
                    <div className="skeleton h-3 w-20 bg-mono-60"></div>
                  </li>
                  <li className="product-highlight-info-item text-[12px] caption py-1 px-3 rounded-[16px] bg-border-100 text-primary-70 font-semibold border border-border-100">
                    <div className="skeleton h-3 w-20 bg-mono-60"></div>
                  </li>
                  <li className="product-highlight-info-item text-[12px] caption py-1 px-3 rounded-[16px] bg-border-100 text-primary-70 font-semibold border border-border-100">
                    <div className="skeleton h-3 w-20 bg-mono-60"></div>
                  </li>
                </ul>
                <p className="product-brand mb-2 text-primary-100 font-bold text-[18px] uppercase text-left">
                  <div className="skeleton h-4 w-[160px] bg-mono-60"></div>
                </p>
                <h5 className="product-title h4 font-secondary text-primary-70 mb-2">
                  <div className="skeleton h-4 w-[300px] bg-mono-60 mb-1"></div>
                </h5>

                <div className="product-price-group flex flex-col gap-2 mb-4 max-w-[306px] sm:max-w-[375px] w-full">
                  <p className="input-type-text text-primary-70 font-medium text-[18px] capitalized text-left w-full">
                    <span className="font-bold text-[16px]">Price:</span> £{' '}
                    <div className="skeleton h-4 w-[100px] bg-mono-60"></div>
                  </p>
                  <ul className="attributes flex items-center justify-start mb-4">
                    <li className="fuelclass flex items-center gap-2 font-bold text-[14px]">
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
                      <div className="skeleton h-2 w-12 bg-mono-60"></div>
                    </li>
                    <li className="divider mx-2 w-[2px] h-3 bg-border-100"></li>
                    <li className="wetgripclass flex items-center gap-2 font-bold text-[14px]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Wetgrip Class</title>
                        <path
                          d="M6.65884 16C6.56826 16.0004 6.4786 15.982 6.39552 15.946C6.23264 15.8763 6.10418 15.7449 6.03838 15.5808C5.97258 15.4166 5.97484 15.2331 6.04466 15.0706L8.0496 10.4035C8.12108 10.2435 8.25282 10.118 8.41633 10.0541C8.57984 9.99021 8.76198 9.9931 8.92337 10.0621C9.08476 10.1312 9.21244 10.2608 9.27879 10.423C9.34514 10.5852 9.34485 10.7669 9.27796 10.9289L7.27302 15.596C7.22149 15.7159 7.13584 15.8181 7.02667 15.8899C6.9175 15.9617 6.78961 16 6.65884 16ZM4.59976 15.596L6.6047 10.9289C6.67159 10.7669 6.67189 10.5852 6.60553 10.423C6.53918 10.2608 6.4115 10.1312 6.25011 10.0621C6.08872 9.9931 5.90658 9.99021 5.74307 10.0541C5.57957 10.118 5.44783 10.2435 5.37634 10.4035L3.3714 15.0706C3.30158 15.2331 3.29932 15.4166 3.36512 15.5808C3.43092 15.7449 3.55939 15.8763 3.72226 15.946C3.80534 15.982 3.89501 16.0004 3.98558 16C4.11635 16 4.24424 15.9617 4.35341 15.8899C4.46258 15.8181 4.54824 15.7159 4.59976 15.596ZM9.94627 15.596L11.9512 10.9289C11.9873 10.8482 12.0069 10.7611 12.0089 10.6728C12.011 10.5845 11.9954 10.4966 11.9631 10.4143C11.9308 10.3321 11.8824 10.257 11.8208 10.1936C11.7592 10.1301 11.6855 10.0795 11.6041 10.0447C11.5227 10.0099 11.4352 9.99152 11.3466 9.99075C11.2581 9.98997 11.1702 10.0068 11.0883 10.0402C11.0063 10.0735 10.9317 10.1229 10.869 10.1852C10.8063 10.2476 10.7566 10.3218 10.7229 10.4035L8.71791 15.0706C8.6481 15.2331 8.64584 15.4166 8.71164 15.5808C8.77743 15.7449 8.9059 15.8763 9.06878 15.946C9.15186 15.982 9.24152 16.0004 9.33209 16C9.46286 16 9.59076 15.9617 9.69993 15.8899C9.8091 15.8181 9.89475 15.7159 9.94627 15.596ZM11.9512 3.4202C11.8521 3.39618 11.7596 3.35045 11.6804 3.28633C11.6012 3.22221 11.5374 3.14131 11.4934 3.0495C10.9822 1.98445 10.1332 1.1173 9.07795 0.582363C8.02269 0.0474307 6.82007 -0.125428 5.65637 0.0905631C4.58552 0.289155 3.60179 0.811481 2.83858 1.58671C2.07537 2.36195 1.5696 3.35258 1.38985 4.42429C1.28211 5.06253 1.28958 5.71484 1.4119 6.35046C1.42752 6.45615 1.41693 6.56406 1.38104 6.66472C1.34516 6.76538 1.28507 6.85573 1.20606 6.92784C0.754807 7.33867 0.412525 7.85455 0.209764 8.42947C0.00700247 9.00438 -0.0499303 9.62042 0.0440469 10.2226C0.138024 10.8248 0.379987 11.3945 0.748342 11.8807C1.1167 12.3669 1.59998 12.7545 2.15507 13.0091C2.2274 13.04 2.30515 13.0564 2.38384 13.0572C2.46254 13.0581 2.54063 13.0434 2.61361 13.014C2.6866 12.9847 2.75304 12.9412 2.80911 12.8861C2.86519 12.831 2.90978 12.7654 2.94034 12.693L4.14999 9.87744C4.25386 9.63578 4.40447 9.41692 4.59321 9.23338C4.78195 9.04985 5.00511 8.90524 5.24993 8.80783C5.49474 8.71042 5.75641 8.66212 6.01995 8.6657C6.2835 8.66928 6.54375 8.72466 6.78582 8.82868C6.96312 8.91808 7.15967 8.96281 7.35829 8.95897C7.55692 8.95514 7.75159 8.90285 7.92529 8.80668C8.16742 8.69741 8.43075 8.64284 8.69647 8.64688C8.96219 8.65091 9.22373 8.71345 9.46241 8.83002C9.63983 8.91715 9.83562 8.96051 10.0333 8.95645C10.231 8.95239 10.4249 8.90103 10.5985 8.80668C10.8418 8.70166 11.1046 8.64937 11.3696 8.65327C11.6345 8.65718 11.8957 8.7172 12.1357 8.82935C12.3815 8.93736 12.6034 9.0932 12.7881 9.28774C12.9729 9.48229 13.117 9.71163 13.2119 9.96237C13.3068 10.2131 13.3506 10.4802 13.3408 10.748C13.331 11.0159 13.2678 11.2791 13.1549 11.5223L12.8327 12.2723C12.8021 12.342 12.7935 12.4193 12.8082 12.494C12.8229 12.5686 12.8602 12.637 12.9149 12.6899C12.9697 12.7428 13.0394 12.7777 13.1147 12.79C13.19 12.8022 13.2672 12.7912 13.336 12.7584C17.285 10.7575 16.8607 4.39295 11.9492 3.4202H11.9512Z"
                          fill="#3A64F6"
                        ></path>
                      </svg>{' '}
                      <div className="skeleton h-2 w-12 bg-mono-60"></div>
                    </li>
                    <li className="divider mx-2 w-[2px] h-3 bg-border-100"></li>
                    <li className="externalrollingnoiseindbt flex items-center gap-2 font-bold text-[14px]">
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
                      <div className="skeleton h-2 w-12 bg-mono-60"></div>
                    </li>
                  </ul>
                  <ul className="payment-method-list flex flex-wrap items-center gap-2">
                    <li className="payment-item">
                      <Image
                        src="/images/icons/payments/Visa.png"
                        alt="payment methods icons"
                        width={45}
                        height={48}
                      />
                    </li>

                    <li className="payment-item">
                      <Image
                        src="/images/icons/payments/Mastercard.png"
                        alt="payment methods icons"
                        width={45}
                        height={48}
                      />
                    </li>

                    <li className="payment-item">
                      <Image
                        src="/images/icons/payments/UnionPay.png"
                        alt="payment methods icons"
                        width={45}
                        height={48}
                      />
                    </li>
                    <li className="payment-item">
                      <Image
                        src="/images/icons/payments/Amex.png"
                        alt="payment methods icons"
                        width={45}
                        height={48}
                      />
                    </li>
                    {/* <li className="payment-item">
                <Image
                  src="/images/icons/payments/Klarna.svg"
                  alt="payment methods icons"
                  width={70}
                  height={48}
                />
              </li> */}
                    <li className="payment-item">
                      <Image
                        src="/images/icons/payments/payment-paypal.svg"
                        alt="payment methods icons"
                        width={65}
                        height={48}
                      />
                    </li>
                    {/* <li className="payment-item">
                <Image
                  src="/images/icons/payments/icon-payment-ico-amazon-pay.svg"
                  alt="payment methods icons"
                  width={87}
                  height={80}
                />
              </li> */}
                  </ul>
                </div>

                <div className="product-cta-box flex flex-col gap-2 mb-6 max-w-[306px] sm:max-w-[375px] w-full">
                  <div className="product-card-btn-states">
                    <Link href="" className="block w-full">
                      <button
                        type="button"
                        className="w-full !border-primary-100 bg-primary-100 text-mono-0 border py-2 px-6 rounded-full cursor-pointer hover:!text-primary-100 transition ease-in hover:!border-primary-100 hover:bg-transparent"
                        //   variant="secondary"
                      >
                        <div className="skeleton h-2 w-12 bg-mono-60"></div>
                      </button>
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const modal = document.getElementById(
                        'my_modal_3'
                      ) as HTMLDialogElement;
                      modal?.showModal();
                    }}
                    className="flex items-center gap-2 py-2 px-6 rounded-[4px] text-[14px] justify-center w-full cursor-pointer"
                  >
                    ➕ Add to comparison
                  </button>

                  <dialog id="my_modal_3" className="modal">
                    <div className="modal-box bg-mono-0">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-1 top-1 hover:!bg-primary-100 border-primary-100">
                          ✕
                        </button>
                      </form>
                      <h3 className="font-bold text-lg">Comparison Table</h3>
                      <p className="py-4">
                        Press ESC key or click on ✕ button to close
                      </p>
                    </div>
                  </dialog>
                </div>

                <div className="product-specification-box">
                  <div className="FAQ-list">
                    <div className="collapse collapse-plus bg-mono-0 border border-border-100 mb-3">
                      <input type="radio" name="my-accordion-3" />
                      <div className="collapse-title font-semibold text-primary-70 h6 text-[16px]">
                        Description
                      </div>
                      <div className="collapse-content caption-regular font-primary">
                        <div className="skeleton h-2 w-12 bg-mono-60"></div>
                      </div>
                    </div>
                    <div className="collapse collapse-plus bg-mono-0 border border-border-100 mb-3">
                      <input
                        type="radio"
                        name="my-accordion-3"
                        defaultChecked
                      />
                      <div className="collapse-title font-semibold text-primary-70 h6 text-[16px]">
                        Additional Information
                      </div>
                      <div className="collapse-content caption-regular font-primary border-t border-t-border-100 !px-0 !pb-0">
                        <ul className="product-specification-table mt-3 border border-border-100 border-b-transparent">
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              category
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              brand
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Fuel class
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Wet grip class
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Size
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Width
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Height
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Diameter
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Speed ​​index
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Load index
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-r border-r-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              GTIN / EAN
                            </div>
                            <div className="right-cont px-4 body-regular py-2 w-full">
                              <div className="skeleton h-2 w-12 bg-mono-60"></div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="product-singlepage-section">
          <div className="custom-container max-w-[960px] w-full">
            <div className="product-breadcrumb-area pt-4 pb-10 max-sm:pb-4">
              <ul className="breadcrumb-area flex items-center justify-center max-sm:flex-wrap gap-[10px] max-sm:gap-1">
                <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
                  <Link
                    className="body-caption capitalize text-mono-100"
                    href="/"
                  >
                    Home
                  </Link>
                  <span className="angle">{'>'}</span>
                </li>
                <li className="breadcrumb-item body-caption prev-pages flex items-center gap-[10px]">
                  <Link
                    className="body-caption capitalize text-mono-100"
                    href=""
                  >
                    {product.merchant_product_third_category || 'Products'}
                  </Link>
                  <span className="angle">{'>'}</span>
                </li>
                <li className="breadcrumb-item body-caption current-page text-mono-70 flex items-center gap-[10px]">
                  <span className="body-caption text-mono-70">
                    {product.product_name}
                  </span>
                </li>
              </ul>
            </div>

            <div className="product-singlepage-cont-wrapper w-full max-w-[895px] flex items-start justify-between gap-9 max-lg:gap-12 max-md:gap-10 max-sm:gap-12 pb-6 max-sm:pb-12 max-sm:flex-col">
              <div className="product-singlepage-left-cont px-3 py-2 max-w-[415px] sticky max-md:relative top-6 max-md:top-0 w-full">
                <div className="swiper-product-slider-area relative">
                    <div className="brand-logo inline-block px-4 py-2 border border-primary-100 rounded-[4px] bg-mono-0">
                    {product.brand_logo && product.brand_logo !== '0' ? (
                      <Image
                      src={product.brand_logo}
                      alt={product.brand_name || ''}
                      width={110}
                      height={85}
                      />
                    ) : (
                      <span className="font-bold text-primary-100 text-md">{product.brand_name}</span>
                    )}
                    </div>
                  <div className="swiper-slider-view w-full relative">
                    <Swiper
                      spaceBetween={10}
                      effect="fade"
                      loop
                      thumbs={{ swiper: thumbsSwiper }}
                      modules={[EffectFade, FreeMode, Navigation, Thumbs]}
                      breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 1 },
                        1024: { slidesPerView: 1 },
                      }}
                      className="thumbs w-full rounded-lg"
                    >
                      {product.product_image ? (
                        Array.isArray(product.product_image) ? (
                          product.product_image.map(
                            (image: string, index: number) => (
                              <SwiperSlide key={index}>
                                <div className="slide-view-item flex justify-center">
                                  <Image
                                    src={image}
                                    alt="product image item"
                                    className=" max-md:h-[380px] max-md:w-auto"
                                    width={319}
                                    height={452}
                                  />
                                </div>
                              </SwiperSlide>
                            )
                          )
                        ) : (
                          <SwiperSlide key={0}>
                            <div className="slide-view-item flex justify-center">
                              <Image
                                src={product.product_image}
                                alt="product image item"
                                className=" max-md:h-[380px] max-md:w-auto"
                                width={319}
                                height={452}
                              />
                            </div>
                          </SwiperSlide>
                        )
                      ) : null}
                    </Swiper>
                    <div className="selected-charity-image"></div>
                  </div>

                  <div className="swiper-product-slide-tab-item mt-8 flex justify-center items-center">
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      loop={false}
                      spaceBetween={12}
                      slidesPerView={6}
                      freeMode
                      navigation
                      // autoplay={{ delay: 6000, disableOnInteraction: false }}
                      watchSlidesProgress
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="w-full rounded-lg"
                      breakpoints={{
                        640: { slidesPerView: 6, spaceBetween: 12 },
                        738: { slidesPerView: 6, spaceBetween: 12 },
                        1024: { slidesPerView: 6, spaceBetween: 12 },
                      }}
                    >
                      {product.product_image ? (
                        Array.isArray(product.product_image) ? (
                          product.product_image.map(
                            (image: string, index: number) => (
                              <SwiperSlide key={index}>
                                <div className="slide-tab-item p-2 w-16 h-[80px]">
                                  <div className="slide-tab-item-wrap border-1 border-mono-60  w-14 h-14  flex justify-center">
                                    <Image
                                      src={image}
                                      alt="product image item"
                                      className="w-auto h-14 object-cover cursor-pointer"
                                      width={48}
                                      height={48}
                                    />
                                  </div>
                                </div>
                              </SwiperSlide>
                            )
                          )
                        ) : (
                          <SwiperSlide key={0}>
                            <div className="slide-tab-item p-2 w-16 h-[80px]">
                              <div className="slide-tab-item-wrap border-1 border-mono-60  w-14 h-14  flex justify-center">
                                <Image
                                  src={product.product_image}
                                  alt="product image item"
                                  className="w-auto h-14 object-cover cursor-pointer"
                                  width={48}
                                  height={48}
                                />
                              </div>
                            </div>
                          </SwiperSlide>
                        )
                      ) : null}
                    </Swiper>
                  </div>
                </div>
              </div>

              <div className="product-singlepage-right-cont  w-full">
                <ul className="product-highlight-info mb-4 flex items-center flex-wrap gap-2">
                  <li className="product-highlight-info-item text-[12px] caption py-1 px-3 rounded-[16px] bg-purple-100 text-primary-70 font-semibold border border-border-100">
                    Free Shipping
                  </li>
                  <li className="product-highlight-info-item text-[12px] caption py-1 px-3 rounded-[16px] bg-purple-100 text-primary-70 font-semibold border border-border-100">
                    Availability: {product.delivery_time || 'N/A'}
                  </li>
                  <li className="product-highlight-info-item text-[12px] caption py-1 px-3 rounded-[16px] bg-purple-100 text-primary-70 font-semibold border border-border-100">
                    {product.merchant_product_third_category || 'N/A'}
                  </li>
                  <li className="product-highlight-info-item text-[12px] caption py-1 px-3 rounded-[16px] bg-purple-100 text-primary-70 font-semibold border border-border-100">
                    {product.in_stock === '1' ? 'In Stock' : 'Not Available'}
                  </li>
                </ul>
                <p className="product-brand text-primary-100 font-bold text-[18px] max-md:text-[16px] uppercase text-left  mb-2">
                  {product.brand_name || 'brand name'}
                </p>
                <h5 className="product-title h4 font-secondary max-md:text-[18px] text-primary-70 mb-2">
                  {product.product_name || 'product name'}
                </h5>

                <div className="product-price-group flex flex-col gap-2 mb-4 max-w-[306px] sm:max-w-[375px] w-full">
                  <p className="input-type-text text-primary-70 font-medium text-[18px] capitalized text-left w-full">
                    <span className="font-bold text-[14px]">Price:</span> €{''}
                    {product.search_price || '0.00'}
                  </p>
                  <ul className="attributes flex items-center justify-start mb-4">
                    <li className="fuelclass flex items-center gap-2 font-bold text-[14px]">
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
                      {product.fuel_class || 'N/A'}
                    </li>
                    <li className="divider mx-2 w-[2px] h-3 bg-border-100"></li>
                    <li className="wetgripclass flex items-center gap-2 font-bold text-[14px]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Wetgrip Class</title>
                        <path
                          d="M6.65884 16C6.56826 16.0004 6.4786 15.982 6.39552 15.946C6.23264 15.8763 6.10418 15.7449 6.03838 15.5808C5.97258 15.4166 5.97484 15.2331 6.04466 15.0706L8.0496 10.4035C8.12108 10.2435 8.25282 10.118 8.41633 10.0541C8.57984 9.99021 8.76198 9.9931 8.92337 10.0621C9.08476 10.1312 9.21244 10.2608 9.27879 10.423C9.34514 10.5852 9.34485 10.7669 9.27796 10.9289L7.27302 15.596C7.22149 15.7159 7.13584 15.8181 7.02667 15.8899C6.9175 15.9617 6.78961 16 6.65884 16ZM4.59976 15.596L6.6047 10.9289C6.67159 10.7669 6.67189 10.5852 6.60553 10.423C6.53918 10.2608 6.4115 10.1312 6.25011 10.0621C6.08872 9.9931 5.90658 9.99021 5.74307 10.0541C5.57957 10.118 5.44783 10.2435 5.37634 10.4035L3.3714 15.0706C3.30158 15.2331 3.29932 15.4166 3.36512 15.5808C3.43092 15.7449 3.55939 15.8763 3.72226 15.946C3.80534 15.982 3.89501 16.0004 3.98558 16C4.11635 16 4.24424 15.9617 4.35341 15.8899C4.46258 15.8181 4.54824 15.7159 4.59976 15.596ZM9.94627 15.596L11.9512 10.9289C11.9873 10.8482 12.0069 10.7611 12.0089 10.6728C12.011 10.5845 11.9954 10.4966 11.9631 10.4143C11.9308 10.3321 11.8824 10.257 11.8208 10.1936C11.7592 10.1301 11.6855 10.0795 11.6041 10.0447C11.5227 10.0099 11.4352 9.99152 11.3466 9.99075C11.2581 9.98997 11.1702 10.0068 11.0883 10.0402C11.0063 10.0735 10.9317 10.1229 10.869 10.1852C10.8063 10.2476 10.7566 10.3218 10.7229 10.4035L8.71791 15.0706C8.6481 15.2331 8.64584 15.4166 8.71164 15.5808C8.77743 15.7449 8.9059 15.8763 9.06878 15.946C9.15186 15.982 9.24152 16.0004 9.33209 16C9.46286 16 9.59076 15.9617 9.69993 15.8899C9.8091 15.8181 9.89475 15.7159 9.94627 15.596ZM11.9512 3.4202C11.8521 3.39618 11.7596 3.35045 11.6804 3.28633C11.6012 3.22221 11.5374 3.14131 11.4934 3.0495C10.9822 1.98445 10.1332 1.1173 9.07795 0.582363C8.02269 0.0474307 6.82007 -0.125428 5.65637 0.0905631C4.58552 0.289155 3.60179 0.811481 2.83858 1.58671C2.07537 2.36195 1.5696 3.35258 1.38985 4.42429C1.28211 5.06253 1.28958 5.71484 1.4119 6.35046C1.42752 6.45615 1.41693 6.56406 1.38104 6.66472C1.34516 6.76538 1.28507 6.85573 1.20606 6.92784C0.754807 7.33867 0.412525 7.85455 0.209764 8.42947C0.00700247 9.00438 -0.0499303 9.62042 0.0440469 10.2226C0.138024 10.8248 0.379987 11.3945 0.748342 11.8807C1.1167 12.3669 1.59998 12.7545 2.15507 13.0091C2.2274 13.04 2.30515 13.0564 2.38384 13.0572C2.46254 13.0581 2.54063 13.0434 2.61361 13.014C2.6866 12.9847 2.75304 12.9412 2.80911 12.8861C2.86519 12.831 2.90978 12.7654 2.94034 12.693L4.14999 9.87744C4.25386 9.63578 4.40447 9.41692 4.59321 9.23338C4.78195 9.04985 5.00511 8.90524 5.24993 8.80783C5.49474 8.71042 5.75641 8.66212 6.01995 8.6657C6.2835 8.66928 6.54375 8.72466 6.78582 8.82868C6.96312 8.91808 7.15967 8.96281 7.35829 8.95897C7.55692 8.95514 7.75159 8.90285 7.92529 8.80668C8.16742 8.69741 8.43075 8.64284 8.69647 8.64688C8.96219 8.65091 9.22373 8.71345 9.46241 8.83002C9.63983 8.91715 9.83562 8.96051 10.0333 8.95645C10.231 8.95239 10.4249 8.90103 10.5985 8.80668C10.8418 8.70166 11.1046 8.64937 11.3696 8.65327C11.6345 8.65718 11.8957 8.7172 12.1357 8.82935C12.3815 8.93736 12.6034 9.0932 12.7881 9.28774C12.9729 9.48229 13.117 9.71163 13.2119 9.96237C13.3068 10.2131 13.3506 10.4802 13.3408 10.748C13.331 11.0159 13.2678 11.2791 13.1549 11.5223L12.8327 12.2723C12.8021 12.342 12.7935 12.4193 12.8082 12.494C12.8229 12.5686 12.8602 12.637 12.9149 12.6899C12.9697 12.7428 13.0394 12.7777 13.1147 12.79C13.19 12.8022 13.2672 12.7912 13.336 12.7584C17.285 10.7575 16.8607 4.39295 11.9492 3.4202H11.9512Z"
                          fill="#3A64F6"
                        ></path>
                      </svg>{' '}
                      {product.wet_grip || 'N/A'}
                    </li>
                    <li className="divider mx-2 w-[2px] h-3 bg-border-100"></li>
                    <li className="externalrollingnoiseindbt flex items-center gap-2 font-bold text-[14px]">
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
                      {product.noise_class} dB
                    </li>
                  </ul>
                  <ul className="payment-method-list flex flex-wrap items-center gap-2">
                    <li className="payment-item">
                      <Image
                        src="/images/icons/payments/Visa.png"
                        alt="payment methods icons"
                        width={45}
                        height={48}
                      />
                    </li>

                    <li className="payment-item">
                      <Image
                        src="/images/icons/payments/Mastercard.png"
                        alt="payment methods icons"
                        width={45}
                        height={48}
                      />
                    </li>

                    <li className="payment-item">
                      <Image
                        src="/images/icons/payments/UnionPay.png"
                        alt="payment methods icons"
                        width={45}
                        height={48}
                      />
                    </li>
                    <li className="payment-item">
                      <Image
                        src="/images/icons/payments/Amex.png"
                        alt="payment methods icons"
                        width={45}
                        height={48}
                      />
                    </li>
                    {/* <li className="payment-item">
                  <Image
                    src="/images/icons/payments/Klarna.svg"
                    alt="payment methods icons"
                    width={70}
                    height={48}
                  />
                </li> */}
                    <li className="payment-item">
                      <Image
                        src="/images/icons/payments/payment-paypal.svg"
                        alt="payment methods icons"
                        width={65}
                        height={48}
                      />
                    </li>
                    {/* <li className="payment-item">
                  <Image
                    src="/images/icons/payments/icon-payment-ico-amazon-pay.svg"
                    alt="payment methods icons"
                    width={87}
                    height={80}
                  />
                </li> */}
                  </ul>
                </div>

                <div className="product-cta-box flex flex-col gap-2 mb-6 max-w-[306px] sm:max-w-[375px] w-full">
                  <div className="product-card-btn-states">
                    <Link href={product.product_url} className="block w-full">
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 !border-primary-100 bg-primary-100 text-mono-0 border py-2 px-6 rounded-full cursor-pointer  transition ease-in hover:!border-primary-100 hover:opacity-80"
                        //   variant="secondary"
                      >
                        <Image
                          src="/images/icons/shopping-bag.png"
                          className="w-5 h-5"
                          alt="cart icon"
                          width={24}
                          height={24}
                        />{' '}
                        To the offer
                      </button>
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={handleCompareClick}
                    className="flex items-center gap-2 py-2 px-6 rounded-[4px] text-[14px] justify-center w-full cursor-pointer"
                  >
                    ➕ Add to comparison
                  </button>

                  <dialog id="my_modal_3" className="modal">
                    <div className="modal-box bg-mono-0">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-1 top-1 hover:!bg-primary-100 border-primary-100">
                          ✕
                        </button>
                      </form>
                      <h3 className="font-bold text-lg">Comparison Table</h3>
                      <p className="py-4">
                        Press ESC key or click on ✕ button to close
                      </p>
                    </div>
                  </dialog>
                </div>

                <div className="product-specification-box">
                  <div className="FAQ-list">
                    <div className="collapse collapse-plus bg-mono-0 border border-border-100 mb-3">
                      <input type="radio" name="my-accordion-3" />
                      <div className="collapse-title font-semibold text-primary-70 h6 text-[16px]">
                        Description
                      </div>
                      <div className="collapse-content text-[14px] font-primary">
                        {product.description || 'No description available'}
                      </div>
                    </div>
                    <div className="collapse collapse-plus bg-mono-0 border border-border-100 mb-3">
                      <input
                        type="radio"
                        name="my-accordion-3"
                        defaultChecked
                      />
                      <div className="collapse-title font-semibold text-primary-70 h6 text-[16px]">
                        Additional Information
                      </div>
                      <div className="collapse-content caption-regular font-primary border-t border-t-border-100 !px-0 !pb-0">
                        <ul className="product-specification-table mt-3 border border-border-100 border-b-transparent">
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              category
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              {product.merchant_product_third_category || 'N/A'}
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              brand
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              {product.brand_name || 'N/A'}
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Fuel class
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              {product.fuel_class || 'N/A'}
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Wet grip class
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              {product.wet_grip || 'N/A'}
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Size
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              {product.dimensions}
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Width
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              {product.width || 'N/A'}
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Height
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              {product.height || 'N/A'}
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Diameter
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              {product.diameter || 'N/A'}
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Speed ​​index
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              {product.speedIndex || 'N/A'}
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-b border-r border-r-border-100 border-b-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              Load index
                            </div>
                            <div className="right-cont px-4 body-regular py-2 border-b border-b-border-100 w-full">
                              {product.lastIndex || 'N/A'}
                            </div>
                          </li>
                          <li className="details-items  flex items-center gap-0">
                            <div className="left-cont px-3 py-2 border-r border-r-border-100 max-w-[160px] w-full capitalize font-semibold body-regular font-primary">
                              GTIN / EAN
                            </div>
                            <div className="right-cont px-4 body-regular py-2 w-full">
                              {product.ean}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-container">
            {/* name of each tab group should be unique */}
            <div className="tabs tabs-box bg-mono-0 pb-16">
              <input
                type="radio"
                name="my_tabs_6"
                className="tab !text-[18px] !text-primary-70 !shadow-none focus:!rounded-[4px] !py-0 !rounded-[4px] !bg-transparent !px-6 border-border-100 !border hover:border-primary-100 hover:!bg-primary-100 transition ease-in hover:!text-mono-0 !leading-[150%]"
                aria-label="Angebote"
                defaultChecked
              />
              <div className="tab-content !text-primary-70 bg-mono-0 body-regular border-base-300 p-6 border-t border-t-border-100 mt-4 pl-0">
                <div className="offer-slider-area">
                  <div className="product-slides-area pr-4 pl-2 max-sm:px-0 overflow-hidden">
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={1}
                      navigation
                      modules={[Navigation, Autoplay]}
                      autoplay={{ delay: 3900, disableOnInteraction: false }}
                      breakpoints={{
                        640: { slidesPerView: 1, spaceBetween: 10 },
                        768: { slidesPerView: 1, spaceBetween: 15 },
                        1024: { slidesPerView: 1, spaceBetween: 20 },
                      }}
                    >
                      {product.offers?.map((product, index) => (
                        <SwiperSlide key={`${product.brand}-${index}`}>
                          <div className="offer-product-card-item border border-border-100 rounded-[4px] bg-mono-0 px-8 py-4">
                            <div className="offer-product-card-inner flex justify-between items-center gap-0">
                              <div className="offer-product-card-img pt-0 pb-0">
                                <Image
                                  src={product.vendor_logo}
                                  alt={`${product.vendor} logo`}
                                  width={150}
                                  height={150}
                                  className="w-auto h-[150px] object-contain rounded-[4px]"
                                />
                              </div>

                              <div className="offer-product-card-content flex flex-col gap-2">
                                <p className="product-brand text-primary-100 font-bold text-[14px] uppercase text-left">
                                  {product.brand_name}
                                </p>
                                <p className="text-mono-100 font-bold text-[12px] capitalize text-left">
                                  {product.product_category}
                                </p>
                                <h5 className="h6 font-secondary text-primary-70 mb-1">
                                  {product.product_name}
                                </h5>
                              </div>
                              <div className="offer-product-card-content flex flex-col gap-2">
                                <p className="text-primary-70 font-bold text-[14px]">
                                  {product.delivery_cost === '0.00'
                                    ? 'Free delivery'
                                    : 'delivery cost: ' + product.delivery_cost}
                                </p>

                                <p className="text-primary-70 font-bold text-[14px]">
                                  {product.delivery_time || 'N/A'}
                                </p>
                              </div>
                              <div className="offer-product-card-btn-states mt-4">
                                <p className="text-primary-70 font-bold text-center text-[18px] mb-2">
                                  €{product.price}
                                </p>
                                <Link
                                  href={product.original_affiliate_url}
                                  className="block w-full"
                                >
                                  <button
                                    type="button"
                                    className="w-full flex items-center gap-2 border border-primary-100 bg-primary-100 text-mono-0 py-2 px-6 rounded-full cursor-pointer  hover:border-primary-100 hover:opacity-80 transition ease-in"
                                  >
                                    <Image
                                      src="/images/icons/shopping-bag.png"
                                      className="w-5 h-5"
                                      alt="cart icon"
                                      width={24}
                                      height={24}
                                    />{' '}
                                    To the offer
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
              {/* <input
                type="radio"
                name="my_tabs_6"
                className="tab !text-[18px] !text-primary-70 !shadow-none focus:!rounded-[4px] !py-0 !rounded-[4px] ml-4 !bg-transparent !px-6 border-border-100 !border hover:border-primary-100 hover:!bg-primary-100 transition ease-in hover:!text-mono-0 !leading-[150%]"
                aria-label="Customer Reviews"
              />
              <div className="tab-content !text-primary-70 bg-mono-0 body-regular border-base-300 p-6  border-t border-t-border-100 mt-4 pl-0">
                Customers Review
              </div> */}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductSinglepage;

