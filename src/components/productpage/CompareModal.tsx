'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '@/types/product';

import {
  removeProduct,
  clearProducts,
  closeModal,
  addProduct,
} from '@/store/compareSlice';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { AppDispatch, RootState } from '@/store/store';
import Link from 'next/link';

const downloadCSV = (products: Product[]) => {
  const csvContent = [
    [
      'Name',
      // 'Marke',
      'Abmessungen',
      'Preis',
      'Nasshaftung',
      'Kraftstoffeffizienz',
      'Rollgeräusch in dB	',
      'Geschwindigkeitsindex',
      'Lastindex',
    ],
    ...products.map(p => [
      p.product_name,
      // p.brand_name,
      p.dimensions,
      p.search_price,
      p.wet_grip,
      p.fuel_class,
      p.noise_class,
      p.speedIndex,
      p.lastIndex,
    ]),
  ]
    .map(e => e.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'comparison.csv';
  link.click();
};

const CompareModal = ({ relatedProducts }: { relatedProducts: Product[] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(
    (state: RootState) => state.compare.products as Product[]
  );
  const isOpen = useSelector((state: RootState) => state.compare.isOpen);
  const [showRelated, setShowRelated] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(e.target as Node)
      ) {
        dispatch(closeModal());
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, dispatch]);

  if (!isOpen || products.length === 0) return null;
  console.log(products);
  const handleRemove = (id: string) => {
    dispatch(removeProduct(id));
    toast.success('Product removed');
  };

  return (
    <motion.div
      className="fixed product-compared-table-box inset-0 bg-[#D9D9D933] bg-blur-2xl z-[99999] flex md:items-center md:justify-center items-end justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="bg-white main-popup-wrapper relative p-4 rounded-t-2xl md:rounded-lg w-full md:max-w-7xl md:max-h-[90vh] overflow-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
      >
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-3 right-4 text-[14px] !text-mono-100 cursor-pointer"
        >
          ✖
        </button>

        <h2 className="text-[22px] font-semibold mb-6 font-secondary text-secondary-100">
          Produktvergleich
        </h2>

        <div className="overflow-x-auto">
          <table className="table-auto min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {[
                  'Bild',
                  'Name',
                  // 'Marke',
                  'Abmessungen',
                  'Preis',
                  'Geschwindigkeitsindex',
                  'Lastenindex',
                  'Kraftstoffeffizienz',
                  'Nasshaftung',
                  'Rollgeräusch in dB',
                  'Entfernen',
                ].map((title, i) => (
                  <th
                    key={i}
                    className="py-4 px-3 text-[13px] font-secondary text-left whitespace-nowrap  text-secondary-100"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr
                  key={p._id}
                  className="text-left border-t  text-secondary-100"
                >
                  <td className="px-3 py-2 text-center min-w-[60px]  text-secondary-100">
                    <Image
                      src={p.product_image}
                      alt={p.product_name}
                      width={60}
                      height={60}
                    />
                  </td>
                  <td className="px-3 py-2 text-left text-[13px] whitespace-break-spaces min-w-[177px] xl:max-w-[130px] w-full  text-secondary-100">
                    <Link href={`/produkte/${p.slug}`}>
                      {[p.brand_name, p.product_name]
                        .filter(Boolean)
                        .join(' ')
                        .toUpperCase()}
                    </Link>
                  </td>
                  {/* <td className="px-3 py-2 text-center text-[13px] whitespace-nowrap">
                    {p.brand_name}
                  </td> */}
                  <td className="px-3 py-2 text-center text-[13px] whitespace-nowrap  text-secondary-100">
                    {p.dimensions}
                  </td>
                  <td className="px-3 py-2 text-center text-[13px] whitespace-nowrap  text-secondary-100">
                    {p.search_price} €
                  </td>
                  <td className="px-3 py-2 text-center text-[13px] whitespace-nowrap  text-secondary-100">
                    {p.speedIndex}
                  </td>
                  <td className="px-3 py-2 text-center text-[13px] whitespace-nowrap  text-secondary-100">
                    {p.lastIndex}
                  </td>
                  <td className="px-3 py-2 text-center text-[13px] whitespace-nowrap  text-secondary-100">
                    {p.fuel_class}
                  </td>
                  <td className="px-3 py-2 text-center text-[13px] whitespace-nowrap  text-secondary-100">
                    {p.wet_grip}
                  </td>
                  <td className="px-3 py-2 text-center text-[13px] whitespace-nowrap  text-secondary-100">
                    {p.noise_class}
                  </td>

                  <td className="px-3 py-2 text-[13px] whitespace-nowrap">
                    <button
                      onClick={() => handleRemove(p._id)}
                      className="text-red-500 text-sm hover:underline cursor-pointer"
                    >
                      Entfernen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => downloadCSV(products)}
              className="text-sm bg-gray-200 px-4 py-2 rounded-full cursor-pointer"
            >
              CSV herunterladen
            </button>
            <button
              onClick={() => {
                dispatch(clearProducts());
                toast.success('Comparison cleared');
              }}
              className="text-sm text-gray-500 underline cursor-pointer"
            >
              Alle löschen
            </button>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="bg-primary-100 text-white px-4 py-2 rounded-full max-w-[120px] w-full cursor-pointer"
          >
            Schließen
          </button>
        </div>

        {/* Related Products */}
        <div className="mt-6 border-t pt-4">
          <div className="mt-6 border-t pt-4">
            <button
              onClick={() => setShowRelated(!showRelated)}
              className="text-sm text-primary-100 underline cursor-pointer font-medium"
            >
              {showRelated
                ? 'Verwandte Produkte ausblenden'
                : '➕ Weitere Produkte hinzufügen'}
            </button>
          </div>

          {showRelated && (
            <div className="mt-4">
              <div className="featured-product-list-area product-slides-area pr-[16px] pl-[10px] max-sm:pr-8 max-sm:pl-0 overflow-hidden">
                {relatedProducts?.length > 0 ? (
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    modules={[Navigation, Autoplay]}
                    autoplay={{ delay: 3900, disableOnInteraction: false }}
                    breakpoints={{
                      640: { slidesPerView: 1, spaceBetween: 10 },
                      768: { slidesPerView: 2, spaceBetween: 15 },
                      1024: { slidesPerView: 3, spaceBetween: 20 },
                    }}
                  >
                    {relatedProducts.map(prod => {
                      const isAlready = products.some(p => p._id === prod._id);

                      const handleAdd = () => {
                        if (products.length >= 4) {
                          toast.error('Maximum of 4 products allowed');
                          return;
                        }
                        if (isAlready) {
                          toast.error('Already added');
                          return;
                        }
                        dispatch(addProduct(prod));
                        toast.success('Added to comparison');
                      };

                      return (
                        <SwiperSlide key={prod._id}>
                          <div className="p-3 border rounded flex items-center gap-4 bg-white shadow-sm min-h-[122px]">
                            <Image
                              src={prod.product_image}
                              alt={prod.product_name}
                              width={50}
                              height={50}
                            />
                            <div className="flex-1">
                              <p className="text-[13px] font-medium">
                                {[
                                  prod.brand_name,
                                  prod.product_name.replace(
                                    /^\d{3}\/\d{2} R\d{2}\s*/,
                                    ''
                                  ),
                                ]
                                  .filter(Boolean)
                                  .join(' ')
                                  .toUpperCase()}
                              </p>
                              <p className="text-[12px] text-gray-500">
                                {prod.brand_name}
                              </p>
                            </div>
                            <button
                              onClick={handleAdd}
                              disabled={isAlready}
                              className={`px-3 py-1 text-sm rounded-full cursor-pointer ${
                                isAlready
                                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                  : 'bg-primary-100 text-white hover:bg-primary-200'
                              }`}
                            >
                              {isAlready ? 'Hinzugefügt' : 'Hinzufügen'}
                            </button>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                ) : (
                  <p className="text-sm text-gray-400 mt-4">
                    Keine verwandten Produkte verfügbar.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CompareModal;
