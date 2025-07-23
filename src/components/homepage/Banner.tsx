// 'use client';

// import React, { useEffect, useState, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchFilters, resetSubFilters, FilterOption } from '@/store/filterSlice';
// import { debounce } from 'lodash';
// import Image from 'next/image';
// import { AppDispatch, RootState } from '@/store/store';

// const BannerSection = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();

//   const [category, setCategory] = useState('');
//   const [width, setWidth] = useState('');
//   const [height, setHeight] = useState('');
//   const [diameter, setDiameter] = useState('');

//   const { categories, widths, heights, diameters } = useSelector(
//     (state: RootState) => state.filters
//   );

//   const debouncedFetch = useMemo(
//     () => debounce(params => dispatch(fetchFilters(params)), 300),
//     [dispatch]
//   );

//   useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);

//   useEffect(() => {
//     dispatch(fetchFilters({}));
//   }, [dispatch]);

//   useEffect(() => {
//     return () => {
//       debouncedFetch.cancel();
//     };
//   }, [debouncedFetch]);

//   // Initial category load
//   useEffect(() => {
//     dispatch(fetchFilters({}));
//   }, [dispatch]);


//   useEffect(() => {
//     if (!category) {
//       dispatch(resetSubFilters());
//       setWidth('');
//       setHeight('');
//       setDiameter('');
//       dispatch(fetchFilters({}));
//     } else {
//       dispatch(resetSubFilters());
//       setWidth('');
//       setHeight('');
//       setDiameter('');
//       debouncedFetch({ category });
//     }
//   }, [category, dispatch, debouncedFetch]);

//   useEffect(() => {
//     if (!width && category) {
//       setHeight('');
//       setDiameter('');
//       debouncedFetch({ category });
//     }
//     if (width && category) {
//       setHeight('');
//       setDiameter('');
//       debouncedFetch({ category, width });
//     }
//   }, [width, category, debouncedFetch]);

//   useEffect(() => {
//     if (!height && width && category) {
//       setDiameter('');
//       debouncedFetch({ category, width });
//     }
//     if (height && width && category) {
//       setDiameter('');
//       debouncedFetch({ category, width, height });
//     }
//   }, [height, category, width, debouncedFetch]);
  
//   const handleSearch = () => {
//     const params = new URLSearchParams();
//     if (category) params.set('category', category);
//     if (width) params.set('width', width);
//     if (height) params.set('height', height);
//     if (diameter) params.set('diameter', diameter);
//     router.push(`/products?${params.toString()}`);
//   };

//   const renderOptions = (list: FilterOption[]) =>
//     list.map((item, idx) => (
//       <option
//         className="text-[14px] text-left font-normal font-secondary leading-[120%] text-[#86878A]" key={idx}
//         value={item.name}
//       >
//         {item.name} {item.count ? `(${item.count})` : ''}
//       </option>
//     ));

//   return (
//     <section className="banner-section font-primary max-sm:h-auto">
//       <div className="custom-container h-full">
//         <div className="banner-content pt-[56px] pb-[55px] h-full">
//           <div className="tyres-search-area h-full flex items-end justify-center">
//             <div className="tyres-search-content relative">
//               <div className="tyres-search-left-content mb-10 max-sm:mb-8  relative">
//                 <h1 className="h2 text-mono-0 text-center mb-4 text-[48px] leading-[115%] font-medium font-primary max-sm:text-[28px]">
//                   Find the Perfect Tyres <br /> For Your Vehicle
//                 </h1>
//                 <p className="text-[#FFFFFFCC] text-[20px] text-center font-normal font-primary leading-[150%]">
//                   Quickly get tyres suited to your vehicle and driving style.
//                 </p>
//               </div>
//               <div className="tyres-search-main-content max-w-[978px] w-full relative">
//                 <div className="tyres-search-content w-full bg-mono-0 px-[30px] py-6 rounded-[10px]">
//                   <div className="tyre-type-area flex items-end justify-between space-x-3 max-sm:flex-col max-sm:items-start">
//                     <div className="tyres-search-left-content w-full">
//                       <label
//                         htmlFor="vehicle"
//                         className="text-[#86878A] text-[14px] font-normal font-secondary leading-[120%] mb-[7px]"
//                       >
//                         Session tyre
//                       </label>
//                       <select
//                         className="input !rounded-[4px] !outline-none w-full !bg-mono-0 !shadow-none !border-2 !border-solid !border-border-100 px-4 py-2 text-[14px] text-left font-normal font-secondary leading-[120%] !text-[#86878A]"
//                         value={category}
//                         onChange={e => setCategory(e.target.value)}
//                       >
//                         <option
//                           className="text-[14px] text-left font-normal font-secondary leading-[120%] text-[#86878A]"
//                           value=""
//                         >
//                           Select Category
//                         </option>
//                         {renderOptions(categories)}
//                       </select>
//                     </div>
//                     <div className="tyre-dimensions-left-content w-full">
//                       <label
//                         htmlFor="tyre-width"
//                         className="text-[#86878A] text-[14px] font-normal font-secondary leading-[120%] mb-[7px]"
//                       >
//                         Width
//                       </label>
//                       <select
//                         value={width}
//                         onChange={e => setWidth(e.target.value)}
//                         disabled={!category}
//                         className="input !rounded-[4px] !outline-none w-full !bg-mono-0 !shadow-none !border-2 !border-solid !border-border-100 px-4 py-2 text-[14px] text-left font-normal font-secondary leading-[120%] !text-[#86878A]"
//                       >
//                         <option
//                           className="text-[14px] text-left font-normal font-secondary leading-[120%] text-[#86878A]"
//                           value=""
//                         >
//                           Select Width
//                         </option>
//                         {renderOptions(widths)}
//                       </select>
//                     </div>
//                     <div className="tyre-dimensions-right-content w-full">
//                       <label
//                         htmlFor="aspect-ratio"
//                         className="text-[#86878A] text-[14px] font-normal font-secondary leading-[120%] mb-[7px]"
//                       >
//                         Aspect Ratio
//                       </label>
//                       <select
//                         value={height}
//                         onChange={e => setHeight(e.target.value)}
//                         disabled={!width}
//                         className="input !rounded-[4px] !outline-none w-full !bg-mono-0 !shadow-none !border-2 !border-solid !border-border-100 px-4 py-2 text-[14px] text-left font-normal font-secondary leading-[120%] !text-[#86878A]"
//                       >
//                         <option
//                           className="text-[14px] text-left font-normal font-secondary leading-[120%] text-[#86878A]"
//                           value=""
//                         >
//                           Select Height
//                         </option>
//                         {renderOptions(heights)}
//                       </select>
//                     </div>
//                     <div className="tyre-dimensions-right-content w-full">
//                       <label
//                         htmlFor="rim-diameter"
//                         className="text-[#86878A] text-[14px] font-normal font-secondary leading-[120%] mb-[7px]"
//                       >
//                         Diameter
//                       </label>
//                       <select
//                         value={diameter}
//                         onChange={e => setDiameter(e.target.value)}
//                         disabled={!height}
//                         className="input !rounded-[4px] !outline-none w-full !bg-mono-0 !shadow-none !border-2 !border-solid !border-border-100 px-4 py-2 text-[14px] text-left font-normal font-secondary leading-[120%] !text-[#86878A]"
//                       >
//                         <option
//                           className="text-[14px] text-left font-normal font-secondary leading-[120%] text-[#86878A]"
//                           value=""
//                         >
//                           Select Diameter
//                         </option>
//                         {renderOptions(diameters)}
//                       </select>
//                     </div>
//                     <button
//                       onClick={handleSearch}
//                       disabled={!diameter}
//                       className="max-w-[180px] relative  w-full border text-mono-0 bg-primary-100 rounded-[6px] hover:bg-transparent hover:text-primary-100 transition ease !border-primary-100 cursor-pointer py-2 px-6"
//                     >
//                       Search Tyres
//                     </button>
//                   </div>
//                   <button type='button' className='text-[14px] mt-5 font-normal font-secondary  text-left leading-[120%] text-primary-100 cursor-pointer'>More Filters</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BannerSection;
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFilters,
  resetSubFilters,
} from '@/store/filterSlice';
import { debounce } from 'lodash';
import { AppDispatch, RootState } from '@/store/store';
import CustomSelect from '@/components/elements/inputs/CustomCategorySelect';

const BannerSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [diameter, setDiameter] = useState('');

  const { categories, widths, heights, diameters } = useSelector(
    (state: RootState) => state.filters
  );

  const debouncedFetch = useMemo(
    () => debounce(params => dispatch(fetchFilters(params)), 300),
    [dispatch]
  );

  useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);
  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);
  useEffect(
    () => () => {
      debouncedFetch.cancel();
    },
    [debouncedFetch]
  );
  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

  useEffect(() => {
    if (!category) {
      dispatch(resetSubFilters());
      setWidth('');
      setHeight('');
      setDiameter('');
      dispatch(fetchFilters({}));
    } else {
      dispatch(resetSubFilters());
      setWidth('');
      setHeight('');
      setDiameter('');
      debouncedFetch({ category });
    }
  }, [category, dispatch, debouncedFetch]);

  useEffect(() => {
    if (!width && category) {
      setHeight('');
      setDiameter('');
      debouncedFetch({ category });
    }
    if (width && category) {
      setHeight('');
      setDiameter('');
      debouncedFetch({ category, width });
    }
  }, [width, category, debouncedFetch]);

  useEffect(() => {
    if (!height && width && category) {
      setDiameter('');
      debouncedFetch({ category, width });
    }
    if (height && width && category) {
      setDiameter('');
      debouncedFetch({ category, width, height });
    }
  }, [height, category, width, debouncedFetch]);

 const handleSearch = () => {
   const params = new URLSearchParams();
   if (category) params.set('category', category);
   if (width) params.set('width', width);
   if (height) params.set('height', height);
   if (diameter) params.set('diameter', diameter);
   router.push(`/products?${params.toString()}`);
 };


  return (
    <section className="banner-section font-primary max-sm:h-auto">
      <div className="custom-container h-full">
        <div className="banner-content w-full md:pt-[56px]  md:pb-[55px] pt-5 pb-6 h-full">
          <div className="tyres-search-area w-full h-full flex items-end justify-center">
            <div className="tyres-search-content w-full relative">
              <div className="tyres-search-left-content mb-10 max-sm:mb-6  relative">
                <h1 className="h2 text-mono-0 text-center mb-4 md:text-[48px] leading-[115%] font-medium font-primary text-[26px]">
                  Find the Perfect Tyres <br /> For Your Vehicle
                </h1>
                <p className="text-[#FFFFFFCC] text-[20px] max-sm:text-[16px] text-center font-normal font-primary leading-[150%]">
                  Quickly get tyres suited to your vehicle and driving style.
                </p>
              </div>
              <div className="tyres-search-main-content max-w-[978px] w-full relative mx-auto ">
                <div className="lg:h-[152px] h-[188px] md:block hidden w-full"></div>
                <div className="tyres-search-content md:absolute top-0 left-0 w-full bg-mono-0 md:px-[30px] px-4 py-4 md:py-6 rounded-[10px]">
                  <div className="tyre-search-box lg:flex-row flex-col flex items-end gap-5 justify-between w-full">
                    <div className="tyre-type-area flex-wrap flex w-full items-end justify-between gap-x-4 lg:gap-y-5 gap-y-4">
                      <CustomSelect
                        label="Session tyre"
                        options={categories}
                        value={category}
                        onChange={setCategory}
                        placeholder="Select Category"
                      />
                      <CustomSelect
                        label="Width"
                        options={widths}
                        value={width}
                        onChange={setWidth}
                        disabled={!category}
                        placeholder="Select Width"
                      />
                      <CustomSelect
                        label="Aspect Ratio"
                        options={heights}
                        value={height}
                        onChange={setHeight}
                        disabled={!width}
                        placeholder="Select Height"
                      />
                      <CustomSelect
                        label="Diameter"
                        options={diameters}
                        value={diameter}
                        onChange={setDiameter}
                        disabled={!height}
                        placeholder="Select Diameter"
                      />
                      {/* <CustomSelect
                        label="Diameter"
                        options={diameters}
                        value={diameter}
                        onChange={setDiameter}
                        disabled={!height}
                        placeholder="Select Diameter"
                      />
                      <CustomSelect
                        label="Diameter"
                        options={diameters}
                        value={diameter}
                        onChange={setDiameter}
                        disabled={!height}
                        placeholder="Select Diameter"
                      />
                      <CustomSelect
                        label="Diameter"
                        options={diameters}
                        value={diameter}
                        onChange={setDiameter}
                        disabled={!height}
                        placeholder="Select Diameter"
                      />
                      <CustomSelect
                        label="Diameter"
                        options={diameters}
                        value={diameter}
                        onChange={setDiameter}
                        disabled={!height}
                        placeholder="Select Diameter"
                      /> */}
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={!diameter}
                      className="md:max-w-[170px] max-w-[139px] md:text-[16px] text-[12px] font-medium font-primary text-left relative w-full border text-mono-0 bg-primary-100 rounded-[6px] hover:bg-transparent hover:text-primary-100 transition ease !border-primary-100 cursor-pointer py-2 px-6"
                    >
                      Search Tyres
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-primary-100 mt-5 text-[14px] text-left font-secondary font-normal leading-[120%] cursor-pointer lg:relative lg:bottom-0 lg:left-0 absolute bottom-10 left-8 max-sm:left-4"
                  >
                    {/* `More Filters` if ovew then change text to `Fewer Filters` */}
                    More Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
