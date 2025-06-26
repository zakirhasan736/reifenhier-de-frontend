'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '@/store/productSlice';
import { ArrowDownIcon } from '@/icons';
import Checkbox from '../input-fields/checkbox';
import PriceRangeSlider from '@/components/elements/search/PriceFilter';
import { RootState } from '@/store/store';
interface FilterItem {
  name: string;
  count: number;
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

  // const {
  //   categories = [],
  //   brands = [],
  //   widths = [],
  //   heights = [],
  //   diameters = [],
  //   speedIndexes = [],
  //   lastIndexes = [],
  //   noises = [],
  //   fuelClasses = [],
  //   wetGrips = [],
  // } = availableProducts;

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
        <div className="relative mb-2">
          <div
            className="filter-item-title-box flex items-center justify-between border-1 pr-2"
            onClick={() => toggleSection('category')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
              Category{' '}
              <span className="text-primary-color-100 absolute right-2">
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
            <ul className="px-2 py-3 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2 ">
              {availableProducts.categories.map((item, index) => {
                const label =
                  typeof item.name === 'string' || typeof item.name === 'number'
                    ? item.name
                    : JSON.stringify(item.name);

                return (
                  <li key={`${label}-${index}`}>
                    <label className="flex items-center gap-2 capitalize caption">
                      <Checkbox
                        checked={selectedFilters.category.includes(
                          String(label)
                        )}
                        onChange={() =>
                          handleFilterChange('category', String(label))
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
      {/* Brand filter */}
      {availableProducts.brands && (
        <div className="relative mb-2">
          <div
            className="filter-item-title-box flex items-center justify-between border-1 pr-2"
            onClick={() => toggleSection('brand')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
              Brand{' '}
              <span className="text-primary-color-100 absolute right-2">
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
            <ul className="px-2 py-3 filter-dropdown-area max-sm:pl-1 flex flex-col gap-2 absolute z-120 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-[300px] max-md:max-h-[180px] overflow-y-auto">
              {availableProducts.brands.map((item, index) => {
                const label =
                  typeof item.name === 'string' || typeof item.name === 'number'
                    ? item.name
                    : JSON.stringify(item.name);

                return (
                  <li key={`${label}-${index}`}>
                    <label className="flex items-center gap-2 capitalize caption">
                      <Checkbox
                        checked={selectedFilters.brand.includes(String(label))}
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
          )}
        </div>
      )}
      {/* Price filter */}
      {openSections.price && min !== max && (
        <PriceRangeSlider
          min={min}
          max={max}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={handlePriceChange}
        />
      )}
      <div className="flex-group-box">
        {/* Tyres Index Filter */}
        <div
          className="filter-item-title-box flex items-center  justify-between"
          style={{ cursor: 'pointer' }}
        >
          <h4 className="filter-sidebar-title pr-8 relative text-[14px] font-bold flex items-center  gap-1 justify-start pl-2 py-[13px]">
            Tyres Index{' '}
          </h4>
        </div>
        {availableProducts.widths && (
          <div className="relative mb-2">
            <div
              className="filter-item-title-box flex items-center  justify-between  border-1 pr-2"
              onClick={() => toggleSection('width')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
                Width{' '}
                <span className="text-primary-color-100 absolute right-2">
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
              <ul className="px-2 py-3 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2  absolute z-110 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-[300px] max-md:max-h-[180px] overflow-y-auto">
                {availableProducts.widths.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 capitalize caption">
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
          <div className="relative mb-2">
            <div
              className="filter-item-title-box flex items-center  justify-between  border-1 pr-2"
              onClick={() => toggleSection('height')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
                Height{' '}
                <span className="text-primary-color-100 absolute right-2">
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
              <ul className="px-2 py-3 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2  absolute z-100 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-[300px] max-md:max-h-[180px] overflow-y-auto">
                {availableProducts.heights.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 capitalize caption">
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
          <div className="relative mb-2">
            <div
              className="filter-item-title-box flex items-center  justify-between  border-1 pr-2"
              onClick={() => toggleSection('diameter')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
                Diameter{' '}
                <span className="text-primary-color-100 absolute right-2">
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
              <ul className="px-2 py-3 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2  absolute z-95 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-[300px] max-md:max-h-[180px] overflow-y-auto">
                {availableProducts.diameters.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 capitalize caption">
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
          <div className="relative mb-2">
            <div
              className="filter-item-title-box flex items-center  justify-between border-1 pr-2"
              onClick={() => toggleSection('speedIndex')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
                Speed Index{' '}
                <span className="text-primary-color-100 absolute right-2">
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
              <ul className="px-2 py-3 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2  absolute z-90 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-[300px] max-md:max-h-[180px] overflow-y-auto">
                {availableProducts.speedIndexes.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 capitalize caption">
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
          <div className="relative mb-2">
            <div
              className="filter-item-title-box flex items-center  justify-between border-1 pr-2"
              onClick={() => toggleSection('lastIndex')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
                Lasts Index{' '}
                <span className="text-primary-color-100 absolute right-2">
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
              <ul className="px-2 py-3 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2  absolute z-80 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-[300px] max-md:max-h-[180px] overflow-y-auto">
                {availableProducts.lastIndexes.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 capitalize caption">
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
        {/* Tyres Index Filter */}
        <div
          className="filter-item-title-box flex items-center  justify-between"
          style={{ cursor: 'pointer' }}
        >
          <h4 className="filter-sidebar-title pr-8 relative text-[14px] font-bold flex items-center  gap-1 justify-start pl-2 py-[13px]">
            Tyres additional Info{' '}
          </h4>
        </div>

        {/* Product Fuel class Filter */}
        {availableProducts.fuelClasses && (
          <div className="relative mb-2">
            <div
              className="filter-item-title-box flex items-center  justify-between border-1 pr-2"
              onClick={() => toggleSection('fuelClass')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
                Product Fuel class{' '}
                <span className="text-primary-color-100 absolute right-2">
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
              <ul className="px-2 py-3 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2  absolute z-70 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-[300px] max-md:max-h-[180px] overflow-y-auto">
                {availableProducts.fuelClasses.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 capitalize caption">
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
          <div className="relative mb-2">
            <div
              className="filter-item-title-box flex items-center  justify-between border-1 pr-2"
              onClick={() => toggleSection('wetGrip')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
                Produkt Wet grip class{' '}
                <span className="text-primary-color-100 absolute right-2">
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
              <ul className="px-2 py-3 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2  absolute z-60 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-[300px] max-md:max-h-[180px] overflow-y-auto">
                {availableProducts.wetGrips.map((item, index) => {
                  const label =
                    typeof item.name === 'string' ||
                    typeof item.name === 'number'
                      ? item.name
                      : JSON.stringify(item.name);

                  return (
                    <li key={`${label}-${index}`}>
                      <label className="flex items-center gap-2 capitalize caption">
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
          <div className="relative mb-2">
            <div
              className="filter-item-title-box flex items-center  justify-between border-1 pr-2"
              onClick={() => toggleSection('noise')}
              style={{ cursor: 'pointer' }}
            >
              <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
                Produkt Noise class{' '}
                <span className="text-primary-color-100 absolute right-2">
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
              <ul className="px-2 py-3 filter-dropdown-area flex  max-sm:pl-1 flex-col gap-2  absolute z-50 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-[200px] overflow-y-auto">
                {availableProducts.noises.map((item, index) => {
                const label = typeof item.name === 'string' || typeof item.name === 'number'
                  ? item.name
                  : JSON.stringify(item.name);

                return (
                  <li key={`${label}-${index}`}>
                    <label className="flex items-center gap-2 capitalize caption">
                      <Checkbox
                        checked={selectedFilters.noise.includes(String(label))}
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
