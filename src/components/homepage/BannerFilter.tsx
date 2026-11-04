'use client';

import React, { useState } from 'react';
import { currentTyreSeason } from '@/libs/season';
import { useRouter } from 'next/navigation';
import { useGetTyreFiltersQuery } from '@/store/api/filterApi';
import CustomSelect from '@/components/elements/inputs/CustomCategorySelect';
import TyreSizeGuideModal from './TyreSizeGuideModal';
import {
  ArrowRight,
  ChevronDown,
  CircleDot,
  CloudSun,
  Info,
  Search,
  SlidersHorizontal,
  Snowflake,
  Sun,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FilterOption {
  name: string;
  count?: number;
}
interface FilterResponse {
  kategories: FilterOption[];
  widths: FilterOption[];
  heights: FilterOption[];
  diameters: FilterOption[];
  lastIndexes: FilterOption[];
  wetGrips: FilterOption[];
  fuelClasses: FilterOption[];
  noises: FilterOption[];
}

const DEFAULT_KATEGORIES: FilterOption[] = [
  { name: 'Sommerreifen' },
  { name: 'Winterreifen' },
  { name: 'Ganzjahresreifen' },
];

type FilterFormProps = {
  /** Controlled tyre type (e.g. driven by the hero so the background can follow it). */
  kategorie?: string;
  onKategorieChange?: (value: string) => void;
};

const FilterForm = ({ kategorie: kategorieProp, onKategorieChange }: FilterFormProps) => {
  const router = useRouter();

  // Uncontrolled fallback: pre-select the tyre type that's in season in
  // Germany right now (winter tyres Oct–Easter, summer tyres Easter–Sep).
  const [internalKategorie, setInternalKategorie] = useState<string>(() =>
    currentTyreSeason()
  );
  const kategorie = kategorieProp !== undefined ? kategorieProp : internalKategorie;
  const setKategories = (value: string) => {
    if (onKategorieChange) onKategorieChange(value);
    if (kategorieProp === undefined) setInternalKategorie(value);
  };
  const [width, setWidth] = useState('205');
  const [height, setHeight] = useState('55');
  const [diameter, setDiameter] = useState('16');
  const [lastIndex, setLastIndex] = useState('');
  const [wetGrip, setWetGrip] = useState('');
  const [fuelClass, setFuelClass] = useState('');
  const [noise, setNoise] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { data = {} as FilterResponse } = useGetTyreFiltersQuery({
    kategorie,
    width,
    height,
    diameter,
    lastIndex,
    wetGrip,
    fuelClass,
    noise,
  });

  /* ---------------- helpers ---------------- */
  const toNumber = (v: string) => {
    const s = String(v ?? '')
      .replace(',', '.')
      .trim();
    return /^[0-9]+(\.[0-9]+)?$/.test(s) ? parseFloat(s) : NaN;
  };

  // numeric: large -> small
  const sortNumericDesc = (arr: FilterOption[] = []): FilterOption[] =>
    [...arr]
      .filter(o => o?.name != null && String(o.name).trim() !== '')
      .sort((a, b) => {
        const na = toNumber(String(a.name));
        const nb = toNumber(String(b.name));
        const aNum = !Number.isNaN(na);
        const bNum = !Number.isNaN(nb);
        if (aNum && bNum) return nb - na;
        if (aNum && !bNum) return -1;
        if (!aNum && bNum) return 1;
        return String(a.name).localeCompare(String(b.name), 'de', {
          sensitivity: 'base',
        });
      });

  // alphabetic: A -> Z
  const sortAlphaAsc = (arr: FilterOption[] = []): FilterOption[] =>
    [...arr]
      .filter(o => {
        const n = String(o?.name ?? '').trim();
        return n !== '' && n.toLowerCase() !== 'unbekannt' && n !== '0';
      })
      .sort((a, b) =>
        String(a.name).localeCompare(String(b.name), 'de', {
          sensitivity: 'base',
        })
      );

  const kategorieOptions = sortAlphaAsc(
    data.kategories?.length ? data.kategories : DEFAULT_KATEGORIES
  );

  const handleSearch = () => {
    if (
      !kategorie &&
      !width &&
      !height &&
      !diameter &&
      !lastIndex &&
      !wetGrip &&
      !fuelClass &&
      !noise
    ) {
      toast.error('Bitte wählen Sie mindestens ein Filterfeld aus.');
      return;
    }

    const params = new URLSearchParams();
    if (kategorie) params.set('kategorie', kategorie);
    if (width) params.set('width', width);
    if (height) params.set('height', height);
    if (diameter) params.set('diameter', diameter);
    if (lastIndex) params.set('lastIndex', lastIndex);
    if (wetGrip) params.set('wetGrip', wetGrip);
    if (fuelClass) params.set('fuelClass', fuelClass);
    if (noise) params.set('noise', noise);

    router.push(`/produkte?${params.toString()}`);
  };

  const openDialogById = (id: string) => {
    (document.getElementById(id) as HTMLDialogElement | null)?.showModal();
  };

  const seasonIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('winter')) return Snowflake;
    if (n.includes('sommer')) return Sun;
    if (n.includes('ganzjahr')) return CloudSun;
    return CircleDot;
  };

  const sizeLabel = `${width || '–'}/${height || '–'} R${diameter || '–'}`;
  const extraCount = [lastIndex, wetGrip, fuelClass, noise].filter(Boolean)
    .length;

  return (
    <div className="tyres-search-main-content hero-filter-v2 max-w-[1040px] w-full relative mx-auto">
      <div className="hero-filter-card relative w-full rounded-[18px] bg-mono-0 p-4 md:p-6 lg:p-7">
        {/* ---- Season tabs + helper link ---- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 md:mb-6">
          <div
            role="tablist"
            aria-label="Reifentyp"
            className="season-tabs grid grid-cols-3 md:inline-flex gap-1 p-1 rounded-[12px] bg-[#F2F4F8]"
          >
            {kategorieOptions.map(opt => {
              const Icon = seasonIcon(opt.name);
              const active = kategorie === opt.name;
              return (
                <button
                  key={opt.name}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setKategories(active ? '' : opt.name)}
                  className={`season-tab flex items-center justify-center gap-1.5 md:gap-2 rounded-[9px] px-2 md:px-4 py-2 md:py-2.5 text-[12px] md:text-[14px] font-medium font-secondary cursor-pointer transition-all duration-200 ${
                    active
                      ? 'bg-mono-0 text-primary-100 shadow-[0_2px_10px_rgba(22,23,26,0.08)]'
                      : 'text-[#5B5D63] hover:text-[#16171A]'
                  }`}
                >
                  <Icon size={16} strokeWidth={2} className="shrink-0" />
                  <span className="truncate md:hidden">
                    {opt.name.replace(/(es)?reifen$/i, '')}
                  </span>
                  <span className="truncate max-md:hidden">{opt.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => openDialogById('tyre_size_modal')}
            className="inline-flex items-center gap-1.5 self-start md:self-auto text-[13px] md:text-[14px] font-secondary text-primary-100 hover:underline cursor-pointer"
          >
            <Info size={15} strokeWidth={2} />
            Wo finde ich meine Reifengröße?
          </button>
        </div>

        {/* ---- Size row ---- */}
        <div className="tyre-search-box flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-5">
          <div className="size-fields relative z-150 grid grid-cols-3 gap-2 md:gap-3 flex-1 items-end">
            <CustomSelect
              label="Breite"
              value={width}
              onChange={setWidth}
              className="brand-select"
              options={sortNumericDesc(data.widths || [])}
              placeholder="Alle"
            />
            <CustomSelect
              label="Höhe"
              value={height}
              onChange={setHeight}
              className="height-select"
              options={sortNumericDesc(data.heights || [])}
              placeholder="Alle"
            />
            <CustomSelect
              label="Zoll"
              value={diameter}
              onChange={setDiameter}
              options={sortNumericDesc(data.diameters || [])}
              className="diameter-select"
              placeholder="Alle"
            />
          </div>

          <div className="flex items-stretch gap-3 lg:w-auto w-full">
            <div className="size-preview hidden md:flex flex-col justify-center rounded-[10px] border-2 border-dashed border-[#DCE3FB] bg-[#F5F8FF] px-4 min-w-[150px]">
              <span className="text-[11px] uppercase tracking-[0.08em] text-[#6B6E76] font-secondary">
                Ihre Größe
              </span>
              <span className="text-[18px] font-semibold text-[#16171A] font-primary leading-tight tabular-nums">
                {sizeLabel}
              </span>
            </div>

            <button
              onClick={handleSearch}
              className="hero-search-btn group flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-[10px] bg-primary-100 px-6 md:px-8 py-3.5 text-[15px] md:text-[16px] font-semibold font-primary text-mono-0 cursor-pointer transition-all duration-200 hover:-translate-y-[1px]"
            >
              <Search size={18} strokeWidth={2.4} />
              Reifen finden
              <ArrowRight
                size={18}
                strokeWidth={2.4}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>

        {/* ---- More filters ---- */}
        <div className="mt-4 md:mt-5 pt-4 border-t border-[#EEF0F4]">
          <button
            type="button"
            onClick={() => setShowMoreFilters(prev => !prev)}
            aria-expanded={showMoreFilters}
            className="filter-type-view-more-button inline-flex items-center gap-2 cursor-pointer text-[13px] md:text-[14px] font-medium font-secondary text-[#404042] hover:text-primary-100 transition-colors"
          >
            <SlidersHorizontal size={16} strokeWidth={2} />
            {showMoreFilters ? 'Weniger Filter' : 'Weitere Filteroptionen'}
            {extraCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary-100 text-mono-0 text-[11px] font-semibold h-5 min-w-5 px-1.5">
                {extraCount}
              </span>
            )}
            <ChevronDown
              size={16}
              strokeWidth={2}
              className={`transition-transform duration-200 ${
                showMoreFilters ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showMoreFilters && (
            <div className="tyre-type-bottom-filter-area relative z-140 w-full gap-3 mt-4 grid grid-cols-2 md:grid-cols-4">
              <CustomSelect
                label="Lastindex"
                value={lastIndex}
                onChange={setLastIndex}
                options={sortNumericDesc(data.lastIndexes || [])}
                placeholder="Alle"
                className="lastindex-select"
              />
              <CustomSelect
                label="Nasshaftung"
                value={wetGrip}
                onChange={setWetGrip}
                options={sortAlphaAsc(data.wetGrips || [])}
                placeholder="Alle"
                className="wetgrid-select"
              />
              <CustomSelect
                label="Kraftstoffeffizienz"
                value={fuelClass}
                onChange={setFuelClass}
                options={sortAlphaAsc(data.fuelClasses || [])}
                className="fuelclass-select"
                placeholder="Alle"
              />
              <CustomSelect
                label="Rollgeräusch (dB)"
                value={noise}
                onChange={setNoise}
                options={sortNumericDesc(data.noises || [])}
                className="noise-select"
                placeholder="Alle"
              />
            </div>
          )}
        </div>

        <TyreSizeGuideModal
          width={width}
          height={height}
          diameter={diameter}
          lastIndex={lastIndex}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default FilterForm;