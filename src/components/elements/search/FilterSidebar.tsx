'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import PriceRangeSlider from '@/components/elements/search/PriceFilter';
import { Car, Check, CloudRain, Info, Ruler, Search, Snowflake, Sun } from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';

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

    const [activeTab, setActiveTab] = useState<'size' | 'car'>('size');
    const [carMake, setCarMake] = useState('');
    const [carYear, setCarYear] = useState('');
    const [showAllBrands, setShowAllBrands] = useState(false);

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
        return '#FFC300'; // Deeper yellow, better contrast on white
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
  const gradeFuelBgColor = (grade: string) => {
    switch ((grade || '').toUpperCase()) {
      case 'A':
        return '#2d893445';
      case 'B':
        return '#a4c60045';
      case 'C':
        return '#FFC30045'; // Deeper yellow, better contrast on white
      case 'D':
        return '#f5b60245';
      case 'E':
      case 'F':
      case 'G':
        return '#e8140145';
      default:
        return '#40404245';
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
      default:
        return '#b7e4f9';
    }
  };
  const gradeGripBgColor = (grade: string) => {
    switch ((grade || '').toUpperCase()) {
      case 'A':
        return '#2c5aa945';
      case 'B':
        return '#377ac145';
      case 'C':
        return '#5ba7db45';
      case 'D':
        return '#87c2ea45';
      default:
        return '#b7e4f945';
    }
  };

  return (
    <div className="filter-sidebar" ref={sidebarRef}>
      {/* Dimension Selectors Box */}
      <div className="bg-blue-50/40 pb-3 pt-2 px-2 rounded-xl border border-blue-100/90">
        <h3 className="text-lg mb-2 font-medium"> Reifen Finder</h3>
        {/* Tabs */}
        <div className="flex bg-slate-300 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('size')}
            className={`flex-1 flex items-center cursor-pointer justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'size'
          ? 'bg-blue-600 text-white shadow-md filter-active-tabs'
          : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ruler className="w-4 h-4" />
            By Size
          </button>
          <button
            disabled
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all cursor-not-allowed opacity-50 text-slate-400`}
          >
            <Car className="w-4 h-4" />
            By Car
          </button>
        </div>
        {activeTab === 'size' ? (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Width */}
              {availableProducts.widths && (
                <MultiSelectDropdown
                  label="Breite"
                  options={availableProducts.widths.map(item => ({
                    name: String(item.name),
                  }))}
                  selected={selectedFilters.width[0] ?? null}
                  onChange={v => handleFilterChange('width', v)}
                />
              )}

              {/* Height */}
              {availableProducts.heights && (
                <MultiSelectDropdown
                  label="Höhe"
                  options={availableProducts.heights.map(item => ({
                    name: String(item.name),
                  }))}
                  selected={selectedFilters.height[0] ?? null}
                  onChange={v => handleFilterChange('height', v)}
                />
              )}

              {/* Diameter */}
              {availableProducts.diameters && (
                <MultiSelectDropdown
                  label="Zoll"
                  options={availableProducts.diameters.map(item => ({
                    name: String(item.name),
                  }))}
                  selected={selectedFilters.diameter[0] ?? null}
                  onChange={v => handleFilterChange('diameter', v)}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Load Index */}
              {availableProducts.lastIndexes && (
                <MultiSelectDropdown
                  label="Lastindex"
                  options={availableProducts.lastIndexes.map(item => ({
                    name: String(item.name),
                  }))}
                  selected={selectedFilters.lastIndex[0] ?? null}
                  onChange={v => handleFilterChange('lastIndex', v)}
                />
              )}

              {/* Speed Index */}
              {availableProducts.speedIndexes && (
                <MultiSelectDropdown
                  label="Speed"
                  options={availableProducts.speedIndexes.map(item => ({
                    name: String(item.name),
                  }))}
                  selected={selectedFilters.speedIndex[0] ?? null}
                  onChange={v => handleFilterChange('speedIndex', v)}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">
                Make
                </label>
                <select
                value={carMake}
                onChange={e => setCarMake(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition duration-200 ease-in-out hover:bg-gray-700"
                >
                <option value="">Select...</option>
                <option value="audi">Audi</option>
                <option value="bmw">BMW</option>
                <option value="vw">Volkswagen</option>
                <option value="mb">Mercedes</option>
                <option value="ford">Ford</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">
                Year
                </label>
                <select
                value={carYear}
                onChange={e => setCarYear(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition duration-200 ease-in-out hover:bg-gray-700"
                >
                <option value="">Year</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
                <option>2020</option>
                <option>2019</option>
                </select>
              </div>
              </div>

              <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Model
              </label>
              <select
                disabled={!carMake}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out hover:bg-gray-700"
              >
                <option>Select Model...</option>
                {carMake === 'vw' && <option>Golf VIII</option>}
                {carMake === 'vw' && <option>Passat Variant</option>}
                {carMake === 'vw' && <option>Tiguan</option>}
                {carMake === 'bmw' && <option>3 Series (G20)</option>}
                {carMake === 'bmw' && <option>5 Series (G30)</option>}
                {carMake === 'audi' && <option>A4 Avant</option>}
                {carMake === 'audi' && <option>A6</option>}
                {!['vw', 'bmw', 'audi'].includes(carMake) && carMake && (
                <option>Standard Model</option>
                )}
              </select>
              </div>

              <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Engine / Version
              </label>
              <select
                disabled={!carMake}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out hover:bg-gray-700"
              >
                <option>Select Version...</option>
                <option>2.0 TDI (150 HP)</option>
                <option>1.5 TSI (130 HP)</option>
                <option>2.0 TSI (190 HP)</option>
                <option>Hybrid / GTE</option>
              </select>
              </div>
            </div>
            {/* Submit */}
            <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
              <Search className="w-5 h-5 text-blue-600" />
              Find Matching Tires
            </button>
          </>
        )}
      </div>

      <div className="bg-blue-50/40  pb-3 pt-1 mt-3 px-0 rounded-xl border border-blue-100/90">
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
              <div className="px-3 pt-0 pb-4 space-y-2">
                {/* Helper to check if current label is selected */}
                {(() => {
                  const isSelected = (label: string) =>
                    selectedFilters.kategorie.includes(label);

                  return (
                    <>
                      {/* SUMMER CARD */}
                      <button
                        onClick={() =>
                          handleFilterChange('kategorie', 'Sommerreifen')
                        }
                        className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all
              ${
                isSelected('Sommerreifen')
                  ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }
            `}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center
                ${
                  isSelected('Sommerreifen')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500'
                }
              `}
                        >
                          <Sun size={16} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900 text-sm">
                            Sommerreifen
                          </p>
                          <p className="text-xs text-gray-500">
                            Optimiert für {'>'} 7°C
                          </p>
                        </div>
                        {isSelected('Sommerreifen') && (
                          <Check size={14} className="text-blue-600" />
                        )}
                      </button>

                      {/* WINTER CARD */}
                      <button
                        onClick={() =>
                          handleFilterChange('kategorie', 'Winterreifen')
                        }
                        className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all
              ${
                isSelected('Winterreifen')
                  ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }
            `}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center
                ${
                  isSelected('Winterreifen')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500'
                }
              `}
                        >
                          <Snowflake size={16} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900 text-sm">
                            Winterreifen
                          </p>
                          <p className="text-xs text-gray-500">
                            Sicherheit bei Schnee
                          </p>
                        </div>
                        {isSelected('Winterreifen') && (
                          <Check size={14} className="text-blue-600" />
                        )}
                      </button>

                      {/* ALL-SEASON CARD */}
                      <button
                        onClick={() =>
                          handleFilterChange('kategorie', 'Ganzjahresreifen')
                        }
                        className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all
              ${
                isSelected('Ganzjahresreifen')
                  ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }
            `}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center
                ${
                  isSelected('Ganzjahresreifen')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500'
                }
              `}
                        >
                          <CloudRain size={16} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900 text-sm">
                            Ganzjahresreifen
                          </p>
                          <p className="text-xs text-gray-500">
                            Ein Reifen, alle Wetter
                          </p>
                        </div>
                        {isSelected('Ganzjahresreifen') && (
                          <Check size={14} className="text-blue-600" />
                        )}
                      </button>
                    </>
                  );
                })()}
              </div>
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

        {/* BRAND FILTER */}
        {availableProducts.brands && (
          <div className="relative mb-2 pb-1 border-b border-b-[#C6C7CC]">
            <div
              className="filter-item-title-box flex items-center justify-between pr-6 cursor-pointer"
              onClick={() => toggleSection('brand')}
            >
              <h4 className="filter-sidebar-title !text-[#16171A] w-full text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center gap-1 justify-start pl-3 py-3">
                Marke{' '}
                <span className="text-[#404042] absolute right-2 text-[14px]">
                  {selectedFilters.brand.length > 0
                    ? `(${selectedFilters.brand.length})`
                    : ''}
                </span>
              </h4>

              <span
                className={`arrow absolute right-0 px-2 h-10 flex flex-col justify-center items-center bg-[#F5F5F7] ${
                  openSections.brand ? 'open' : 'closed'
                }`}
              >
                <ArrowDownIcon />
              </span>
            </div>

            {openSections.brand && (
              <div className="px-3 pt-2 pb-4 space-y-3">
                {/* 🔍 Search Box */}
                <div className="relative">
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={e => setBrandSearch(e.target.value)}
                    placeholder="Marke suchen…"
                    className="w-full py-2 pl-9 pr-3 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search
                    className="absolute top-2.5 left-2.5 text-slate-400"
                    size={16}
                  />
                </div>

                {/** -------------------------------------------
         * BRAND LIST LOGIC:
         * - Search filters ALL brands
         * - No search → show first 10 only
         * - Expand button shows all brands
         ---------------------------------------------- */}

                {(() => {
                  const allBrands = [...availableProducts.brands]
                    .filter(item => {
                      const name =
                        typeof item.name === 'string' ? item.name.trim() : '';
                      return name && name !== 'unbekannt' && name !== '0';
                    })
                    .sort((a, b) =>
                      String(a.name).localeCompare(String(b.name))
                    );

                  // If searching → always show full list
                  const filteredBrands = brandSearch
                    ? allBrands.filter(item =>
                        String(item.name)
                          .toLowerCase()
                          .includes(brandSearch.toLowerCase())
                      )
                    : allBrands;

                  const visibleBrands =
                    !brandSearch && !showAllBrands
                      ? filteredBrands.slice(0, 8)
                      : filteredBrands;

                  return (
                    <>
                      {/* Brand Buttons */}
                      <div className="grid grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1">
                        {visibleBrands.map(item => {
                          const label =
                            typeof item.name === 'string' ||
                            typeof item.name === 'number'
                              ? item.name
                              : JSON.stringify(item.name);

                          const active = selectedFilters.brand.includes(
                            String(label)
                          );

                          return (
                            <button
                              key={label}
                              onClick={() =>
                                handleFilterChange('brand', String(label))
                              }
                              className={`text-xs font-semibold w-full text-left truncate px-3 py-2 rounded-lg border transition-all
                        ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                        }
                      `}
                            >
                              {label}
                              <span className="text-[10px] text-slate-400 ml-1">
                                ({item.count})
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Expand Button — only when not searching */}
                      {!brandSearch && filteredBrands.length > 10 && (
                        <button
                          onClick={() => setShowAllBrands(!showAllBrands)}
                          className="w-full text-center text-blue-600 text-xs font-bold py-1.5 hover:underline"
                        >
                          {showAllBrands
                            ? 'Weniger Marken anzeigen'
                            : `Alle ${filteredBrands.length} Marken anzeigen`}
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
      {/* EU LABEL SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100/90 pb-3 pt-1 px-2 mt-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          // onClick={() => toggleSection('label')}
        >
          <h4 className="filter-sidebar-title !text-[#16171A] w-full text-[16px] text-left font-secondary font-medium leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-1 py-3">
            EU Label
          </h4>
          {/* {expandedSections['label'] ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )} */}
        </div>

        {/* {expandedSections['label'] && ( */}
        <div className="space-y-5">
          {/* FUEL CLASS */}
          {availableProducts.fuelClasses && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Kraftstoffeffizienz
                </span>
                <Info size={12} className="text-slate-400" />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[...availableProducts.fuelClasses]
                  .sort((a, b) => String(a.name).localeCompare(String(b.name)))
                  .map(item => {
                    const label = String(item.name);
                    const active = selectedFilters.fuelClass.includes(label);

                    return (
                      <button
                        key={label}
                        onClick={() => handleFilterChange('fuelClass', label)}
                        className={`flex flex-col items-center justify-center py-2 rounded-lg border text-sm font-semibold transition-all
                      ${
                        active
                          ? ''
                          : 'border-slate-200 text-slate-700 bg-white hover:border-blue-400'
                      }`}
                        style={{ color: gradeFuelColor(label), backgroundColor: active ?  gradeFuelBgColor(label) : undefined }}
                      >
                        {label}
                        <span className="text-[10px] text-slate-400 hidden">
                          ({item.count})
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* WET GRIP */}
          {availableProducts.wetGrips && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Nasshaftung
                </span>
                <Info size={12} className="text-slate-400" />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[...availableProducts.wetGrips]
                  .sort((a, b) => String(a.name).localeCompare(String(b.name)))
                  .map(item => {
                    const label = String(item.name);
                    const active = selectedFilters.wetGrip.includes(label);

                    return (
                      <button
                        key={label}
                        onClick={() => handleFilterChange('wetGrip', label)}
                        className={`flex flex-col items-center justify-center py-2 rounded-lg border text-sm font-semibold transition-all
                      ${
                        active
                          ? '' 
                          : 'border-slate-200 text-slate-700 bg-white hover:border-blue-400'
                      }`}
                        style={{ color: gradeGripColor(label), backgroundColor: active ?  gradeGripBgColor(label) : undefined }}
                      >
                        {label}
                        <span className="text-[10px] text-slate-400 hidden">
                          ({item.count})
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* NOISE */}
          {availableProducts.noises && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  externes Rollgeräusch (dB)
                </span>
                <Info size={12} className="text-slate-400" />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[...availableProducts.noises]
                  .sort((a, b) => Number(a.name) - Number(b.name))
                  .map(item => {
                    const label = String(item.name);
                    const active = selectedFilters.noise.includes(label);

                    return (
                      <button
                        key={label}
                        onClick={() => handleFilterChange('noise', label)}
                        className={`py-2 rounded-lg border text-sm font-semibold transition-all
                      ${
                        active
                          ? 'border-blue-600 text-blue-700 bg-blue-50'
                          : 'border-slate-200 text-slate-700 bg-white hover:border-blue-400'
                      }`}
                      >
                        {label} dB
                        <span className="text-[10px] text-slate-400 hidden">
                          ({item.count})
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default FilterSidebar;
