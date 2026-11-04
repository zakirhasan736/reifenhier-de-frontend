'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setFilters,
  setPage,
  // fetchProducts,
} from '@/store/productSlice';
import { RootState } from '@/store/store';

import PriceRangeSlider from '@/components/elements/search/PriceFilter';
import {
  Car,
  Check,
  ChevronDown,
  CloudRain,
  Euro,
  Fuel,
  Leaf,
  Ruler,
  Search,
  Snowflake,
  Sun,
  Tag,
  Volume2,
} from 'lucide-react';

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

  const [brandSearch, setBrandSearch] = useState('');
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.products.filters);
  const priceHistogram = useSelector((state: RootState) => state.products.priceHistogram);
  const total = useSelector((state: RootState) => state.products.total);
  const loading = useSelector((state: RootState) => state.products.loading);

    const [showAllBrands, setShowAllBrands] = useState(false);

  // treat price as "selected" if active range differs from full range
  const hasPriceActive =
    (typeof filters.minPrice === 'number' && filters.minPrice > 0 && filters.minPrice > min) ||
    (typeof filters.maxPrice === 'number' && filters.maxPrice < 99999 && filters.maxPrice < max);

  const [openSections, setOpenSections] = useState({
    kategorie: true,
    brand: true,
    price: true,
    width: false,
    height: false,
    diameter: false,
    noise: false,
    fuelClass: true,
    wetGrip: false,
    speedIndex: false,
    lastIndex: false,
  });

  const handleFilterChange = (key: keyof SelectedFilters, value: string) => {
    const currentValues = (filters as SelectedFilters)[key] || [];
    const updated = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    dispatch(setFilters({ [key]: updated } as Partial<SelectedFilters>));
    // regular filters: reset page & fetch normally (non-silent shows overlay)
    dispatch(setPage(1));
  };

  // One commit per interaction (release / Enter / quick range) – the slider
  // never fetches while dragging. null = no limit on that side.
  const handlePriceCommit = (lo: number | null, hi: number | null) => {
    dispatch(setFilters({ minPrice: lo ?? 0, maxPrice: hi ?? 99999 }));
    dispatch(setPage(1));
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

  // section selected?
  const sectionHasSelection = (section: keyof typeof openSections): boolean => {
    if (section === 'price') return hasPriceActive;
    if (
      ['width', 'height', 'diameter', 'speedIndex', 'lastIndex'].includes(
        section
      )
    ) {
      return false;
    }
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

  // click outside → close the size dropdowns (accordion sections stay as they are)
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const el = sidebarRef.current;
      if (el && !el.contains(event.target as Node)) {
        setOpenSections(prev => ({
          ...prev,
          width: false,
          height: false,
          diameter: false,
          speedIndex: false,
          lastIndex: false,
        }));
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

  /* ---------------- helpers for the markup ---------------- */
  const cleanItems = (items: FilterItem[] = []) =>
    items.filter(item => {
      const name = String(item.name ?? '').trim().toLowerCase();
      return name && name !== 'unbekannt' && name !== '0';
    });
  const byNumber = (a: FilterItem, b: FilterItem) => Number(a.name) - Number(b.name);
  const byText = (a: FilterItem, b: FilterItem) =>
    String(a.name).localeCompare(String(b.name));

  type SizeKey = 'width' | 'height' | 'diameter' | 'lastIndex' | 'speedIndex';

  const renderSizeSelect = (
    key: SizeKey,
    label: string,
    items: FilterItem[] | undefined,
    sorter: (a: FilterItem, b: FilterItem) => number
  ) => {
    if (!items) return null;
    const current = selectedFilters[key][0];
    const options = [...cleanItems(items)].sort(sorter);
    const open = openSections[key];
    return (
      <div className="relative flex flex-col gap-1 min-w-0">
        <span className="text-[11px] font-semibold text-[#6B6E76] font-secondary">
          {label}
        </span>
        <button
          type="button"
          onClick={() => toggleSection(key)}
          aria-expanded={open}
          className={`h-10 w-full flex items-center justify-between gap-1 rounded-[10px] border bg-white pl-3 pr-2 text-[14px] font-semibold font-secondary cursor-pointer transition ${
            current
              ? 'border-primary-100 text-primary-100 bg-[#F5F8FF]'
              : 'border-[#E4E7EE] text-[#16171A] hover:border-[#C9D6FC]'
          }`}
        >
          <span className="truncate">{current || 'Alle'}</span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-[#9AA0A8] transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div className="absolute top-full left-0 z-40 mt-1.5 w-full min-w-[96px] max-h-60 overflow-y-auto rounded-[12px] border border-[#E9ECF3] bg-white p-1 shadow-[0_16px_32px_-12px_rgba(16,24,40,0.25)]">
            <button
              type="button"
              onClick={() => {
                dispatch(setFilters({ [key]: [] } as Partial<SelectedFilters>));
                dispatch(setPage(1));
                toggleSection(key);
              }}
              className={`w-full text-left rounded-[8px] px-2.5 py-1.5 text-[13px] font-secondary cursor-pointer ${
                !current ? 'bg-[#EEF2FF] text-primary-100 font-semibold' : 'text-[#404042] hover:bg-[#F5F7FB]'
              }`}
            >
              Alle
            </button>
            {options.map((item, index) => {
              const value = String(item.name);
              const active = current === value;
              return (
                <button
                  type="button"
                  key={`${value}-${index}`}
                  onClick={() => {
                    dispatch(setFilters({ [key]: [value] } as Partial<SelectedFilters>));
                    dispatch(setPage(1));
                    toggleSection(key);
                  }}
                  className={`w-full flex items-center justify-between gap-2 rounded-[8px] px-2.5 py-1.5 text-[13px] font-secondary cursor-pointer ${
                    active
                      ? 'bg-primary-100 text-white font-semibold'
                      : 'text-[#16171A] hover:bg-[#F5F7FB]'
                  }`}
                >
                  <span>{value}</span>
                  {Number(item.count) > 0 && (
                    <span className={`text-[11px] ${active ? 'text-white/80' : 'text-[#9AA0A8]'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const sectionHeader = ({
    id,
    title,
    icon: Icon,
    count,
  }: {
    id: keyof typeof openSections;
    title: string;
    icon: typeof Sun;
    count?: number;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      aria-expanded={openSections[id]}
      className="w-full flex items-center gap-2.5 px-4 py-3.5 cursor-pointer"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EEF2FF] text-primary-100">
        <Icon size={16} strokeWidth={2.2} />
      </span>
      <span className="flex-1 text-left text-[15px] font-semibold text-[#16171A] font-primary">
        {title}
      </span>
      {count ? (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-100 px-1.5 text-[11px] font-semibold text-white">
          {count}
        </span>
      ) : null}
      <ChevronDown
        size={18}
        className={`text-[#9AA0A8] transition-transform ${openSections[id] ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const card = 'rounded-[16px] border border-[#E9ECF3] bg-white';

  const SEASON_OPTIONS = [
    { value: 'Sommerreifen', hint: 'Optimiert für > 7 °C', icon: Sun, tint: 'bg-[#FFF4E5] text-[#D97706]' },
    { value: 'Winterreifen', hint: 'Sicherheit bei Schnee', icon: Snowflake, tint: 'bg-[#EAF2FF] text-[#2563EB]' },
    { value: 'Ganzjahresreifen', hint: 'Ein Reifen, alle Wetterlagen', icon: CloudRain, tint: 'bg-[#E7F7F1] text-[#0F8A6B]' },
  ];

  const sizeLabel = [
    selectedFilters.width[0] || '–',
    '/',
    selectedFilters.height[0] || '–',
    ' R',
    selectedFilters.diameter[0] || '–',
  ].join('');
  const hasSize =
    selectedFilters.width.length + selectedFilters.height.length + selectedFilters.diameter.length > 0;

  const euCount =
    selectedFilters.fuelClass.length + selectedFilters.wetGrip.length + selectedFilters.noise.length;

  const gradeGrid = (
    key: 'fuelClass' | 'wetGrip',
    items: FilterItem[],
    color: (g: string) => string,
    bg: (g: string) => string
  ) => (
    <div className="grid grid-cols-5 gap-1.5">
      {[...cleanItems(items)].sort(byText).map(item => {
        const label = String(item.name);
        const active = selectedFilters[key].includes(label);
        return (
          <button
            type="button"
            key={label}
            onClick={() => handleFilterChange(key, label)}
            aria-pressed={active}
            className={`flex flex-col items-center justify-center rounded-[10px] border py-1.5 cursor-pointer transition-all ${
              active ? 'border-transparent ring-2' : 'border-[#E9ECF3] bg-white hover:border-[#C9D6FC]'
            }`}
            style={{
              backgroundColor: active ? bg(label) : undefined,
              ['--tw-ring-color' as string]: color(label),
            }}
          >
            <span className="text-[15px] font-bold leading-none" style={{ color: color(label) }}>
              {label}
            </span>
            {Number(item.count) > 0 && (
              <span className="mt-1 text-[10px] text-[#9AA0A8] leading-none">{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="filter-sidebar filter-sidebar-v2 flex flex-col gap-3" ref={sidebarRef}>
      {/* ---------------- Size finder ---------------- */}
      <div className={`${card} p-4 relative z-30`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-[16px] font-semibold text-[#16171A] font-primary">Reifen-Finder</h3>
          <span
            className={`rounded-[8px] px-2 py-1 text-[12px] font-bold tabular-nums font-secondary ${
              hasSize ? 'bg-primary-100 text-white' : 'bg-[#F2F4F8] text-[#6B6E76]'
            }`}
          >
            {sizeLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-[12px] bg-[#F2F4F8] p-1 mb-4">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[9px] bg-white py-2 text-[13px] font-semibold text-primary-100 shadow-[0_1px_3px_rgba(16,24,40,0.08)] cursor-default"
          >
            <Ruler size={15} /> Nach Größe
          </button>
          <button
            type="button"
            disabled
            title="Demnächst verfügbar"
            aria-label="Nach Auto (demnächst verfügbar)"
            className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[9px] py-2 text-[13px] font-semibold text-[#B4B9C2] cursor-not-allowed"
          >
            <Car size={15} /> Nach Auto
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {renderSizeSelect('width', 'Breite', availableProducts.widths, byNumber)}
          {renderSizeSelect('height', 'Höhe', availableProducts.heights, byNumber)}
          {renderSizeSelect('diameter', 'Zoll', availableProducts.diameters, byNumber)}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {renderSizeSelect('lastIndex', 'Lastindex', availableProducts.lastIndexes, byNumber)}
          {renderSizeSelect('speedIndex', 'Geschw.-Index', availableProducts.speedIndexes, byText)}
        </div>
      </div>

      {/* ---------------- Tyre type ---------------- */}
      {availableProducts.kategories && (
        <div className={card}>
          {sectionHeader({ id: 'kategorie', title: 'Reifentyp', icon: Sun, count: selectedFilters.kategorie.length })}
          {openSections.kategorie && (
            <div className="px-4 pb-4 flex flex-col gap-2">
              {SEASON_OPTIONS.map(({ value, hint, icon: Icon, tint }) => {
                const active = selectedFilters.kategorie.includes(value);
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => handleFilterChange('kategorie', value)}
                    aria-pressed={active}
                    className={`w-full flex items-center gap-3 rounded-[12px] border p-2.5 text-left cursor-pointer transition-all ${
                      active
                        ? 'border-primary-100 bg-[#F5F8FF] shadow-[0_0_0_1px_var(--primary-color)]'
                        : 'border-[#E9ECF3] bg-white hover:border-[#C9D6FC]'
                    }`}
                  >
                    <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${tint}`}>
                      <Icon size={17} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[14px] font-semibold text-[#16171A]">{value}</span>
                      <span className="block text-[12px] text-[#6B6E76] font-secondary">{hint}</span>
                    </span>
                    <span
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        active ? 'border-primary-100 bg-primary-100 text-white' : 'border-[#D0D5DD]'
                      }`}
                    >
                      {active && <Check size={12} strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------------- Price ---------------- */}
      <div className={card}>
        {sectionHeader({ id: 'price', title: 'Preis', icon: Euro, count: hasPriceActive ? 1 : 0 })}
        {openSections.price && (
          <div className="px-4 pb-4">
            <PriceRangeSlider
              min={min}
              max={max}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              histogram={priceHistogram}
              total={total}
              loading={loading}
              onCommit={handlePriceCommit}
            />
          </div>
        )}
      </div>

      {/* ---------------- Brand ---------------- */}
      {availableProducts.brands && (
        <div className={card}>
          {sectionHeader({ id: 'brand', title: 'Marke', icon: Tag, count: selectedFilters.brand.length })}
          {openSections.brand && (
            <div className="px-4 pb-4">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA0A8]" size={16} />
                <input
                  type="text"
                  value={brandSearch}
                  onChange={e => setBrandSearch(e.target.value)}
                  placeholder="Marke suchen…"
                  className="w-full h-10 rounded-[10px] border border-[#E4E7EE] bg-[#F7F8FB] pl-9 pr-3 text-[14px] text-[#16171A] outline-none transition focus:bg-white focus:border-primary-100 focus:ring-2 focus:ring-[#3a63f623]"
                />
              </div>
              {(() => {
                const allBrands = [...cleanItems(availableProducts.brands)].sort(byText);
                const filteredBrands = brandSearch
                  ? allBrands.filter(item =>
                      String(item.name).toLowerCase().includes(brandSearch.toLowerCase())
                    )
                  : allBrands;
                const visibleBrands =
                  !brandSearch && !showAllBrands ? filteredBrands.slice(0, 8) : filteredBrands;

                return (
                  <>
                    <ul className="flex flex-col max-h-[280px] overflow-y-auto -mx-1 pr-1">
                      {visibleBrands.map(item => {
                        const label = String(item.name);
                        const active = selectedFilters.brand.includes(label);
                        return (
                          <li key={label}>
                            <button
                              type="button"
                              onClick={() => handleFilterChange('brand', label)}
                              aria-pressed={active}
                              className="w-full flex items-center gap-2.5 rounded-[8px] px-1.5 py-1.5 text-left cursor-pointer hover:bg-[#F5F7FB]"
                            >
                              <span
                                className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition ${
                                  active ? 'border-primary-100 bg-primary-100 text-white' : 'border-[#D0D5DD] bg-white'
                                }`}
                              >
                                {active && <Check size={11} strokeWidth={3.5} />}
                              </span>
                              <span className={`flex-1 truncate text-[14px] ${active ? 'font-semibold text-[#16171A]' : 'text-[#404042]'}`}>
                                {label}
                              </span>
                              <span className="text-[12px] text-[#9AA0A8] tabular-nums">{item.count}</span>
                            </button>
                          </li>
                        );
                      })}
                      {visibleBrands.length === 0 && (
                        <li className="px-1.5 py-2 text-[13px] text-[#9AA0A8]">Keine Marke gefunden</li>
                      )}
                    </ul>
                    {!brandSearch && filteredBrands.length > 8 && (
                      <button
                        type="button"
                        onClick={() => setShowAllBrands(!showAllBrands)}
                        className="mt-2 w-full rounded-[10px] border border-[#DCE3FB] py-2 text-[13px] font-semibold text-primary-100 hover:bg-[#F5F8FF] cursor-pointer"
                      >
                        {showAllBrands ? 'Weniger Marken anzeigen' : `Alle ${filteredBrands.length} Marken anzeigen`}
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ---------------- EU label ---------------- */}
      {(availableProducts.fuelClasses || availableProducts.wetGrips || availableProducts.noises) && (
        <div className={card}>
          {sectionHeader({ id: 'fuelClass', title: 'EU-Reifenlabel', icon: Leaf, count: euCount })}
          {openSections.fuelClass && (
            <div className="px-4 pb-4 flex flex-col gap-4">
              {availableProducts.fuelClasses && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[12px] font-semibold text-[#6B6E76]">
                    <Fuel size={13} /> Kraftstoffeffizienz
                  </div>
                  {gradeGrid('fuelClass', availableProducts.fuelClasses, gradeFuelColor, gradeFuelBgColor)}
                </div>
              )}
              {availableProducts.wetGrips && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[12px] font-semibold text-[#6B6E76]">
                    <CloudRain size={13} /> Nasshaftung
                  </div>
                  {gradeGrid('wetGrip', availableProducts.wetGrips, gradeGripColor, gradeGripBgColor)}
                </div>
              )}
              {availableProducts.noises && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[12px] font-semibold text-[#6B6E76]">
                    <Volume2 size={13} /> Externes Rollgeräusch
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[...cleanItems(availableProducts.noises)].sort(byNumber).map(item => {
                      const label = String(item.name);
                      const active = selectedFilters.noise.includes(label);
                      return (
                        <button
                          type="button"
                          key={label}
                          onClick={() => handleFilterChange('noise', label)}
                          aria-pressed={active}
                          className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold cursor-pointer transition ${
                            active
                              ? 'border-primary-100 bg-primary-100 text-white'
                              : 'border-[#E4E7EE] bg-white text-[#404042] hover:border-[#C9D6FC]'
                          }`}
                        >
                          {label} dB
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
