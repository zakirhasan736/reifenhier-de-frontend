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
    <div className="flex flex-col gap-4 pt-2 pb-6 bg-white rounded">
      <h4 className="filter-sidebar-title pr-8 eyebrow-small flex items-start gap-1 pl-2">
        Price Range
      </h4>
      <div className="w-full">
        {/* Input fields to manually adjust min and max price */}
        <div className="flex items-center justify-between gap-2">
          <input
            type="number"
            value={roundedMin}
            min={min}
            max={roundedMax}
            onChange={e => {
              const v = Math.max(Number(e.target.value), min); // Constrain to min
              onChange(v, maxPrice); // Update parent with new min value
            }}
            className="border border-gray-300 px-2 py-1 rounded w-20"
            placeholder="min"
          />
          <span>–</span>
          <input
            type="number"
            value={roundedMax}
            min={roundedMin}
            max={max}
            onChange={e => {
              const v = Math.min(Number(e.target.value), max); // Constrain to max
              onChange(minPrice, v); // Update parent with new max value
            }}
            className="border border-gray-300 px-2 py-1 rounded w-20"
            placeholder="max"
          />
        </div>

        {/* Slider for adjusting price range */}
        <div className="px-4 mt-4">
          <Range
            min={min}
            max={max}
            step={0.01} // Precision for decimals
            value={[roundedMin, roundedMax]} // Bind slider value to minPrice and maxPrice
            onChange={([a, b]) => {
              onChange(a, b); // Pass updated range to parent
            }} // Update the selected range when slider moves
         
            allowCross={false} // Prevent the sliders from crossing each other
            trackStyle={[{ background: '#3a64f6', height: 8 }]} // Custom track style
            handleStyle={[
              {
                backgroundColor: '#fff',
                borderColor: '#3a64f6',
                height: 18,
                width: 18,
                marginTop: -6,
                boxShadow: '0 0 0 3px rgba(58, 100, 246, 0.3)',
              },
              {
                backgroundColor: '#fff',
                borderColor: '#3a64f6',
                height: 18,
                width: 18,
                marginTop: -6,
                boxShadow: '0 0 0 3px rgba(58, 100, 246, 0.3)',
              },
            ]} // Custom handle style
            railStyle={{ backgroundColor: '#ccc', height: 8 }} // Custom rail style
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;