'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilters, resetSubFilters, FilterOption } from '@/store/filterSlice';
import { debounce } from 'lodash';
import Image from 'next/image';
import { AppDispatch, RootState } from '@/store/store';

const BannerSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [diameter, setDiameter] = useState('');

  const { categories, widths, heights, diameters } = useSelector(
    (state: RootState) => state.filters
  );

  const debouncedFetch = useMemo(
    () => debounce(params => dispatch(fetchFilters(params)), 300),
    [dispatch]
  );

  useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);

  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  // Initial category load
  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);


  useEffect(() => {
    if (!category) {
      dispatch(resetSubFilters());
      setWidth('');
      setHeight('');
      setDiameter('');
      dispatch(fetchFilters({}));
    } else {
      dispatch(resetSubFilters());
      setWidth('');
      setHeight('');
      setDiameter('');
      debouncedFetch({ category });
    }
  }, [category, dispatch, debouncedFetch]);

  useEffect(() => {
    if (!width && category) {
      setHeight('');
      setDiameter('');
      debouncedFetch({ category });
    }
    if (width && category) {
      setHeight('');
      setDiameter('');
      debouncedFetch({ category, width });
    }
  }, [width, category, debouncedFetch]);

  useEffect(() => {
    if (!height && width && category) {
      setDiameter('');
      debouncedFetch({ category, width });
    }
    if (height && width && category) {
      setDiameter('');
      debouncedFetch({ category, width, height });
    }
  }, [height, category, width, debouncedFetch]);
  
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (width) params.set('width', width);
    if (height) params.set('height', height);
    if (diameter) params.set('diameter', diameter);
    router.push(`/products?${params.toString()}`);
  };

  const renderOptions = (list: FilterOption[]) =>
    list.map((item, idx) => (
      <option key={idx} value={item.name}>
        {item.name} {item.count ? `(${item.count})` : ''}
      </option>
    ));

  return (
    <section className="banner-section font-primary max-sm:h-auto">
      <div className="custom-container h-full">
        <div className="banner-content h-full">
          <div className="tyres-search-area h-full flex items-end justify-start">
            <div className="tyres-search-content relative">
              <div className="tyres-search-left-content mb-6 max-sm:mb-3  relative bottom-[-80px] max-sm:bottom-[-46px]">
                <h1 className="h2 text-mono-0 font-secondary max-sm:text-[28px]">
                  Find Your Perfect Tyres
                </h1>
                <p className="text-mono-0 font-normal font-primary">
                  Quickly get tyres suited to your vehicle and driving style.
                </p>
              </div>
              <div className="tyres-search-main-content max-w-[800px] w-full relative mb-6 bottom-[-80px] max-sm:bottom-[-46px]">
                <div className="tyres-search-header bg-mono-0 inline-block px-4 py-2 rounded-tr-[4px] rounded-tl-[4px] border-b border-b-border-100">
                  <p className="text-primary-70 font-semibold">
                    Search for Tyres
                  </p>
                </div>
                <div className="tyres-search-content w-full bg-mono-0 px-4 pt-4 rounded-tl-[0px] rounded-[4px] border border-border-100 border-t-transparent">
                  <div className="tyre-type-area flex items-center justify-between space-x-3 pb-4 max-sm:flex-col max-sm:items-start">
                    <div className="tyres-search-left-content w-full">
                      <label
                        htmlFor="vehicle"
                        className="text-primary-70 text-sm font-medium"
                      >
                        Session tyre
                      </label>
                      <select
                        className="input !rounded-[4px] !outline-none w-full !bg-mono-0 !shadow-none !border-2 !border-solid !border-border-100 px-4 py-2"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {renderOptions(categories)}
                      </select>
                    </div>
                    <div className="tyre-dimensions-left-content w-full">
                      <label
                        htmlFor="tyre-width"
                        className="text-primary-70 text-sm font-medium"
                      >
                        Width
                      </label>
                      <select
                        value={width}
                        onChange={e => setWidth(e.target.value)}
                        disabled={!category}
                        className="input !rounded-[4px] !outline-none w-full !bg-mono-0 !shadow-none !border-2 !border-solid !border-border-100 px-4 py-2"
                      >
                        <option value="">Select Width</option>
                        {renderOptions(widths)}
                      </select>
                    </div>
                    <div className="tyre-dimensions-right-content w-full">
                      <label
                        htmlFor="aspect-ratio"
                        className="text-primary-70 text-sm font-medium"
                      >
                        Ratio
                      </label>
                      <select
                        value={height}
                        onChange={e => setHeight(e.target.value)}
                        disabled={!width}
                        className="input !rounded-[4px] !outline-none w-full !bg-mono-0 !shadow-none !border-2 !border-solid !border-border-100 px-4 py-2"
                      >
                        <option value="">Select Height</option>
                        {renderOptions(heights)}
                      </select>
                    </div>
                    <div className="tyre-dimensions-right-content w-full">
                      <label
                        htmlFor="rim-diameter"
                        className="text-primary-70 text-sm font-medium"
                      >
                        Diameter
                      </label>
                      <select
                        value={diameter}
                        onChange={e => setDiameter(e.target.value)}
                        disabled={!height}
                        className="input !rounded-[4px] !outline-none w-full !bg-mono-0 !shadow-none !border-2 !border-solid !border-border-100 px-4 py-2"
                      >
                        <option value="">Select Diameter</option>
                        {renderOptions(diameters)}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={!diameter}
                    className="max-w-[180px] absolute right-5 mt-3 w-full ml-auto block border text-mono-0 bg-primary-100 rounded-full hover:bg-transparent hover:text-primary-100 transition ease !border-primary-100 cursor-pointer py-2 px-6"
                  >
                    Search Tyres
                  </button>
                  <Image
                    src={'/images/tyre-search.png'}
                    alt="Banner"
                    width={288}
                    height={111}
                    className="relative max-sm:hidden top-0 left-[-50px] right-0 mx-auto w-auto h-[111px] object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
