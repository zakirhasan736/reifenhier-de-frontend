// 'use client';

// import React, { useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchProducts,
//   setFilters,
//   setSort,
//   setPage,
//   removeFilter,
// } from '@/store/productSlice';
// import { debounce } from 'lodash';
// import { CloseIcon, FilterIcon } from '@/icons';
// import { useSearchParams } from 'next/navigation';

// import SortingSearch from '../elements/search/SortingSearch';
// import Pagination from '../elements/Pagination';
// import ProductList from './ProductList';
// import FilterSidebar from '../elements/search/FilterSidebar';
// import { AppDispatch, RootState } from '@/store/store';

// const productsPerPage = 12;

// interface Filters {
//   category: string[];
//   brand: string[];
//   condition: string[];
//   width: string[];
//   height: string[];
//   diameter: string[];
//   speedIndex: string[];
//   lastIndex: string[];
//   noise: string[];
//   fuelClass: string[];
//   wetGrip: string[];
//   additionalOptions: string[];
//   minPrice: number;
//   maxPrice: number;
// }

// type ArrayFilterKey = Exclude<keyof Filters, 'minPrice' | 'maxPrice'>;

// const ARRAY_FILTER_KEYS: ArrayFilterKey[] = [
//   'category',
//   'brand',
//   'condition',
//   'width',
//   'height',
//   'diameter',
//   'speedIndex',
//   'lastIndex',
//   'noise',
//   'fuelClass',
//   'wetGrip',
//   'additionalOptions',
// ];

// const DEFAULT_FILTERS: Filters = {
//   category: [],
//   brand: [],
//   condition: [],
//   width: [],
//   height: [],
//   diameter: [],
//   speedIndex: [],
//   lastIndex: [],
//   noise: [],
//   fuelClass: [],
//   wetGrip: [],
//   additionalOptions: [],
//   minPrice: 0,
//   maxPrice: 99999,
// };

// const ProductListingsSec = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const searchParams = useSearchParams();

//   const {
//     products,
//     filterProducts,
//     total,
//     loading,
//     filters,
//     page,
//     sortField,
//     sortOrder,
//     minPriceLimit,
//     maxPriceLimit,
//   } = useSelector((state: RootState) => state.products);

//   const mergedFilters = useMemo(() => {
//     return { ...DEFAULT_FILTERS, ...filters };
//   }, [filters]);

//   useEffect(() => {
//     if (!searchParams) return;

//     const initialFilters: Partial<Filters> = {};

//     ARRAY_FILTER_KEYS.forEach(key => {
//       const values = searchParams.getAll(key);
//       if (values.length > 0) {
//         initialFilters[key] = values;
//       }
//     });

//     const minPrice = searchParams.get('minPrice');
//     const maxPrice = searchParams.get('maxPrice');
//     if (minPrice) initialFilters.minPrice = Number(minPrice);
//     if (maxPrice) initialFilters.maxPrice = Number(maxPrice);

//     if (Object.keys(initialFilters).length > 0) {
//       dispatch(setFilters(initialFilters as Filters));
//       dispatch(setPage(1));
//     }
//   }, [dispatch, searchParams]);
  
//   const debouncedFetch = useMemo(
//     () =>
//       debounce(() => {
//         dispatch(fetchProducts());
//       }, 300),
//     [dispatch]
//   );

//   useEffect(() => {
//     return () => {
//       debouncedFetch.cancel();
//     };
//   }, [debouncedFetch]);

//   const mergedFilterHash = useMemo(
//     () => JSON.stringify(mergedFilters),
//     [mergedFilters]
//   );

//   useEffect(() => {
//     debouncedFetch();
//     return debouncedFetch.cancel;
//   }, [mergedFilterHash, page, sortField, sortOrder, debouncedFetch]);

//   const handleRemoveFilter = (filterType: ArrayFilterKey, value: string) => {
//     dispatch(removeFilter({ filterType, value }));
//   };

//   const totalPages = Math.ceil(total / productsPerPage);
//   const startIndex = (page - 1) * productsPerPage;
//   const endIndex = Math.min(page * productsPerPage, total);

//   return (
//     <div className="product-listings-sec bg-bg-opacity py-9 max-sm:py-5">
//       <div className="custom-container">
//         <div className="product-listing-wrapper">
//           <div className="product-list-header mb-[23px] max-md:mb-4 flex items-center justify-between gap-5 w-full">
//             <div className="filter-area-box flex items-center gap-8">
//               {/* mobile view filter style start */}
//               <div className="filter-sidebar-search hidden max-md:block">
//                 <input
//                   id="my-drawer-filter"
//                   type="checkbox"
//                   className="drawer-toggle"
//                 />
//                 <div className="drawer-content">
//                   <label
//                     htmlFor="my-drawer-filter"
//                     className="drawer-button btn text-mono-100 !outline-none text-[18px]  !shadow-none !bg-transparent !p-0 !border-none"
//                   >
//                     Filter: {'  '} <FilterIcon />
//                   </label>
//                 </div>
//                 <div className="drawer-side z-[9999999]">
//                   <label
//                     htmlFor="my-drawer-filter"
//                     aria-label="close sidebar"
//                     className="drawer-overlay"
//                   ></label>
//                   <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full max-w-[430px] w-full p-0">
//                     <div className="offcanvas-head mini-cart-header-and-main-wrea min-h-full">
//                       <div className="minicart-header px-6">
//                         <div className="cart-head-top border-b pt-5 pb-5 flex justify-between items-center border-b-mono-60">
//                           <p className="eyebrow-large">Filter Search</p>
//                           <label
//                             htmlFor="my-drawer-filter"
//                             aria-label="close sidebar"
//                             className="close-btn !border-0 !outline-none !shadow-none w-8 h-8 flex items-center justify-center cursor-pointer"
//                           >
//                             <CloseIcon />
//                           </label>
//                         </div>
//                       </div>

//                       <div className="filter-body-product-info px-6">
//                         <div className="empty-product-listing-message my-auto py-12 hidden">
//                           <p className="font-secondary font-medium text-body-caption text-center text-mono-100">
//                             listing is empty
//                           </p>
//                         </div>

//                         <div className="cart-add-product-item-wrapper pt-4">
//                           <div className="product-selected-category-lists flex flex-wrap items-center gap-2">
//                             {ARRAY_FILTER_KEYS.map((key: ArrayFilterKey) =>
//                               mergedFilters[key].map((val, idx) => (
//                                 <span
//                                   key={`${key}-${val}-${idx}`}
//                                   className="selected-filter px-3 py-1 bg-purple-100 rounded-full text-sm flex items-center"
//                                 >
//                                   {typeof val === 'object'
//                                     ? JSON.stringify(val)
//                                     : val}
//                                   <button
//                                     onClick={() => handleRemoveFilter(key, val)}
//                                     className="ml-2 text-red-500"
//                                   >
//                                     ×
//                                   </button>
//                                 </span>
//                               ))
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="offcanvas-main px-6 min-h-full mt-4 pb-8">
//                       <div className="cart-canvas-area min-h-full">
//                         <FilterSidebar
//                           availableProducts={filterProducts}
//                           selectedFilters={mergedFilters}
//                           // onFilterChange={handleFilterChange}
//                           min={minPriceLimit}
//                           max={maxPriceLimit}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* mobile view filter style end */}
//               <div className="product-selected-category-lists max-sm:hidden flex flex-wrap items-center gap-2">
//                 {ARRAY_FILTER_KEYS.map((key: ArrayFilterKey) =>
//                   mergedFilters[key].map((val, idx) => (
//                     <span
//                       key={`${key}-${val}-${idx}`}
//                       className="selected-filter px-3 py-1 bg-purple-100 rounded-full text-sm flex items-center"
//                     >
//                       {typeof val === 'object' ? JSON.stringify(val) : val}
//                       <button
//                         onClick={() => handleRemoveFilter(key, val)}
//                         className="ml-2 text-red-500"
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))
//                 )}
//               </div>
//             </div>
//             <SortingSearch
//               onSortChange={(field, order) => {
//                 dispatch(setSort({ field, order }));
//                 dispatch(setPage(1));
//               }}
//             />
//           </div>
//           <div className="products-lists-main-cont flex items-start max-md:flex-col gap-6">
//             <div className="products-list-main-left-cont overflow-hidden overflow-y-scroll h-[100vh] sticky max-md:relative max-md:h-auto top-9 max-w-[230px] max-md:max-w-[160px] w-full max-md:hidden">
//               <FilterSidebar
//                 availableProducts={filterProducts}
//                 selectedFilters={mergedFilters}
//                 // onFilterChange={handleFilterChange}
//                 min={minPriceLimit}
//                 max={maxPriceLimit}
//               />
//             </div>
//             <div className="products-list-main-right-cont w-full max-md:w-full">
//               <ProductList products={products} loading={loading} />
//               <div className="product-lists-footer mt-[38px] max-md:mt-6 flex max-md:flex-row-reverse max-md:justify-between max-sm:flex-col max-sm:mt-4 items-center">
//                 <div className="pagination-wrapper ml-auto mr-auto max-md:mx-0">
//                   <Pagination
//                     currentPage={page}
//                     totalPages={totalPages}
//                     onPageChange={page => dispatch(setPage(page))}
//                   />
//                 </div>
//                 <div className="showing-current-product">
//                   <span className="caption pr-3 max-md:pr-1">Showing</span>{' '}
//                   <span className="caption">
//                     {startIndex + 1} to {endIndex} of{' '}
//                   </span>
//                   <span className="caption-bold">{total} products</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductListingsSec;
'use client';

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  setFilters,
  setSort,
  setPage,
  // removeFilter,
} from '@/store/productSlice';
import { debounce } from 'lodash';
import { CloseIcon, FilterIcon } from '@/icons';
import { useSearchParams } from 'next/navigation';

import SortingSearch from '../elements/search/SortingSearch';
import Pagination from '../elements/Pagination';
import ProductList from './ProductList';
import FilterSidebar from '../elements/search/FilterSidebar';
import { AppDispatch, RootState } from '@/store/store';

const productsPerPage = 12;

interface Filters {
  category: string[];
  brand: string[];
  condition: string[];
  width: string[];
  height: string[];
  diameter: string[];
  speedIndex: string[];
  lastIndex: string[];
  noise: string[];
  fuelClass: string[];
  wetGrip: string[];
  additionalOptions: string[];
  minPrice: number;
  maxPrice: number;
}

type ArrayFilterKey = Exclude<keyof Filters, 'minPrice' | 'maxPrice'>;

const ARRAY_FILTER_KEYS: ArrayFilterKey[] = [
  'category',
  'brand',
  'condition',
  'width',
  'height',
  'diameter',
  'speedIndex',
  'lastIndex',
  'noise',
  'fuelClass',
  'wetGrip',
  'additionalOptions',
];

const DEFAULT_FILTERS: Filters = {
  category: [],
  brand: [],
  condition: [],
  width: [],
  height: [],
  diameter: [],
  speedIndex: [],
  lastIndex: [],
  noise: [],
  fuelClass: [],
  wetGrip: [],
  additionalOptions: [],
  minPrice: 0,
  maxPrice: 99999,
};

// function isRenderable(val: unknown): val is string | number | boolean {
//   return (
//     typeof val === 'string' ||
//     typeof val === 'number' ||
//     typeof val === 'boolean'
//   );
// }

const ProductListingsSec = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const {
    products,
    filterProducts,
    total,
    loading,
    filters,
    page,
    sortField,
    sortOrder,
    minPriceLimit,
    maxPriceLimit,
  } = useSelector((state: RootState) => state.products);

  const mergedFilters = useMemo(() => {
    return { ...DEFAULT_FILTERS, ...filters };
  }, [filters]);

  useEffect(() => {
    if (!searchParams) return;

    const initialFilters: Partial<Filters> = {};
    ARRAY_FILTER_KEYS.forEach(key => {
      const values = searchParams.getAll(key);
      if (values.length > 0) {
        initialFilters[key] = values;
      }
    });

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice) initialFilters.minPrice = Number(minPrice);
    if (maxPrice) initialFilters.maxPrice = Number(maxPrice);

    if (Object.keys(initialFilters).length > 0) {
      dispatch(setFilters(initialFilters as Filters));
      dispatch(setPage(1));
    }
  }, [dispatch, searchParams]);

  const debouncedFetch = useMemo(
    () => debounce(() => dispatch(fetchProducts()), 300),
    [dispatch]
  );

  useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);

  const mergedFilterHash = useMemo(
    () => JSON.stringify(mergedFilters),
    [mergedFilters]
  );

  useEffect(() => {
    debouncedFetch();
    return debouncedFetch.cancel;
  }, [mergedFilterHash, page, sortField, sortOrder, debouncedFetch]);

  // const handleRemoveFilter = (filterType: ArrayFilterKey, value: string) => {
  //   dispatch(removeFilter({ filterType, value }));
  // };

  const totalPages = Math.ceil(total / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = Math.min(page * productsPerPage, total);

  return (
    <div className="product-listings-sec bg-bg-opacity py-9 max-sm:py-5">
      <div className="custom-container">
        <div className="product-listing-wrapper">
          <div className="product-list-header mb-[23px] max-md:mb-4 flex items-center justify-between gap-5 w-full">
            <div className="filter-area-box flex items-center gap-8">
              <div className="filter-sidebar-search hidden max-md:block">
                <input
                  id="my-drawer-filter"
                  type="checkbox"
                  className="drawer-toggle"
                />
                <div className="drawer-content">
                  <label
                    htmlFor="my-drawer-filter"
                    className="drawer-button btn text-mono-100 !outline-none text-[18px]  !shadow-none !bg-transparent !p-0 !border-none"
                  >
                    Filter: {'  '} <FilterIcon />
                  </label>
                </div>
                <div className="drawer-side z-[9999999]">
                  <label
                    htmlFor="my-drawer-filter"
                    className="drawer-overlay"
                  ></label>
                  <div className="menu bg-mono-0 min-h-full max-w-[430px] w-full p-0">
                    <div className="offcanvas-head min-h-full">
                      <div className="minicart-header px-6">
                        <div className="cart-head-top border-b pt-5 pb-5 flex justify-between items-center border-b-mono-60">
                          <p className="eyebrow-large">Filter Search</p>
                          <label
                            htmlFor="my-drawer-filter"
                            className="close-btn w-8 h-8 flex items-center justify-center cursor-pointer"
                          >
                            <CloseIcon />
                          </label>
                        </div>
                      </div>
                      <div className="filter-body-product-info px-6 pt-4">
                        <div className="product-selected-category-lists flex flex-wrap items-center gap-2">
                          {/* {ARRAY_FILTER_KEYS.map((key: ArrayFilterKey) =>
                            mergedFilters[key].map((val, idx) => {
                              const label = isRenderable(val)
                                ? val
                                : JSON.stringify(val);

                              return (
                                <span
                                  key={`${key}-${idx}`}
                                  className="selected-filter px-3 py-1 bg-purple-100 rounded-full text-sm flex items-center"
                                >
                                  {label}
                                  <button
                                    onClick={() =>
                                      handleRemoveFilter(key, String(val))
                                    }
                                    className="ml-2 text-red-500"
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            })
                          )} */}
                        </div>
                      </div>
                    </div>
                    <div className="offcanvas-main px-6 mt-4 pb-8">
                      <FilterSidebar
                        availableProducts={filterProducts}
                        selectedFilters={mergedFilters}
                        min={minPriceLimit}
                        max={maxPriceLimit}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="product-selected-category-lists max-sm:hidden flex flex-wrap items-center gap-2">
                {/* {ARRAY_FILTER_KEYS.map((key: ArrayFilterKey) =>
                  mergedFilters[key].map((val, idx) => {
                    const label = isRenderable(val) ? val : JSON.stringify(val);
                    return (
                      <span
                        key={`${key}-${idx}`}
                        className="selected-filter px-3 py-1 bg-purple-100 rounded-full text-sm flex items-center"
                      >
                        {label}
                        <button
                          onClick={() => handleRemoveFilter(key, String(val))}
                          className="ml-2 text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })
                )} */}
              </div>
            </div>

            <SortingSearch
              onSortChange={(field, order) => {
                dispatch(setSort({ field, order }));
                dispatch(setPage(1));
              }}
            />
          </div>

          <div className="products-lists-main-cont flex items-start max-md:flex-col gap-6">
            <div className="products-list-main-left-cont overflow-hidden overflow-y-scroll h-[100vh] sticky top-9 max-w-[230px] max-md:hidden">
              <FilterSidebar
                availableProducts={filterProducts}
                selectedFilters={mergedFilters}
                min={minPriceLimit}
                max={maxPriceLimit}
              />
            </div>

            <div className="products-list-main-right-cont w-full">
              <ProductList products={products} loading={loading} />
              <div className="product-lists-footer mt-[38px] flex items-center justify-between max-md:flex-wrap">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={page => dispatch(setPage(page))}
                />
                <div className="showing-current-product">
                  <span className="caption">Showing </span>
                  <span className="caption">
                    {startIndex + 1} to {endIndex} of{' '}
                  </span>
                  <span className="caption-bold">{total} products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingsSec;
