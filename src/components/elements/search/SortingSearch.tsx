'use client';

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
        className="font-secondary font-normal text-[14px] leading-[100%] text-[#404042]"
      >
        Sortieren nach:
      </label>
      <select
        id="sort-select"
        onChange={handleChange}
        defaultValue="date-desc"
        className="text-[14px] font-normal font-secondary h-[38px] leading-[100%] text-[#404042] px-2 py-1 !rounded-full border !border-primary-100"
      >
        <option value="price-asc">Preis: Niedrig bis Hoch</option>
        <option value="price-desc">Preis: Hoch bis Niedrig</option>
        <option value="date-desc">Neueste</option>
      </select>
    </div>
  );
};

export default SortingSearch;
