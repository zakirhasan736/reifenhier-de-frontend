'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTyreFiltersQuery } from '@/store/api/filterApi';
import CustomSelect from '@/components/elements/inputs/CustomCategorySelect';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface FilterOption {
  name: string;
  count?: number;
}
interface FilterResponse {
  categories: FilterOption[];
  widths: FilterOption[];
  heights: FilterOption[];
  diameters: FilterOption[];
  lastIndexes: FilterOption[];
  wetGrips: FilterOption[];
  fuelClasses: FilterOption[];
  noises: FilterOption[];
}

const FilterForm = () => {
  const router = useRouter();

  const [category, setCategory] = useState('Sommerreifen');
  const [width, setWidth] = useState('205');
  const [height, setHeight] = useState('55');
  const [diameter, setDiameter] = useState('16');
  const [lastIndex, setLastIndex] = useState('');
  const [wetGrip, setWetGrip] = useState('');
  const [fuelClass, setFuelClass] = useState('');
  const [noise, setNoise] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { data = {} as FilterResponse } = useGetTyreFiltersQuery({
    category,
    width,
    height,
    diameter,
    lastIndex,
    wetGrip,
    fuelClass,
    noise,
  });

  const validateFields = () => {
    const baseFields = [
      { label: 'Reifentyp', value: category },
      { label: 'Breite', value: width },
      { label: 'Höhe', value: height },
      { label: 'Durchmesser', value: diameter },
    ];

    const moreFields = showMoreFilters
      ? [
          { label: 'Lastindex', value: lastIndex },
          { label: 'Nasshaftung', value: wetGrip },
          { label: 'Kraftstoffeffizienz', value: fuelClass },
          { label: 'Rollgeräusch in dB', value: noise },
        ]
      : [];

    const allFields = [...baseFields, ...moreFields];

    const firstEmpty = allFields.find(
      field => !field.value || field.value.trim() === ''
    );

    if (firstEmpty) {
       toast.error(`Bitte wählen Sie ${firstEmpty.label}`);
       return false;
    }

    return true;
  };

  const handleSearch = () => {
    if (!validateFields()) return;

    const params = new URLSearchParams();
    params.set('category', category);
    params.set('width', width);
    params.set('height', height);
    params.set('diameter', diameter);

    if (showMoreFilters) {
      params.set('lastIndex', lastIndex);
      params.set('wetGrip', wetGrip);
      params.set('fuelClass', fuelClass);
      params.set('noise', noise);
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="tyres-search-main-content max-w-[978px] w-full relative mx-auto">
      <div className="lg:h-[152px] h-[188px] md:block hidden w-full"></div>

      <div className="tyres-search-content md:absolute top-0 left-0 w-full bg-mono-0 md:px-[30px] px-4 py-4 md:py-6 rounded-[10px]">
        <div className="tyre-search-box lg:flex-row flex-col flex items-end gap-5 justify-between w-full">
          <div className="tyre-type-area w-full">
            <div className="max-sm:flex-wrap tyre-type-top-filter-area flex w-full items-end justify-between gap-x-4 lg:gap-y-5 gap-y-4">
              <CustomSelect
                label="Reifentyp"
                value={category}
                onChange={val => {
                  setCategory(val);
                  setWidth('');
                  setHeight('');
                  setDiameter('');
                }}
                className="categories-select"
                options={(data.categories || []).filter(opt =>
                  opt.name?.trim()
                )}
                placeholder="Auswählen..."
              />

              <CustomSelect
                label="Breite"
                value={width}
                onChange={val => {
                  setWidth(val);
                  setHeight('');
                  setDiameter('');
                }}
                className="brand-select"
                options={(data.widths || []).filter(opt => opt.name?.trim())}
                placeholder="Auswählen..."
                disabled={!category}
              />

              <CustomSelect
                label="Höhe"
                value={height}
                onChange={val => {
                  setHeight(val);
                  setDiameter('');
                }}
                className="height-select"
                options={(data.heights || []).filter(opt => opt.name?.trim())}
                placeholder="Auswählen..."
                disabled={!width}
              />

              <CustomSelect
                label="Durchmesser (Zoll)"
                value={diameter}
                onChange={setDiameter}
                options={(data.diameters || []).filter(opt => opt.name?.trim())}
                className="diameter-select"
                placeholder="Auswählen..."
                disabled={!height}
              />
            </div>

            {showMoreFilters && (
              <div className="tyre-type-bottom-filter-area w-full gap-x-4 lg:gap-y-5 gap-y-4 mt-4 md:mt-5 grid grid-cols-2 md:grid-cols-4">
                <CustomSelect
                  label="Lastindex"
                  value={lastIndex}
                  onChange={setLastIndex}
                  options={(data.lastIndexes || []).filter(opt =>
                    opt.name?.trim()
                  )}
                  placeholder="Auswählen..."
                  className="lastindex-select"
                  disabled={!diameter}
                />

                <CustomSelect
                  label="Nasshaftung"
                  value={wetGrip}
                  onChange={setWetGrip}
                  options={(data.wetGrips || []).filter(opt =>
                    opt.name?.trim()
                  )}
                  placeholder="Auswählen..."
                  className="wetgrid-select"
                  disabled={!diameter}
                />

                <CustomSelect
                  label="Kraftstoffeffizienz"
                  value={fuelClass}
                  onChange={setFuelClass}
                  options={(data.fuelClasses || []).filter(opt =>
                    opt.name?.trim()
                  )}
                  className="fuelclass-select"
                  placeholder="Auswählen..."
                  disabled={!diameter}
                />

                <CustomSelect
                  label="Rollgeräusch in dB"
                  value={noise}
                  onChange={setNoise}
                  options={(data.noises || []).filter(opt => opt.name?.trim())}
                  className="noise-select"
                  placeholder="Auswählen..."
                  disabled={!diameter}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
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
          className="filter-type-view-more-button text-primary-100 mt-5 text-[14px] text-left font-secondary font-normal leading-[120%] cursor-pointer lg:relative lg:bottom-0 lg:left-0 absolute bottom-10 left-8 max-sm:left-4"
        >
          {showMoreFilters ? 'Weniger Filter' : 'Weitere Filteroptionen'}
        </button>
      </div>
    </div>
  );
};

export default FilterForm;
