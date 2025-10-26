'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Suggestion {
  slug: string;
  name: string;
  type: 'Produkt' | 'Kategorie' | 'Marke' | 'Charity';
  storefrontId?: string;
  brand?: string;
  image?: string;
}
interface RawSuggestion {
  slug?: string;
  name: string;
  type?: 'Produkt' | 'Kategorie' | 'Marke' | 'Charity';
  storefrontId?: string;
  brand?: string;
  image?: string;
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
          slug: item.slug || '',
          name: item.name,
          image: item.image || '',
          type: item.type || 'Produkt',
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

  const handleSuggestionClick = (s: Suggestion) => {
    if (s.type === 'Produkt') {
      // ✅ route by slug; fallback to search if slug somehow missing
      if (s.slug) {
        router.push(`/produkte/${s.slug}`);
      } else {
        router.push(`/produkte?q=${encodeURIComponent(s.name)}`);
      }
    } else if (s.type === 'Kategorie') {
      router.push(`/produkte?kategorie=${encodeURIComponent(s.name)}`);
    } else if (s.type === 'Marke') {
      router.push(`/produkte?brand=${encodeURIComponent(s.name)}`);
    } else if (s.type === 'Charity' && s.storefrontId) {
      router.push(`/charity/store/${s.storefrontId}`);
    }

    setSuggestions([]);
    setQuery('');
  };

  return (
    <div
      className={`global-search-bar max-sm:hidden max-w-[500px]  w-full relative ${className}`}
    >
      <form
        className="global-search-form global-search w-full"
        onSubmit={e => e.preventDefault()}
      >
        <div className="global-search-group-field relative w-full">
          <input
            id="searchid1"
            type="search"
            value={query}
            onChange={handleInputChange}
            className="search-input-filed h-12  placeholder:text-secondary-100 !rounded-full focus-visible:!rounded-full focus:!rounded-full focus-within:!rounded-full !outline-none w-full !bg-mono-0 !shadow-none !border !border-secondary-100/40 text-[14px] font-normal bg-primary-color-70 pr-2 pl-11 py-[11.5px] text-primary-color-100 leading-[150%] font-secondary"
            placeholder="Suche nach Produkt..."
          />
          <label
            htmlFor="searchid1"
            className="searchbtn absolute top-[16px] left-4"
          >
            <svg
              className="h-[1em] opacity-100"
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
                key={`${sugg.type}-${sugg.slug || sugg.name}-${idx}`}
                onClick={() => handleSuggestionClick(sugg)}
                className="flex items-center gap-3 p-3 text-sm hover:bg-gray-100 cursor-pointer border-b border-b-black/30 last:border-0"
              >
                {/* ✅ show product image if available */}
                {sugg.type === 'Produkt' && sugg.image && (
                  <Image
                    src={sugg.image}
                    alt={sugg.name}
                    className="w-10 h-10 object-contain rounded border border-gray-200"
                    width={40} height={40}
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{sugg.name}</span>
                  <div className="text-xs text-gray-500">
                    {sugg.type} {sugg.brand ? `| Marke: ${sugg.brand}` : ''}
                  </div>
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
