import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface FilterOption {
  name: string;
  count?: number;
}

interface FilterParams {
  kategorie?: string;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  wetGrip?: string;
  fuelClass?: string;
  noise?: string;
}

interface FilterResponse {
  kategories: FilterOption[];
  widths: FilterOption[];
  heights: FilterOption[];
  diameters: FilterOption[];
  lastIndexes: FilterOption[];
  wetGrips: FilterOption[];
  fuelClasses: FilterOption[];
  noises: FilterOption[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const filterApi = createApi({
  reducerPath: 'filterApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${apiUrl}/api/products/` }),
  endpoints: builder => ({
    getTyreFilters: builder.query<FilterResponse, FilterParams>({
      query: params => ({
        url: 'filter-tyres',
        params,
      }),
    }),
  }),
});

export const { useGetTyreFiltersQuery } = filterApi;
