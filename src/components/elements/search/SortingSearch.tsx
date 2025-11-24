import React from 'react';

interface SortingSearchProps {
  onSortChange: (sort: string, order: string) => void;
}

const SortingSearch: React.FC<SortingSearchProps> = ({ onSortChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    switch (value) {
      case 'price-asc':
        onSortChange('search_price', 'asc');
        break;
      case 'price-desc':
        onSortChange('search_price', 'desc');
        break;
      case 'date-desc':
      default:
        onSortChange('createdAt', 'desc');
        break;
    }
  };

  return (
    <div className="sorting flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="font-secondary whitespace-nowrap font-normal text-[14px] max-sm:hidden leading-[100%] text-[#404042]"
      >
        <h1 className="font-normal text-[14px] leading-[100%] text-[#404042]">
          {' '}
          Sortieren nach:
        </h1>
      </label>

      {/* Wrapper to position the custom arrow */}
      <div className="relative inline-block  overflow-hidden !rounded-[6px]  border !border-primary-100">
        <select
          id="sort-select"
          onChange={handleChange}
          defaultValue="date-desc"
          className={[
            // your existing styles
            'select-area-sort-filter',
            'text-[14px] text-left font-normal font-secondary h-[38px] leading-[100%] text-[#404042] !rounded-[6px]',
            'px-3 py-1 !border-none overflow-hidden',
            // hide native arrow & make room for custom one
            'appearance-none pr-9',
            // nice rounding & bg
            '!rounded-md bg-white',
            // focus ring
            'focus:outline-none focus:ring-2 focus:ring-primary-100/40',
          ].join(' ')}
        >
          <option value="price-asc">Preis: Niedrig bis Hoch</option>
          <option value="price-desc">Preis: Hoch bis Niedrig</option>
          <option value="date-desc">Neueste</option>
        </select>

        {/* Custom down arrow (non-interactive) */}
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="#404042"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SortingSearch;
