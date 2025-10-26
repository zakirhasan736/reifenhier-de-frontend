'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';

import {
  setFilters,
  setPage,
  setSort,
  // fetchProducts,
} from '@/store/productSlice';
import { RootState } from '@/store/store';

import { ArrowDownIcon } from '@/icons';
import Checkbox from '../input-fields/checkbox';
import PriceRangeSlider from '@/components/elements/search/PriceFilter';

interface FilterItem {
  name: string | number;
  count: number | string;
}

interface FilterGroups {
  kategories?: FilterItem[];
  brands?: FilterItem[];
  widths?: FilterItem[];
  heights?: FilterItem[];
  diameters?: FilterItem[];
  speedIndexes?: FilterItem[];
  lastIndexes?: FilterItem[];
  noises?: FilterItem[];
  fuelClasses?: FilterItem[];
  wetGrips?: FilterItem[];
}

interface SelectedFilters {
  kategorie: string[];
  brand: string[];
  width: string[];
  height: string[];
  diameter: string[];
  speedIndex: string[];
  lastIndex: string[];
  noise: string[];
  fuelClass: string[];
  wetGrip: string[];
}

interface FilterSidebarProps {
  availableProducts?: FilterGroups;
  selectedFilters: SelectedFilters;
  onFilterChange?: (filters: SelectedFilters) => void; // optional external
  min: number;
  max: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  availableProducts = {} as FilterGroups,
  selectedFilters,
  min,
  max,
}) => {
console.log('availableProducts.kategorie:', availableProducts);

  const [brandSearch, setBrandSearch] = useState('');
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.products.filters);

  // treat price as "selected" if active range differs from full range
  const hasPriceActive =
    (typeof filters.minPrice === 'number' ? filters.minPrice : min) > min ||
    (typeof filters.maxPrice === 'number' ? filters.maxPrice : max) < max;

  const [openSections, setOpenSections] = useState({
    kategorie: true,
    brand: true,
    price: true,
    width: false,
    height: false,
    diameter: false,
    noise: false,
    fuelClass: false,
    wetGrip: false,
    speedIndex: false,
    lastIndex: false,
  });

  // debounced backend commit for price changes
  const debouncedCommitPrice = useRef(
    debounce((lo: number, hi: number) => {
      // merge only changed fields
      dispatch(setFilters({ minPrice: lo, maxPrice: hi }));
      // force price ascending
      dispatch(setSort({ field: 'price', order: 'asc' }));
      // start from first page
      dispatch(setPage(1));
      // // silent refresh (no overlay)
      // dispatch(fetchProducts({ silent: true }));
    }, 180)
  ).current;

  const handleFilterChange = (key: keyof SelectedFilters, value: string) => {
    const currentValues = (filters as SelectedFilters)[key] || [];
    const updated = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    dispatch(setFilters({ [key]: updated } as Partial<SelectedFilters>));
    // regular filters: reset page & fetch normally (non-silent shows overlay)
    dispatch(setPage(1));
  };

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    // update quickly in store for URL/sync, but main fetch is debounced
    dispatch(setFilters({ minPrice, maxPrice }));
    debouncedCommitPrice(minPrice, maxPrice);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  // section selected?
  const sectionHasSelection = (section: keyof typeof openSections): boolean => {
    if (section === 'price') return hasPriceActive;
    const key = section as keyof SelectedFilters;
    const arr = selectedFilters[key] as unknown as string[] | undefined;
    return Array.isArray(arr) && arr.length > 0;
  };

  // keep selected sections expanded
  useEffect(() => {
    setOpenSections(prev => ({
      ...prev,
      kategorie: prev.kategorie || sectionHasSelection('kategorie'),
      brand: prev.brand || sectionHasSelection('brand'),
      price: prev.price || sectionHasSelection('price'),
      width: prev.width || sectionHasSelection('width'),
      height: prev.height || sectionHasSelection('height'),
      diameter: prev.diameter || sectionHasSelection('diameter'),
      speedIndex: prev.speedIndex || sectionHasSelection('speedIndex'),
      lastIndex: prev.lastIndex || sectionHasSelection('lastIndex'),
      noise: prev.noise || sectionHasSelection('noise'),
      fuelClass: prev.fuelClass || sectionHasSelection('fuelClass'),
      wetGrip: prev.wetGrip || sectionHasSelection('wetGrip'),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, hasPriceActive]);

  // click outside → close only un-selected sections
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const el = sidebarRef.current;
      if (el && !el.contains(event.target as Node)) {
        setOpenSections(prev => {
          const next = { ...prev };
          (Object.keys(prev) as (keyof typeof prev)[]).forEach(key => {
            next[key] = sectionHasSelection(key) ? true : false;
          });
          return next;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFilters, hasPriceActive]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const gradeFuelColor = (grade: string) => {
    switch ((grade || '').toUpperCase()) {
      case 'A':
        return '#2d8934';
      case 'B':
        return '#a4c600';
      case 'C':
        return '#FFC300';
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
      case 'E':
      case 'F':
      case 'G':
        return '#b7e4f9';
      default:
        return '#404042';
    }
  };

  return (
    <div className="filter-sidebar" ref={sidebarRef}>
      {/* kategorie */}
      {availableProducts.kategories && (
        <div className="relative mb-2  border-b border-b-[#C6C7CC]">
          <div
            className="filter-item-title-box flex items-center justify-between pr-6"
            onClick={() => toggleSection('kategorie')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title !text-[#16171A]   w-full text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
              Reifentyp{' '}
              <span className="text-[#404042] absolute right-2 text-[14px]">
                {selectedFilters.kategorie.length > 0
                  ? `(${selectedFilters.kategorie.length})`
                  : ''}
              </span>
            </h4>
            <span
              className={`arrow absolute right-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7]  ${
                openSections.kategorie ? 'open' : 'closed'
              }`}
            >
              <ArrowDownIcon />
            </span>
          </div>
          {openSections.kategorie && (
            <ul className="px-3 pt-0 pb-2 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2 ">
              {availableProducts.kategories.map((item, index) => {
                const label =
                  typeof item.name === 'string' || typeof item.name === 'number'
                    ? item.name
                    : JSON.stringify(item.name);

                return (
                  <li key={`${label}-${index}`}>
                    <label className="flex items-center gap-[10px] !capitalize text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#404042] !py-0">
                      <Checkbox
                        checked={selectedFilters.kategorie.includes(
                          String(label)
                        )}
                        onChange={() =>
                          handleFilterChange('kategorie', String(label))
                        }
                      />
                      {label || 'Unbekannt'}
                      <span className="ml-1 text-[#404042]">
                        ({item.count ?? 0})
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Speed Index */}
      {availableProducts.speedIndexes && (
        <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
          <div
            className="filter-item-title-box overflow-hidden flex items-center w-full justify-between pr-6"
            onClick={() => toggleSection('speedIndex')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title !text-[#16171A]   w-full text-[16px] text-left font-secondary font-normal leading-[100%] relative flex items-center  gap-1 justify-start pl-3 pr-5 py-3">
              Geschwindigkeitsindex{' '}
              <span className="text-[#404042] absolute right-2 text-[14px]">
                {selectedFilters.speedIndex.length > 0
                  ? `(${selectedFilters.speedIndex.length})`
                  : ''}
              </span>
            </h4>
            <span
              className={`arrow absolute right-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7] ${
                openSections.speedIndex ? 'open' : 'closed'
              }`}
            >
              <ArrowDownIcon />
            </span>
          </div>
          {openSections.speedIndex && (
            <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
              {[...availableProducts.speedIndexes]
                .filter(item => {
                  const name =
                    typeof item.name === 'string' ? item.name.trim() : '';
                  return name && name !== 'unbekannt' && name !== '0';
                })
                .sort((a, b) => String(a.name).localeCompare(String(b.name)))
                .map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);
                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#404042] !py-0">
                        <Checkbox
                          checked={selectedFilters.speedIndex.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('speedIndex', String(label))
                          }
                        />
                        {label || 'Unbekannt'}
                        <span className="ml-1 text-gray-400">
                          ({item.count ?? 0})
                        </span>
                      </label>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      )}

      {/* Last Index */}
      {availableProducts.lastIndexes && (
        <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
          <div
            className="filter-item-title-box flex items-center  justify-between  pr-6"
            onClick={() => toggleSection('lastIndex')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title !text-[#16171A]   w-full text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
              Lastindex{' '}
              <span className="text-[#404042] absolute right-2 text-[14px]">
                {selectedFilters.lastIndex.length > 0
                  ? `(${selectedFilters.lastIndex.length})`
                  : ''}
              </span>
            </h4>
            <span
              className={`arrow absolute right-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7] ${
                openSections.lastIndex ? 'open' : 'closed'
              }`}
            >
              <ArrowDownIcon />
            </span>
          </div>
          {openSections.lastIndex && (
            <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
              {[...availableProducts.lastIndexes]
                .filter(item => {
                  const name =
                    typeof item.name === 'string' ? item.name.trim() : '';
                  return name && name !== 'unbekannt' && name !== '0';
                })
                .sort((a, b) => Number(a.name) - Number(b.name))
                .map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);
                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#404042] !py-0">
                        <Checkbox
                          checked={selectedFilters.lastIndex.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('lastIndex', String(label))
                          }
                        />
                        {label || 'Unbekannt'}
                        <span className="ml-1 text-gray-400">
                          ({item.count ?? 0})
                        </span>
                      </label>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      )}

      {/* Price */}
      <PriceRangeSlider
        min={min}
        max={max}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={handlePriceChange}
      />

      {/* Brand */}
      {availableProducts.brands && (
        <div className="relative mb-2 pb-1  border-b border-b-[#C6C7CC]">
          <div
            className="filter-item-title-box flex items-center justify-between pr-6"
            onClick={() => toggleSection('brand')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title !text-[#16171A]   w-full text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
              Marke{' '}
              <span className="text-[#404042] absolute right-2 text-[14px]">
                {selectedFilters.brand.length > 0
                  ? `(${selectedFilters.brand.length})`
                  : ''}
              </span>
            </h4>
            <span
              className={`arrow absolute right-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7]  ${
                openSections.brand ? 'open' : 'closed'
              }`}
            >
              <ArrowDownIcon />
            </span>
          </div>
          {openSections.brand && (
            <div className="px-2 pt-1 pb-1 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[190px] max-md:max-h-[180px]">
              <div className="px-2">
                <div className="search-brand-box relative">
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={e => setBrandSearch(e.target.value)}
                    placeholder="Marke suchen …"
                    className="pr-3 pl-9 py-2 w-full focus:!rounded-full focus-within:rounded-full focus:!outline-0 focus-visible:rounded-full !shadow-none !outline-0 text-[14px] text-left font-secondary font-normal leading-[120%] border border-[#F0F0F2] rounded-full text-[#404042]"
                  />
                  <Image
                    className="absolute top-2 left-3"
                    src="/images/icons/search-norma2.svg"
                    width={16}
                    height={16}
                    alt="Search"
                  />
                </div>
              </div>

              <ul className="overflow-y-auto flex-1 gap-2 flex flex-col px-3 pt-0 pb-2">
                {[...availableProducts.brands]
                  .filter(item => {
                    const name =
                      typeof item.name === 'string' ? item.name.trim() : '';
                    return name && name !== 'unbekannt' && name !== '0';
                  })
                  .filter(item =>
                    String(item.name)
                      .toLowerCase()
                      .includes(brandSearch.toLowerCase())
                  )
                  .sort((a, b) => String(a.name).localeCompare(String(b.name)))
                  .map((item, index) => {
                    const label =
                      typeof item.name === 'string' ||
                      typeof item.name === 'number'
                        ? item.name
                        : JSON.stringify(item.name);
                    return (
                      <li key={`${label}-${index}`}>
                        <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#404042] !py-0">
                          <Checkbox
                            checked={selectedFilters.brand.includes(
                              String(label)
                            )}
                            onChange={() =>
                              handleFilterChange('brand', String(label))
                            }
                          />
                          {label || 'Unbekannt'}
                          <span className="ml-1 text-gray-400">
                            ({item.count ?? 0})
                          </span>
                        </label>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex-group-box">
        {/* Width */}
        {availableProducts.widths && (
          <div className="relative mb-2 pb-1  border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between pr-6"
              onClick={() => toggleSection('width')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title !text-[#16171A]   w-full text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Breite{' '}
                <span className="text-[#404042] absolute right-2 text-[14px]">
                  {selectedFilters.width.length > 0
                    ? `(${selectedFilters.width.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow absolute right-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7]  ${
                  openSections.width ? 'open' : 'closed'
                }`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.width && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {[...availableProducts.widths]
                  .filter(item => {
                    const name =
                      typeof item.name === 'string' ? item.name.trim() : '';
                    return name && name !== 'unbekannt' && name !== '0';
                  })
                  .sort((a, b) => Number(a.name) - Number(b.name))
                  .map((item, index) => {
                    const label =
                      typeof item.name === 'string' ||
                      typeof item.name === 'number'
                        ? item.name
                        : JSON.stringify(item.name);
                    return (
                      <li key={`${label}-${index}`}>
                        <label className="flex items-center gap-2 !capitalize text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#404042] !py-0">
                          <Checkbox
                            checked={selectedFilters.width.includes(
                              String(label)
                            )}
                            onChange={() =>
                              handleFilterChange('width', String(label))
                            }
                          />
                          {label || 'Unbekannt'}
                          <span className="ml-1 text-gray-400">
                            ({item.count ?? 0})
                          </span>
                        </label>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        )}

        {/* Height */}
        {availableProducts.heights && (
          <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between pr-6"
              onClick={() => toggleSection('height')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title !text-[#16171A]   w-full text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Höhe{' '}
                <span className="text-[#404042] absolute right-2 text-[14px]">
                  {selectedFilters.height.length > 0
                    ? `(${selectedFilters.height.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow absolute right-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7]  ${
                  openSections.height ? 'open' : 'closed'
                }`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.height && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {[...availableProducts.heights]
                  .filter(item => {
                    const name =
                      typeof item.name === 'string' ? item.name.trim() : '';
                    return name && name !== 'unbekannt' && name !== '0';
                  })
                  .sort((a, b) => Number(a.name) - Number(b.name))
                  .map((item, index) => {
                    const label =
                      typeof item.name === 'string' ||
                      typeof item.name === 'number'
                        ? item.name
                        : JSON.stringify(item.name);
                    return (
                      <li key={`${label}-${index}`}>
                        <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#404042] !py-0">
                          <Checkbox
                            checked={selectedFilters.height.includes(
                              String(label)
                            )}
                            onChange={() =>
                              handleFilterChange('height', String(label))
                            }
                          />
                          {label || 'Unbekannt'}
                          <span className="ml-1 text-gray-400">
                            ({item.count ?? 0})
                          </span>
                        </label>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        )}

        {/* Diameter */}
        {availableProducts.diameters && (
          <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between pr-6"
              onClick={() => toggleSection('diameter')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title !text-[#16171A]   w-full text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Durchmesser{' '}
                <span className="text-[#404042] absolute right-2 text-[14px]">
                  {selectedFilters.diameter.length > 0
                    ? `(${selectedFilters.diameter.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow absolute right-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7] ${
                  openSections.diameter ? 'open' : 'closed'
                }`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.diameter && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {[...availableProducts.diameters]
                  .filter(item => {
                    const name =
                      typeof item.name === 'string' ? item.name.trim() : '';
                    return name && name !== 'unbekannt' && name !== '0';
                  })
                  .sort((a, b) => Number(a.name) - Number(b.name))
                  .map((item, index) => {
                    const label =
                      typeof item.name === 'string' ||
                      typeof item.name === 'number'
                        ? item.name
                        : JSON.stringify(item.name);
                    return (
                      <li key={`${label}-${index}`}>
                        <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#404042] !py-0">
                          <Checkbox
                            checked={selectedFilters.diameter.includes(
                              String(label)
                            )}
                            onChange={() =>
                              handleFilterChange('diameter', String(label))
                            }
                          />
                          {label || 'Unbekannt'}
                          <span className="ml-1 text-gray-400">
                            ({item.count ?? 0})
                          </span>
                        </label>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Fuel Class */}
      {availableProducts.fuelClasses && (
        <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
          <div
            className="filter-item-title-box flex items-center  justify-between pr-6"
            onClick={() => toggleSection('fuelClass')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title !text-[#16171A]   w-full text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
              Kraftstoffeffizienz{' '}
              <span className="text-[#404042] absolute right-2 text-[14px]">
                {selectedFilters.fuelClass.length > 0
                  ? `(${selectedFilters.fuelClass.length})`
                  : ''}
              </span>
            </h4>
            <span
              className={`arrow absolute right-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7]  ${
                openSections.fuelClass ? 'open' : 'closed'
              }`}
            >
              <ArrowDownIcon />
            </span>
          </div>
          {openSections.fuelClass && (
            <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
              {[...availableProducts.fuelClasses]
                .filter(item => {
                  const name =
                    typeof item.name === 'string' ? item.name.trim() : '';
                  return name && name !== 'unbekannt' && name !== '0';
                })
                .sort((a, b) => String(a.name).localeCompare(String(b.name)))
                .map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);
                  return (
                    <li key={`${label}-${index}`}>
                      <label
                        style={{
                          color: gradeFuelColor(String(label)),
                          fontWeight: 500,
                        }}
                        className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#404042] !py-0"
                      >
                        <Checkbox
                          checked={selectedFilters.fuelClass.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('fuelClass', String(label))
                          }
                        />
                        {label || 'Unbekannt'}
                        <span className="ml-1 text-gray-400">
                          ({item.count ?? 0})
                        </span>
                      </label>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      )}

      {/* Wet Grip */}
      {availableProducts.wetGrips && (
        <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
          <div
            className="filter-item-title-box flex items-center  justify-between pr-6"
            onClick={() => toggleSection('wetGrip')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title !text-[#16171A]   w-full text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
              Nasshaftung{' '}
              <span className="text-[#404042] absolute right-2 text-[14px]">
                {selectedFilters.wetGrip.length > 0
                  ? `(${selectedFilters.wetGrip.length})`
                  : ''}
              </span>
            </h4>
            <span
              className={`arrow absolute right-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7]  ${
                openSections.wetGrip ? 'open' : 'closed'
              }`}
            >
              <ArrowDownIcon />
            </span>
          </div>
          {openSections.wetGrip && (
            <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
              {[...availableProducts.wetGrips]
                .filter(item => {
                  const name =
                    typeof item.name === 'string'
                      ? item.name.trim().toLowerCase()
                      : '';
                  return name !== '';
                })
                .sort((a, b) => String(a.name).localeCompare(String(b.name)))
                .map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);
                  return (
                    <li key={`${label}-${index}`}>
                      <label
                        style={{
                          color: gradeGripColor(String(label)),
                          fontWeight: 500,
                        }}
                        className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#404042] !py-0"
                      >
                        <Checkbox
                          checked={selectedFilters.wetGrip.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('wetGrip', String(label))
                          }
                        />
                        {label || 'Unbekannt'}
                        <span className="ml-1 text-gray-400">
                          ({item.count ?? 0})
                        </span>
                      </label>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      )}

      {/* Noise */}
      {availableProducts.noises && (
        <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
          <div
            className="filter-item-title-box flex items-center  justify-between pr-6"
            onClick={() => toggleSection('noise')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title !text-[#16171A]   w-full text-[15px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
              Externes Rollgeräusch in dB{' '}
              <span className="text-[#404042] absolute right-2 text-[14px]">
                {selectedFilters.noise.length > 0
                  ? `(${selectedFilters.noise.length})`
                  : ''}
              </span>
            </h4>
            <span
              className={`arrow absolute right-0 top-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7]  ${
                openSections.noise ? 'open' : 'closed'
              }`}
            >
              <ArrowDownIcon />
            </span>
          </div>
          {openSections.noise && (
            <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
              {[...availableProducts.noises]
                .filter(item => {
                  const name =
                    typeof item.name === 'string' ? item.name.trim() : '';
                  return name && name !== 'unbekannt' && name !== '0';
                })
                .sort((a, b) => Number(a.name) - Number(b.name))
                .map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);
                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#404042] !py-0">
                        <Checkbox
                          checked={selectedFilters.noise.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('noise', String(label))
                          }
                        />
                        {label || 'Unbekannt'}
                        <span className="ml-1 text-gray-400">
                          ({item.count ?? 0})
                        </span>
                      </label>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
