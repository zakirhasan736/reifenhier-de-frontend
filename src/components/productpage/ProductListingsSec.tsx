'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  setFilters,
  setSort,
  setPage,
  removeFilter,
  setInitialProducts,
} from '@/store/productSlice';
import { Product } from '@/types/product';

import { debounce } from 'lodash';
import { CloseIcon, FilterIcon } from '@/icons';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import SortingSearch from '@elements/search/SortingSearch';
import Pagination from '@elements/Pagination';
import ProductList from './ProductList';
import FilterSidebar from '@elements/search/FilterSidebar';
import { AppDispatch, RootState } from '@/store/store';

const productsPerPage = 12;

interface ProductListingProps {
  initialProducts: Product[];
  total: number;
  initialPage: number;
}
interface Filters {
  kategorie: string[];
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
  'kategorie',
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
  kategorie: [],
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

const FILTER_LABELS: Record<ArrayFilterKey, string> = {
  kategorie: 'Reifentyp',
  brand: 'Marke',
  condition: 'Zustand',
  width: 'Breite',
  height: 'Höhe',
  diameter: 'Durchmesser',
  speedIndex: 'Geschwindigkeitsindex',
  lastIndex: 'Lastindex',
  noise: 'Geräusch',
  fuelClass: 'Kraftstoffeffizienz',
  wetGrip: 'Nasshaftung',
  additionalOptions: 'Optionen',
};

const formatFilterValue = (key: ArrayFilterKey, val: string) => {
  if (!val) return val;
  switch (key) {
    case 'diameter':
      return `R${val}`;
    case 'speedIndex':
      return `SI ${val}`;
    case 'lastIndex':
      return `LI ${val}`;
    case 'noise':
      return /^\d+$/.test(val) ? `${val} dB` : val;
    default:
      return val;
  }
};


const ProductListingsSec: React.FC<ProductListingProps> = ({
  initialProducts,
  total,
  initialPage,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    products,
    filterProducts,
    total: storeTotal,
    loading,
    filters,
    page,
    sortField,
    sortOrder,
    minPriceLimit,
    maxPriceLimit,
  } = useSelector((state: RootState) => state.products);
  // 👇 Hydrate Redux store with SSR data on first render
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current || !initialProducts?.length) return;
    dispatch(
      setInitialProducts({
        products: initialProducts,
        total,
        page: initialPage,
      })
    );
    hasHydrated.current = true;
  }, [dispatch, initialProducts, total, initialPage]);

  const mergedFilters = useMemo(
    () => ({ ...DEFAULT_FILTERS, ...filters }),
    [filters]
  );

  // ---- URL helpers
  const buildSearchParamsFromFilters = (f: Filters) => {
    const params = new URLSearchParams();
    ARRAY_FILTER_KEYS.forEach(key => {
      (f[key] || []).forEach(v => {
        if (v != null && String(v).trim() !== '') params.append(key, String(v));
      });
    });
    if (typeof f.minPrice === 'number')
      params.set('minPrice', String(f.minPrice));
    if (typeof f.maxPrice === 'number')
      params.set('maxPrice', String(f.maxPrice));
    if (sortField) params.set('sortField', String(sortField));
    if (sortOrder) params.set('sortOrder', String(sortOrder));
    if (page) params.set('page', String(page));
    return params;
  };

  // Unique request key per state snapshot
  const requestKey = (f: Filters, p: number, sf: string, so: string) =>
    `${JSON.stringify(f)}|${p}|${sf}|${so}`;

  // Ready flag after URL init
  const [isReady, setIsReady] = useState(false);
  // Last fetched key
  const lastKeyRef = useRef<string>('');
  // Last URL we wrote (to avoid redundant replace)
  const lastQsRef = useRef<string>('');


  useEffect(() => {
    if (!searchParams) return;

    const newFilters: Partial<Filters> = {};

    // Read all array-type filters from query string
    ARRAY_FILTER_KEYS.forEach(key => {
      const values = searchParams.getAll(key);
      newFilters[key] = values.length > 0 ? values : [];
    });

    // Numeric filters
    const qsMin = searchParams.get('minPrice');
    const qsMax = searchParams.get('maxPrice');
    newFilters.minPrice = qsMin ? Number(qsMin) : DEFAULT_FILTERS.minPrice;
    newFilters.maxPrice = qsMax ? Number(qsMax) : DEFAULT_FILTERS.maxPrice;

    // Sorting + pagination
    const qsSortField = searchParams.get('sortField');
    const qsSortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null;
    const qsPage = Number(searchParams.get('page') || 1);

    // Dispatch everything in correct order
    dispatch(setFilters(newFilters as Filters));

    if (qsSortField && qsSortOrder) {
      dispatch(setSort({ field: qsSortField, order: qsSortOrder }));
    } else {
      // optional: reset to default sort if none in URL
      dispatch(setSort({ field: '', order: 'asc' }));
    }

    if (!Number.isNaN(qsPage) && qsPage > 0) {
      dispatch(setPage(qsPage));
    } else {
      dispatch(setPage(1));
    }

    // Mark ready once first sync happens
    if (!isReady) setIsReady(true);
  }, [searchParams?.toString()]);

  // Single debounced fetch (leading-only so it fires immediately, and never twice)
  const debouncedFetch = useRef(
    debounce(
      (key: string) => {
        if (lastKeyRef.current === key) return; // guard
        lastKeyRef.current = key;
        dispatch(fetchProducts());
      },
      250,
      { leading: true, trailing: false } // fire once immediately, no trailing call
    )
  ).current;

  // Kick off fetch whenever state really changes (after init)
  useEffect(() => {
    if (!isReady) return;
    const key = requestKey(mergedFilters, page, sortField, sortOrder);
    debouncedFetch(key);
    return () => {
      debouncedFetch.cancel();
    };
  }, [isReady, mergedFilters, page, sortField, sortOrder, debouncedFetch]);

  // Sync URL without causing extra renders
  const mergedHash = useMemo(
    () => JSON.stringify(mergedFilters),
    [mergedFilters]
  );

  useEffect(() => {
    if (!isReady || !pathname) return; // <- guard null pathname

    const qs = buildSearchParamsFromFilters(mergedFilters).toString();
    if (qs === lastQsRef.current) return;

    lastQsRef.current = qs;

    const href = qs ? `${pathname}?${qs}` : pathname; // pathname is narrowed to string
    router.replace(href, { scroll: false });
  }, [isReady, mergedHash, pathname, router, sortField, sortOrder, page]);

  const handleRemoveFilter = (filterType: ArrayFilterKey, value: string) => {
    dispatch(removeFilter({ filterType, value }));
    dispatch(setPage(1));
  };

  const totalPages = Math.ceil(storeTotal / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = Math.min(page * productsPerPage, storeTotal || total);

  return (
    <div className="product-listings-sec bg-mono-0 pt-12 pb-9 max-sm:pt-12 max-sm:pb-5">
      <div className="custom-container">
        <div className="product-listing-wrapper">
          <div className="product-list-header border-b border-b-[#F5F5F7] mb-6 max-md:mb-4 flex items-center justify-between pb-5 gap-5 w-full">
            <div className="filter-area-box flex items-center gap-8">
              {/* Mobile off-canvas */}
              <div className="filter-sidebar-search xl:hidden block">
                <input
                  id="my-drawer-filter"
                  type="checkbox"
                  className="drawer-toggle"
                />
                <div className="drawer-content">
                  <label
                    htmlFor="my-drawer-filter"
                    className="drawer-button btn text-mono-100 !outline-none text-base md:text-[18px] !shadow-none !bg-transparent !p-0 !border-none flex items-center cursor-pointer"
                  >
                    Filtern: {'  '}
                    <div className="border border-primary-100 rounded-sm w-10 h-9 flex items-center justify-center px-1">
                      <FilterIcon />
                    </div>
                  </label>
                </div>
                <div className="drawer-side z-[9999999]">
                  <label
                    htmlFor="my-drawer-filter"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  />
                  <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full max-w-[430px] w-full p-0">
                    <div className="offcanvas-head mini-cart-header-and-main-wrea min-h-full">
                      <div className="minicart-header px-6">
                        <div className="cart-head-top border-b pt-5 pb-5 flex justify-between items-center border-b-mono-60">
                          <p className="eyebrow-large">Filtersuche</p>
                          <label
                            htmlFor="my-drawer-filter"
                            className="close-btn !border-0 !outline-none !shadow-none w-8 h-8 flex items-center justify-center cursor-pointer"
                          >
                            <CloseIcon />
                          </label>
                        </div>
                      </div>

                      <div className="filter-body-product-info px-6">
                        <div className="cart-add-product-item-wrapper pt-4">
                          <div className="product-selected-category-lists flex flex-wrap items-center gap-2">
                            {ARRAY_FILTER_KEYS.map((key: ArrayFilterKey) => {
                              const selectedValues = mergedFilters[key];
                              if (
                                !selectedValues ||
                                selectedValues.length === 0
                              )
                                return null;

                              return (
                                <span
                                  key={key}
                                  className="selected-filter px-4 py-1 h-9 bg-[#F5F5F7] rounded-full text-[14px] font-normal font-secondary leading-[100%] text-[#404042] flex items-center"
                                >
                                  <strong className="mr-1">
                                    {FILTER_LABELS[key]}:
                                  </strong>{' '}
                                  <span className="flex items-center gap-1">
                                    {selectedValues.map((val, idx) => (
                                      <span
                                        key={idx}
                                        className="flex items-center"
                                      >
                                        {formatFilterValue(key, String(val))}
                                        {/* add comma except last */}
                                        {idx < selectedValues.length - 1 && ','}
                                        <button
                                          onClick={() =>
                                            handleRemoveFilter(key, String(val))
                                          }
                                          className="ml-1 text-primary-100 cursor-pointer"
                                          title={`${FILTER_LABELS[key]} entfernen: ${val}`}
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))}
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="offcanvas-main px-6 min-h-full mt-4 pb-8">
                      <div className="cart-canvas-area min-h-full">
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
              </div>

              {/* Desktop chips */}
              <div className="product-selected-category-lists hidden lg:flex flex-wrap items-center gap-2">
                {ARRAY_FILTER_KEYS.map((key: ArrayFilterKey) => {
                  const selectedValues = mergedFilters[key];
                  if (!selectedValues || selectedValues.length === 0)
                    return null;

                  return (
                    <span
                      key={key}
                      className="selected-filter px-4 py-1 h-9 bg-[#F5F5F7] rounded-full text-[14px] font-normal font-secondary leading-[100%] text-[#404042] flex items-center"
                    >
                      <strong className="mr-1">{FILTER_LABELS[key]}:</strong>{' '}
                      <span className="flex items-center gap-1">
                        {selectedValues.map((val, idx) => (
                          <span key={idx} className="flex items-center">
                            {formatFilterValue(key, String(val))}
                            {/* add comma except last */}
                            {idx < selectedValues.length - 1 && ','}
                            <button
                              onClick={() =>
                                handleRemoveFilter(key, String(val))
                              }
                              className="ml-1 text-primary-100 cursor-pointer"
                              title={`${FILTER_LABELS[key]} entfernen: ${val}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            <SortingSearch
              onSortChange={(field, order) => {
                dispatch(setSort({ field, order }));
                dispatch(setPage(1));
              }}
            />
          </div>

          <div className="products-lists-main-cont flex items-start max-md:flex-col gap-6 max-xl:gap-4">
            <div className="products-list-main-left-cont bg-[#F5F5F7] rounded-[8px] pt-3 sticky top-9 max-w-[282px] max-xl:max-w-[220px] max-md:max-w-[160px] w-full hidden xl:block">
              <h4 className="filter-sidebar-title px-2 text-[18px] text-left font-medium font-secondary leading-[100%] text-[#404042] pb-2">
                Filtern nach
              </h4>
              <FilterSidebar
                availableProducts={filterProducts}
                selectedFilters={mergedFilters}
                min={minPriceLimit}
                max={maxPriceLimit}
              />
            </div>

            <div className="products-list-main-right-cont w-full max-md:w-full">
              <ProductList
                products={products.length ? products : initialProducts}
                loading={loading}
              />

              <div className="product-lists-footer mt-[38px] max-md:mt-6 flex max-md:flex-row-reverse max-md:justify-between max-sm:flex-col max-sm:mt-4 items-center">
                <div className="pagination-wrapper ml-auto mr-auto max-md:mx-0">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={p => dispatch(setPage(p))}
                  />
                </div>
                <div className="showing-current-product text-[#404042]">
                  <span className="caption pr-3 max-md:pr-1">Anzeigen</span>{' '}
                  <span className="caption">
                    {total === 0 ? 0 : startIndex + 1} bis {endIndex} von{' '}
                  </span>
                  <span className="caption-bold">
                    {storeTotal || total} Produkte
                  </span>
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
