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
  return (Math.round(n * 100) / 100).toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
    <div className="price-filter-v2 flex flex-col gap-3">
      <span id={sliderLabelId} className="sr-only">
        Preisbereich
      </span>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-[10px] border border-[#E4E7EE] bg-[#F7F8FB] px-3 py-2">
          <span className="block text-[11px] font-semibold text-[#6B6E76] font-secondary">Min</span>
          <span className="block text-[15px] font-semibold text-[#16171A] tabular-nums">{formatPrice(roundedMin)} €</span>
        </div>
        <div className="rounded-[10px] border border-[#E4E7EE] bg-[#F7F8FB] px-3 py-2 text-right">
          <span className="block text-[11px] font-semibold text-[#6B6E76] font-secondary">Max</span>
          <span className="block text-[15px] font-semibold text-[#16171A] tabular-nums">{formatPrice(roundedMax)} €</span>
        </div>
      </div>

      <div className="px-2 pt-1 pb-1" role="group" aria-labelledby={sliderLabelId}>
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
              borderWidth: 3,
              height: 20,
              width: 20,
              marginTop: -7,
              boxShadow: '0 2px 6px rgba(16, 24, 40, 0.2)',
            },
            {
              backgroundColor: '#fff',
              borderColor: '#3a64f6',
              borderWidth: 3,
              height: 20,
              width: 20,
              marginTop: -7,
              boxShadow: '0 2px 6px rgba(16, 24, 40, 0.2)',
            },
          ]}
          railStyle={{ backgroundColor: '#E4E7EE', height: 6 }}
          ariaLabelGroupForHandles={['Minimaler Preis', 'Maximaler Preis']}
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
