'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Suggestion {
  id: string;
  name: string;
  type: 'Product' | 'Category' | 'Brand' | 'Charity';
  storefrontId?: string;
  brand?: string;
}
interface RawSuggestion {
  _id?: string;
  id?: string;
  name: string;
  type?: 'Product' | 'Category' | 'Brand' | 'Charity';
  storefrontId?: string;
  brand?: string;
}

interface GlobalSearchProps {
  className?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchSuggestions = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/products/suggestions`, {
        params: { query: searchTerm },
      });

      const data: RawSuggestion[] = response.data || [];

      if (Array.isArray(data)) {
        const mapped = data.map((item: RawSuggestion) => ({
          id: item.id || item._id || '',
          name: item.name,
          type: item.type || 'Product',
          storefrontId: item.storefrontId,
          brand: item.brand,
        }));
        setSuggestions(mapped.slice(0, 10));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'Product') {
      router.push(`/products/${suggestion.id}`);
    } else if (suggestion.type === 'Category') {
      router.push(`/products?category=${encodeURIComponent(suggestion.name)}`);
    } else if (suggestion.type === 'Brand') {
      router.push(`/products?brand=${encodeURIComponent(suggestion.name)}`);
    } else if (suggestion.type === 'Charity' && suggestion.storefrontId) {
      router.push(`/charity/store/${suggestion.storefrontId}`);
    }

    setSuggestions([]);
    setQuery('');
  };

  return (
    <div
      className={`global-search-bar max-sm:hidden max-w-[300px] w-full relative ${className}`}
    >
      <form className="global-search-form global-search w-full">
        <div className="global-search-group-field relative w-full">
          <input
            id="searchid1"
            type="search"
            value={query}
            onChange={handleInputChange}
            className="search-input-filed h-12  placeholder:text-primary-color-100 !rounded-full focus-visible:!rounded-full focus:!rounded-full focus-within:!rounded-full !outline-none w-full !bg-mono-0 !shadow-none !border !border-border-100 text-[14px] font-normal bg-primary-color-70 pr-2 pl-[38px] py-[11.5px] text-primary-color-100 leading-[150%] font-secondary"
            placeholder="Suchen..."
          />
          <label
            htmlFor="searchid1"
            className="searchbtn absolute top-[16px] left-3"
          >
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
          </label>
        </div>
      </form>
      {query.length > 1 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-3 text-sm text-gray-500">Laden...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((sugg, idx) => (
              <div
                key={idx}
                onClick={() => handleSuggestionClick(sugg)}
                className="p-3 text-sm hover:bg-gray-100 cursor-pointer border-b last:border-0"
              >
                <span className="font-medium">{sugg.name}</span>
                <div className="text-xs text-gray-500">
                  {sugg.type} {sugg.brand ? `| Brand: ${sugg.brand}` : ''}
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
