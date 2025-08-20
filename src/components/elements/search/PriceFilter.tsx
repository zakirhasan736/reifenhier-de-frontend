'use client';

import React, { useMemo} from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const { Range } = Slider;

interface PriceRangeSliderProps {
  min: number;
  max: number;
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void;
}

// Display: replace decimal dot with comma (no thousands separators)
const formatPrice = (n: number) => {
  if (!Number.isFinite(n)) return '';
  // keep up to two decimals similar to original
  return (Math.round(n * 100) / 100).toString().replace(/\./g, ',');
};

// Parse: accept comma as decimal; strip other non-numeric chars
// const parsePrice = (value: string) => {
//   if (!value) return NaN;
//   const cleaned = value.trim().replace(/[^\d,-]/g, '');
//   const normalized = cleaned.replace(/,/g, '.');
//   const num = Number(normalized);
//   return Number.isFinite(num) ? num : NaN;
// };

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  minPrice,
  maxPrice,
  onChange,
}) => {
  // keep consistency to two decimals like before
  const roundedMin = useMemo(
    () => Math.floor(minPrice * 100) / 100,
    [minPrice]
  );
  const roundedMax = useMemo(() => Math.ceil(maxPrice * 100) / 100, [maxPrice]);

  // local input state so users can type with comma
  // const [minInput, setMinInput] = useState(formatPrice(roundedMin));
  // const [maxInput, setMaxInput] = useState(formatPrice(roundedMax));

  // sync when props change
  // useEffect(() => {
  //   setMinInput(formatPrice(roundedMin));
  // }, [roundedMin]);

  // useEffect(() => {
  //   setMaxInput(formatPrice(roundedMax));
  // }, [roundedMax]);

  // if (min === max) {
  //   return (
  //     <div className="opacity-60 text-center py-4">Loading price range...</div>
  //   );
  // }

  return (
    <div className="flex flex-col gap-4 mb-2 pt-1 pb-3 border-b border-b-[#C6C7CC] bg-transparent rounded">
      <h4 className="filter-sidebar-title text-[16px] text-left font-secondary font-normal leading-[100%] pr-8 relative flex items-center gap-1 justify-start pl-3">
        Preisbereich
      </h4>

      <div className="w-full px-3">
        {/* Inputs */}
        <div className="flex items-center justify-between gap-2">
          {/* Min Price Input with € */}
          {/* <div className="flex items-center gap-1 w-1/2">
            <input
              type="text"
              inputMode="decimal"
              lang="de"
              value={minInput}
              onChange={e => {
                const raw = e.target.value;
                setMinInput(raw);
                const parsed = parsePrice(raw);
                if (Number.isNaN(parsed)) return;
                const clamped = Math.max(Math.min(parsed, maxPrice), min);
                onChange(clamped, maxPrice);
              }}
              className="border-none text-[14px] font-normal w-full font-secondary !outline-0 !text-[#86878A] leading-[100%] !bg-transparent"
              placeholder="min"
              aria-label="Mindestpreis"
            />
            <span className="text-[#86878A] text-[14px] font-secondary">€</span>
          </div> */}
          {/* Max Price Input with € */}
          {/* <div className="flex items-center gap-[2px] w-1/2 justify-end">
            <input
              type="text"
              inputMode="decimal"
              lang="de"
              value={maxInput}
              onChange={e => {
                const raw = e.target.value;
                setMaxInput(raw);
                const parsed = parsePrice(raw);
                if (!Number.isNaN(parsed)) {
                  const clamped = Math.min(Math.max(parsed, minPrice), max);
                  onChange(minPrice, clamped);
                }
              }}
              className="text-[14px] font-secondary text-[#86878A] bg-transparent outline-none border-none w-full text-right"
              placeholder="max"
              aria-label="Höchstpreis"
            />
            <span className="text-[14px] text-[#86878A] font-secondary">€</span>
          </div> */}
          {/* Min Price */}
          <div className="flex items-center gap-[2px] text-[14px] text-[#86878A] font-secondary">
            <p>{formatPrice(roundedMin)}</p> <span className="text-lg">€</span>
          </div>
          {/* Max Price */}
          <div className="flex items-center gap-[2px] text-[14px] text-[#86878A] font-secondary">
            <p>{formatPrice(roundedMax)}</p> <span className="text-lg">€</span>
          </div>
        </div>

        {/* Slider */}
        <div className="px-1 mt-1">
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
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
