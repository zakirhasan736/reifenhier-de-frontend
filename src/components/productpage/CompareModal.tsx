// // components/CompareModal.tsx
// 'use client';
// import React, { useRef, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { removeProduct, clearProducts, closeModal } from '@/store/compareSlice';
// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';

// const downloadCSV = (products: any[], relatedProductData) => {
//   const csvContent = [
//     ['Name', 'Brand', 'Dimensions', 'Price', 'Fuel', 'Wet Grip', 'Noise'],
//     ...products.map(p => [
//       p.product_name,
//       p.brand_name,
//       p.dimensions,
//       p.search_price,
//       p.fuel_class,
//       p.wet_grip,
//       p.noise_class,
//     ]),
//   ].map(e => e.join(',')).join('\n');

//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = 'comparison.csv';
//   link.click();
// };

// const CompareModal = () => {
//   const dispatch = useDispatch();
//   const products = useSelector((state: any) => state.compare.products);
//   const isOpen = useSelector((state: any) => state.compare.isOpen);

//   const modalRef = useRef(null);

//   useEffect(() => {
//     const handleOutsideClick = (e: MouseEvent) => {
//       if (modalRef.current && !(modalRef.current as HTMLElement).contains(e.target as Node)) {
//         dispatch(closeModal());
//       }
//     };
//     if (isOpen) {
//       document.addEventListener('mousedown', handleOutsideClick);
//     }
//     return () => document.removeEventListener('mousedown', handleOutsideClick);
//   }, [isOpen, dispatch]);

//   if (!isOpen || products.length === 0) return null;

//   const handleRemove = (id: string) => {
//     dispatch(removeProduct(id));
//     toast.success('Product removed');
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black/60 z-50 flex md:items-center md:justify-center items-end justify-center p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <motion.div
//         ref={modalRef}
//         className="bg-white main-popup-wrapper relative p-4 rounded-t-2xl md:rounded-lg w-full md:max-w-6xl md:max-h-[90vh] overflow-auto"
//         initial={{ y: 100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         exit={{ y: 100, opacity: 0 }}
//       >
//         <button
//           onClick={() => dispatch(closeModal())}
//           className="absolute top-3 right-4 text-[14px] !text-mono-100 cursor-pointer"
//         >
//           ✖
//         </button>

//         <h2 className="text-[22px] font-semibold mb-6 font-secondary">
//           Product Comparison
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="table-auto min-w-full border-collapse text-sm">
//             <thead className="bg-gray-100 sticky top-0 z-10">
//               <tr>
//                 {[
//                   'Image',
//                   'Name',
//                   'Brand',
//                   'Dimensions',
//                   'Price',
//                   'Fuel',
//                   'Wet Grip',
//                   'Noise',
//                   'Remove',
//                 ].map((title, i) => (
//                   <th
//                     key={i}
//                     className="py-4 px-3 text-[13px] font-secondary text-left whitespace-nowrap"
//                   >
//                     {title}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {products.map(p => (
//                 <tr key={p._id} className="text-left border-t">
//                   <td className="px-3 py-2">
//                     <Image
//                       src={p.product_image}
//                       alt={p.product_name}
//                       width={60}
//                       height={60}
//                     />
//                   </td>
//                   <td className="px-3 py-2 text-[13px] whitespace-nowrap">
//                     {p.product_name}
//                   </td>
//                   <td className="px-3 py-2 text-[13px] whitespace-nowrap">
//                     {p.brand_name}
//                   </td>
//                   <td className="px-3 py-2 text-[13px] whitespace-nowrap">
//                     {p.dimensions}
//                   </td>
//                   <td className="px-3 py-2 text-[13px] whitespace-nowrap">
//                     €{p.search_price}
//                   </td>
//                   <td className="px-3 py-2 text-[13px] whitespace-nowrap">
//                     {p.fuel_class}
//                   </td>
//                   <td className="px-3 py-2 text-[13px] whitespace-nowrap">
//                     {p.wet_grip}
//                   </td>
//                   <td className="px-3 py-2 text-[13px] whitespace-nowrap">
//                     {p.noise_class}
//                   </td>
//                   <td className="px-3 py-2 text-[13px] whitespace-nowrap">
//                     <button
//                       onClick={() => handleRemove(p._id)}
//                       className="text-red-500 text-sm hover:underline cursor-pointer"
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => downloadCSV(products)}
//               className="text-sm bg-gray-200 px-4 py-2 rounded-full cursor-pointer"
//             >
//               Download CSV
//             </button>
//             <button
//               onClick={() => {
//                 dispatch(clearProducts());
//                 toast.success('Comparison cleared');
//               }}
//               className="text-sm text-gray-500 underline cursor-pointer"
//             >
//               Clear All
//             </button>
//           </div>
//           <button
//             onClick={() => dispatch(closeModal())}
//             className="bg-primary-100 text-white px-4 py-2 rounded-full max-w-[90px] w-full cursor-pointer"
//           >
//             Close
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default CompareModal;

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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


interface Product {
  _id: string;
  product_name: string;
  brand_name: string;
  dimensions: string;
  search_price: number | string;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  product_image: string;
}

const downloadCSV = (products: Product[]) => {
  const csvContent = [
    ['Name', 'Brand', 'Dimensions', 'Price', 'Fuel', 'Wet Grip', 'Noise'],
    ...products.map(p => [
      p.product_name,
      p.brand_name,
      p.dimensions,                                 
      p.search_price,
      p.fuel_class,
      p.wet_grip,
      p.noise_class,
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
interface RelatedProduct {
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
}

const CompareModal = ({ relatedProducts }: { relatedProducts: RelatedProduct[] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.compare.products);
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

  const handleRemove = (id: string) => {
    dispatch(removeProduct(id));
    toast.success('Product removed');
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex md:items-center md:justify-center items-end justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="bg-white main-popup-wrapper relative p-4 rounded-t-2xl md:rounded-lg w-full md:max-w-6xl md:max-h-[90vh] overflow-auto"
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

        <h2 className="text-[22px] font-semibold mb-6 font-secondary">
          Product Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="table-auto min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {[
                  'Image',
                  'Name',
                  'Brand',
                  'Dimensions',
                  'Price',
                  'Fuel',
                  'Wet Grip',
                  'Noise',
                  'Remove',
                ].map((title, i) => (
                  <th
                    key={i}
                    className="py-4 px-3 text-[13px] font-secondary text-left whitespace-nowrap"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="text-left border-t">
                  <td className="px-3 py-2">
                    <Image
                      src={p.product_image}
                      alt={p.product_name}
                      width={60}
                      height={60}
                    />
                  </td>
                  <td className="px-3 py-2 text-[13px] whitespace-nowrap">
                    {p.product_name}
                  </td>
                  <td className="px-3 py-2 text-[13px] whitespace-nowrap">
                    {p.brand_name}
                  </td>
                  <td className="px-3 py-2 text-[13px] whitespace-nowrap">
                    {p.dimensions}
                  </td>
                  <td className="px-3 py-2 text-[13px] whitespace-nowrap">
                    €{p.search_price}
                  </td>
                  <td className="px-3 py-2 text-[13px] whitespace-nowrap">
                    {p.fuel_class}
                  </td>
                  <td className="px-3 py-2 text-[13px] whitespace-nowrap">
                    {p.wet_grip}
                  </td>
                  <td className="px-3 py-2 text-[13px] whitespace-nowrap">
                    {p.noise_class}
                  </td>
                  <td className="px-3 py-2 text-[13px] whitespace-nowrap">
                    <button
                      onClick={() => handleRemove(p._id)}
                      className="text-red-500 text-sm hover:underline cursor-pointer"
                    >
                      Remove
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
              Download CSV
            </button>
            <button
              onClick={() => {
                dispatch(clearProducts());
                toast.success('Comparison cleared');
              }}
              className="text-sm text-gray-500 underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="bg-primary-100 text-white px-4 py-2 rounded-full max-w-[90px] w-full cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Related Products */}
        <div className="mt-6 border-t pt-4">
          <div className="mt-6 border-t pt-4">
            <button
              onClick={() => setShowRelated(!showRelated)}
              className="text-sm text-primary-100 underline font-medium"
            >
              {showRelated ? 'Hide Related Products' : '➕ Add More Products'}
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
                                {prod.product_name}
                              </p>
                              <p className="text-[12px] text-gray-500">
                                {prod.brand_name}
                              </p>
                            </div>
                            <button
                              onClick={handleAdd}
                              disabled={isAlready}
                              className={`px-3 py-1 text-sm rounded-full ${
                                isAlready
                                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                  : 'bg-primary-100 text-white hover:bg-primary-200'
                              }`}
                            >
                              {isAlready ? 'Added' : 'Add'}
                            </button>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                ) : (
                  <p className="text-sm text-gray-400 mt-4">
                    No related products available.
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
