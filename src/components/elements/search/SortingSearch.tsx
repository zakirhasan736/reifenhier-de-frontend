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
      <label htmlFor="sort-select" className="text-sm font-medium">
        Sort by:
      </label>
      <select
        id="sort-select"
        onChange={handleChange}
        defaultValue="date-desc"
        className="text-sm px-2 py-1 border rounded"
      >
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="date-desc">Most Recent</option>
      </select>
    </div>
  );
};

export default SortingSearch;
