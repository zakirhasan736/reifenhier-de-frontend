'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTyreFiltersQuery } from '@/store/api/filterApi';
import CustomSelect from '@/components/elements/inputs/CustomCategorySelect';
import Image from 'next/image';
interface FilterOption {
  name: string;
  count?: number;
}
interface FilterResponse {
  categories: FilterOption[];
  widths: FilterOption[];
  heights: FilterOption[];
  diameters: FilterOption[];
  brands: FilterOption[];
  wetGrips: FilterOption[];
  fuelClasses: FilterOption[];
  noises: FilterOption[];
}
const FilterForm = () => {
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [diameter, setDiameter] = useState('');
  const [brand, setBrand] = useState('');
  const [wetGrip, setWetGrip] = useState('');
  const [fuelClass, setFuelClass] = useState('');
  const [noise, setNoise] = useState('');

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { data = {} as FilterResponse } = useGetTyreFiltersQuery({
    category,
    width,
    height,
    diameter,
    brand,
    wetGrip,
    fuelClass,
    noise
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('category', category);
    params.set('width', width);
    params.set('height', height);
    params.set('diameter', diameter);

    if (showMoreFilters) {
      params.set('brand', brand);
      params.set('wetGrip', wetGrip);
      params.set('fuelClass', fuelClass);
      params.set('noise', noise);
    }

    router.push(`/products?${params.toString()}`);
  };

  const canSearch = showMoreFilters
    ? category &&
      width &&
      height &&
      diameter &&
      brand &&
      wetGrip &&
      fuelClass &&
      noise
    : category && width && height && diameter;

  return (
    <div className="tyres-search-main-content max-w-[978px] w-full relative mx-auto">
      <div className="lg:h-[152px] h-[188px] md:block hidden w-full"></div>

      <div className="tyres-search-content md:absolute top-0 left-0 w-full bg-mono-0 md:px-[30px] px-4 py-4 md:py-6 rounded-[10px]">
        <div className="tyre-search-box lg:flex-row flex-col flex items-end gap-5 justify-between w-full">
          <div className="tyre-type-area flex-wrap flex w-full items-end justify-between gap-x-4 lg:gap-y-5 gap-y-4">
            <CustomSelect
              label="Reifentyp"
              value={category}
              onChange={val => {
                setCategory(val);
                setWidth('');
                setHeight('');
                setDiameter('');
              }}
              options={data.categories || []}
              placeholder="Reifentyp auswählen"
            />

            <CustomSelect
              label="Breite"
              value={width}
              onChange={val => {
                setWidth(val);
                setHeight('');
                setDiameter('');
              }}
              options={data.widths || []}
              placeholder="Breite auswählen"
              disabled={!category}
            />

            <CustomSelect
              label="Höhe"
              value={height}
              onChange={val => {
                setHeight(val);
                setDiameter('');
              }}
              options={data.heights || []}
              placeholder="Höhe auswählen"
              disabled={!width}
            />

            <CustomSelect
              label="Durchmesser (Zoll)"
              value={diameter}
              onChange={setDiameter}
              options={data.diameters || []}
              placeholder="Durchmesser auswählen"
              disabled={!height}
            />

            {showMoreFilters && (
              <>
                <CustomSelect
                  label="Marke"
                  value={brand}
                  onChange={setBrand}
                  options={data.brands || []}
                  placeholder="Marke auswählen"
                  disabled={!diameter}
                />

                <CustomSelect
                  label="Nasshaftung"
                  value={wetGrip}
                  onChange={setWetGrip}
                  options={data.wetGrips || []}
                  placeholder="Nasshaftung auswählen"
                  disabled={!diameter}
                />

                <CustomSelect
                  label="Kraftstoffeffizienz"
                  value={fuelClass}
                  onChange={setFuelClass}
                  options={data.fuelClasses || []}
                  placeholder="Kraftstoffeffizienz auswählen"
                  disabled={!diameter}
                />

                <CustomSelect
                  label="Externes Rollgeräusch in dB"
                  value={noise}
                  onChange={setNoise}
                  options={data.noises || []}
                  placeholder="Externes Rollgeräusch in dB"
                  disabled={!diameter}
                />
              </>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className="md:max-w-[170px] flex items-center justify-center md:gap-[10px] gap-2 max-w-[139px] md:text-[16px] text-[12px] font-medium font-primary text-left relative w-full border text-mono-0 bg-primary-100 rounded-[6px] hover:opacity-85 transition ease !border-primary-100 cursor-pointer py-2 px-3"
          >
            Reifen suchen{' '}
            <Image
              src="/images/icons/search-normal.svg"
              alt="suchen"
              loading="lazy"
              width={16}
              height={16}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowMoreFilters(prev => !prev)}
          className="text-primary-100 mt-5 text-[14px] text-left font-secondary font-normal leading-[120%] cursor-pointer lg:relative lg:bottom-0 lg:left-0 absolute bottom-10 left-8 max-sm:left-4"
        >
          {showMoreFilters ? 'Weniger Filter' : 'Weitere Filteroptionen'}
        </button>
      </div>
    </div>
  );
};

export default FilterForm;
