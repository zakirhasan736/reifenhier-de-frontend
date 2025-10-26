import React, { useMemo } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const { Range } = Slider;

interface PriceRangeSliderProps {
  min: number;
  max: number;
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void; // parent debounces & fetches
}

const formatPrice = (n: number) => {
  if (!Number.isFinite(n)) return '';
  return (Math.round(n * 100) / 100).toString().replace(/\./g, ',');
};

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  minPrice,
  maxPrice,
  onChange,
}) => {
  const roundedMin = useMemo(
    () => Math.max(min, Math.floor(minPrice * 100) / 100),
    [min, minPrice]
  );
  const roundedMax = useMemo(
    () => Math.min(max, Math.ceil(maxPrice * 100) / 100),
    [max, maxPrice]
  );

  const sliderLabelId = 'price-range-label';

  return (
    <div className="flex flex-col gap-4 mb-2 pt-1 pb-3 border-b border-b-[#C6C7CC] bg-transparent rounded">
      <h4
        id={sliderLabelId}
        className="filter-sidebar-title text-[16px] !text-[#16171A] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center gap-1 justify-start pl-3"
      >
        Preisbereich
      </h4>

      <div className="w-full px-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-[2px] text-[14px] text-[#86878A] font-secondary">
            <p>{formatPrice(roundedMin)}</p> <span className="text-lg">€</span>
          </div>
          <div className="flex items-center gap-[2px] text-[14px] text-[#86878A] font-secondary">
            <p>{formatPrice(roundedMax)}</p> <span className="text-lg">€</span>
          </div>
        </div>

        {/* ✅ Accessible wrapper gives the slider a name */}
        <div className="px-1 mt-1" role="group" aria-labelledby={sliderLabelId}>
          <Range
            min={min}
            max={max}
            step={0.01}
            value={[roundedMin, roundedMax]}
            onChange={([a, b]) => onChange(a, b)}
            allowCross={false}
            trackStyle={[{ background: '#3a64f6', height: 6 }]}
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
            ]}
            railStyle={{ backgroundColor: '#ccc', height: 6 }}
            ariaLabelGroupForHandles={['Minimaler Preis', 'Maximaler Preis']} // ✅ supported in v9+
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
