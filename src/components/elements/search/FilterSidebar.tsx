'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '@/store/productSlice';
import { ArrowDownIcon } from '@/icons';
import Checkbox from '../input-fields/checkbox';
import PriceRangeSlider from '@/components/elements/search/PriceFilter';
import { RootState } from '@/store/store';
import Image from 'next/image';
interface FilterItem {
  name: string | number;
  count: number  | string;
}

interface FilterGroups {
  categories?: FilterItem[];
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
  category: string[];
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
  onFilterChange?: (filters: SelectedFilters) => void; // if used
  min: number;
  max: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  availableProducts = {} as FilterGroups,
  selectedFilters,
  // onFilterChange,
  min,
  max,
}) => {
  const [brandSearch, setBrandSearch] = useState('');

  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.products.filters);
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: false,
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
  // You can adjust these colors as you want!
  const gradeFuelColor = (grade: string) => {
    switch ((grade || '').toUpperCase()) {
      case 'A':
        return '#2d8934'; // Green
      case 'B':
        return '#a4c600'; // Light Green
      case 'C':
        return '#f9ed02'; // Yellow
      case 'D':
        return '#f5b602'; // Orange Yellow
      case 'E':
        return '#e81401'; // Orange
      case 'F':
        return '#e81401'; // Red
      case 'G':
        return '#e81401'; // Dark Red
      default:
        return '#404042'; // Gray (for unknown)
    }
  };
  const gradeGripColor = (grade: string) => {
    switch ((grade || '').toUpperCase()) {
      case 'A':
        return '#2c5aa9'; // Green
      case 'B':
        return '#377ac1'; // Light Green
      case 'C':
        return '#5ba7db'; // Yellow
      case 'D':
        return '#87c2ea'; // Orange Yellow
      case 'E':
        return '#b7e4f9'; // Orange
      case 'F':
        return '#b7e4f9'; // Red
      case 'G':
        return '#b7e4f9'; // Dark Red
      default:
        return '#404042'; // Gray (for unknown)
    }
  };

  const handleFilterChange = (key: keyof SelectedFilters, value: string) => {
    const currentValues = filters[key] || [];
    const updated = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    dispatch(setFilters({ ...filters, [key]: updated }));
  };

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    dispatch(setFilters({ ...filters, minPrice, maxPrice }));
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const sidebarEl = sidebarRef.current;
      if (sidebarEl && !sidebarEl.contains(event.target as Node)) {
        const allClosed = Object.keys(openSections).reduce((acc, key) => {
          acc[key as keyof typeof openSections] = false;
          return acc;
        }, {} as typeof openSections);
        setOpenSections(allClosed);
      }
    },
    [openSections]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);
  return (
    <div className="filter-sidebar" ref={sidebarRef}>
      {/* Category filter */}
      {availableProducts.categories && (
        <div className="relative mb-2  border-b border-b-[#C6C7CC]">
          <div
            className="filter-item-title-box flex items-center justify-between pr-2"
            onClick={() => toggleSection('category')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
              Kategorie{' '}
              <span className="text-[#404042] absolute right-2">
                {selectedFilters.category.length > 0
                  ? `(${selectedFilters.category.length})`
                  : ''}
              </span>
            </h4>
            <span
              className={`arrow ${openSections.category ? 'open' : 'closed'}`}
            >
              <ArrowDownIcon />
            </span>
          </div>
          {openSections.category && (
            <ul className="px-3 pt-0 pb-2 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2 ">
              {availableProducts.categories.map((item, index) => {
                const label =
                  typeof item.name === 'string' || typeof item.name === 'number'
                    ? item.name
                    : JSON.stringify(item.name);

                return (
                  <li key={`${label}-${index}`}>
                    <label className="flex items-center gap-[10px] !capitalize text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#86878A] !py-0">
                      <Checkbox
                        checked={selectedFilters.category.includes(
                          String(label)
                        )}
                        onChange={() =>
                          handleFilterChange('category', String(label))
                        }
                      />
                      {label || 'Unknown'}
                      <span className="ml-1 text-[#86878A]">
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
      {/* Price filter */}
      {/* {openSections.price && min !== max && ( */}
      <PriceRangeSlider
        min={min}
        max={max}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={handlePriceChange}
      />
      {/* // )} */}
      {/* Brand filter */}
      {availableProducts.brands && (
        <div className="relative mb-2 pb-1  border-b border-b-[#C6C7CC]">
          <div
            className="filter-item-title-box flex items-center justify-between pr-2"
            onClick={() => toggleSection('brand')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
              Marke{' '}
              <span className="text-[#404042] absolute right-2">
                {selectedFilters.brand.length > 0
                  ? `(${selectedFilters.brand.length})`
                  : ''}
              </span>
            </h4>
            <span className={`arrow ${openSections.brand ? 'open' : 'closed'}`}>
              <ArrowDownIcon />
            </span>
          </div>
          {openSections.brand && (
            <div className="px-2 pt-1 pb-1 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[190px] max-md:max-h-[180px]">
              {/* Search Input */}
              <div className="search-brand-box relative">
                <input
                  type="text"
                  value={brandSearch}
                  onChange={e => setBrandSearch(e.target.value)}
                  placeholder="Marken suchen..."
                  className="pr-3 pl-9 py-2 focus:!rounded-full focus-within:rounded-full focus:!outline-0 focus-visible:rounded-full !shadow-none !outline-0 text-[14px] text-left font-secondary font-normal leading-[120%] border border-[#F0F0F2] rounded-full text-[#86878A]"
                />
                <Image
                  className="absolute top-2 left-3"
                  src="/images/icons/search-norma2.svg"
                  width={16}
                  height={16}
                  alt="Search"
                />
              </div>

              {/* Filtered & Sorted Brand List */}
              <ul className="overflow-y-auto flex-1 gap-2 flex flex-col px-3 pt-0 pb-2">
                {[...availableProducts.brands]
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
                        <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#86878A] !py-0">
                          <Checkbox
                            checked={selectedFilters.brand.includes(
                              String(label)
                            )}
                            onChange={() =>
                              handleFilterChange('brand', String(label))
                            }
                          />
                          {label || 'Unknown'}
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
        {/* Tyres Index Filter */}

        {availableProducts.widths && (
          <div className="relative mb-2 pb-1  border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between pr-2"
              onClick={() => toggleSection('width')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Breite{' '}
                <span className="text-[#404042] absolute right-2">
                  {selectedFilters.width.length > 0
                    ? `(${selectedFilters.width.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow ${openSections.width ? 'open' : 'closed'}`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.width && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {availableProducts.widths.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#86878A] !py-0">
                        <Checkbox
                          checked={selectedFilters.width.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('width', String(label))
                          }
                        />
                        {label || 'Unknown'}
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
        {availableProducts.heights && (
          <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between pr-2"
              onClick={() => toggleSection('height')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Höhe{' '}
                <span className="text-[#404042] absolute right-2">
                  {selectedFilters.height.length > 0
                    ? `(${selectedFilters.height.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow ${openSections.height ? 'open' : 'closed'}`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.height && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {availableProducts.heights.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#86878A] !py-0">
                        <Checkbox
                          checked={selectedFilters.height.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('height', String(label))
                          }
                        />
                        {label || 'Unknown'}
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
        {availableProducts.diameters && (
          <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between pr-2"
              onClick={() => toggleSection('diameter')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Durchmesser{' '}
                <span className="text-[#404042] absolute right-2">
                  {selectedFilters.diameter.length > 0
                    ? `(${selectedFilters.diameter.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow ${openSections.diameter ? 'open' : 'closed'}`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.diameter && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {availableProducts.diameters.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#86878A] !py-0">
                        <Checkbox
                          checked={selectedFilters.diameter.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('diameter', String(label))
                          }
                        />
                        {label || 'Unknown'}
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
        {availableProducts.speedIndexes && (
          <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between pr-2"
              onClick={() => toggleSection('speedIndex')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Geschwindigkeitsindex{' '}
                <span className="text-[#404042] absolute right-2">
                  {selectedFilters.speedIndex.length > 0
                    ? `(${selectedFilters.speedIndex.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow ${
                  openSections.speedIndex ? 'open' : 'closed'
                }`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.speedIndex && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {availableProducts.speedIndexes.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#86878A] !py-0">
                        <Checkbox
                          checked={selectedFilters.speedIndex.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('speedIndex', String(label))
                          }
                        />
                        {label || 'Unknown'}
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
        {availableProducts.lastIndexes && (
          <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between  pr-2"
              onClick={() => toggleSection('lastIndex')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Letztenindex{' '}
                <span className="text-[#404042] absolute right-2">
                  {selectedFilters.lastIndex.length > 0
                    ? `(${selectedFilters.lastIndex.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow ${
                  openSections.lastIndex ? 'open' : 'closed'
                }`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.lastIndex && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {availableProducts.lastIndexes.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#86878A] !py-0">
                        <Checkbox
                          checked={selectedFilters.lastIndex.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('lastIndex', String(label))
                          }
                        />
                        {label || 'Unknown'}
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
      <div className="tyres-additional-info">
        {/* Product Fuel class Filter */}
        {availableProducts.fuelClasses && (
          <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between pr-2"
              onClick={() => toggleSection('fuelClass')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Kraftstoffklasse{' '}
                <span className="text-[#404042] absolute right-2">
                  {selectedFilters.fuelClass.length > 0
                    ? `(${selectedFilters.fuelClass.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow ${
                  openSections.fuelClass ? 'open' : 'closed'
                }`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.fuelClass && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {availableProducts.fuelClasses.map((item, index) => {
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
                        className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#86878A] !py-0"
                      >
                        <Checkbox
                          checked={selectedFilters.fuelClass.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('fuelClass', String(label))
                          }
                        />
                        {label || 'Unknown'}
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
        {/* Produkt Wet grip class Filter */}
        {availableProducts.wetGrips && (
          <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between pr-2"
              onClick={() => toggleSection('wetGrip')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Nasshaftungsklasse{' '}
                <span className="text-[#404042] absolute right-2">
                  {selectedFilters.wetGrip.length > 0
                    ? `(${selectedFilters.wetGrip.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow ${openSections.wetGrip ? 'open' : 'closed'}`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.wetGrip && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {availableProducts.wetGrips.map((item, index) => {
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
                        className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#86878A] !py-0"
                      >
                        <Checkbox
                          checked={selectedFilters.wetGrip.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('wetGrip', String(label))
                          }
                        />
                        {label || 'Unknown'}
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
        {/* Noise Filter */}
        {availableProducts.noises && (
          <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center  justify-between pr-2"
              onClick={() => toggleSection('noise')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3 py-3">
                Geräuschklasse{' '}
                <span className="text-[#404042] absolute right-2">
                  {selectedFilters.noise.length > 0
                    ? `(${selectedFilters.noise.length})`
                    : ''}
                </span>
              </h4>
              <span
                className={`arrow ${openSections.noise ? 'open' : 'closed'}`}
              >
                <ArrowDownIcon />
              </span>
            </div>
            {openSections.noise && (
              <ul className="px-2 pt-1 overflow-y-auto pb-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 w-full max-h-[137px] max-md:max-h-[150px]">
                {availableProducts.noises.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 !capitalize  text-[14px] text-left font-secondary cursor-pointer font-normal leading-[100%] text-[#86878A] !py-0">
                        <Checkbox
                          checked={selectedFilters.noise.includes(
                            String(label)
                          )}
                          onChange={() =>
                            handleFilterChange('noise', String(label))
                          }
                        />
                        {label || 'Unknown'}
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
    </div>
  );
};

export default FilterSidebar;
