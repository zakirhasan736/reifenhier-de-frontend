'use client';

import React from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';


const {  Range } = Slider;


interface PriceRangeSliderProps {
  min: number;
  max: number;
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  minPrice,
  maxPrice,
  onChange,
}) => {
  // Round the min and max price values to two decimal places for consistency
  const roundedMin = Math.floor(minPrice * 100) / 100;
  const roundedMax = Math.ceil(maxPrice * 100) / 100;

  // Tooltip handling for slider thumb

  

  // Show loading state when min and max are the same
  if (min === max) {
    return (
      <div className="opacity-60 text-center py-4">Loading price range...</div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mb-2 pt-1 pb-3 border-b border-b-[#C6C7CC] bg-transparent rounded">
      <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center  gap-1 justify-start pl-3">
        Preisklasse
      </h4>
      <div className="w-full px-3">
        {/* Input fields to manually adjust min and max price */}
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            value={roundedMin}
            min={min}
            max={roundedMax}
            onChange={e => {
              const v = Math.max(Number(e.target.value), min);
              onChange(v, maxPrice);
            }}
            className="border-none text-[14px] font-normal font-secondary !outline-0 !text-[#86878A] leading-[100%] !bg-transparent w-20"
            placeholder="min"
          />
          {/* <span>–</span> */}
          <input
            type="text"
            value={roundedMax}
            min={roundedMin}
            max={max}
            onChange={e => {
              const v = Math.min(Number(e.target.value), max); // Constrain to max
              onChange(minPrice, v); // Update parent with new max value
            }}
            className="border-none text-right text-[14px] font-normal font-secondary !outline-0 !text-[#86878A] leading-[100%]  !bg-transparent w-20"
            placeholder="max"
          />
        </div>

        {/* Slider for adjusting price range */}
        <div className="px-1 mt-1">
          <Range
            min={min}
            max={max}
            step={0.01}
            value={[roundedMin, roundedMax]}
            onChange={([a, b]) => {
              onChange(a, b);
            }}
            allowCross={false}
            trackStyle={[{ background: '#3a64f6', height: 6 }]} // Custom track style
            handleStyle={[
              {
                backgroundColor: '#fff',
                borderColor: '#3a64f6',
                height: 12,
                width: 12,
                marginTop: -3,
                boxShadow: '0 0 0 2px rgba(58, 100, 246, 0.3)',
              },
              {
                backgroundColor: '#fff',
                borderColor: '#3a64f6',
                height: 12,
                width: 12,
                marginTop: -3,
                boxShadow: '0 0 0 2px rgba(58, 100, 246, 0.3)',
              },
            ]} // Custom handle style
            railStyle={{ backgroundColor: '#ccc', height: 6 }} // Custom rail style
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;