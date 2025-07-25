// src/store/api/brandApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BrandInfo {
  brand_name: string;
  brandLogo: string;
  count: number;
}

interface BrandResponse {
  brands: BrandInfo[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const brandApi = createApi({
  reducerPath: 'brandApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${apiUrl}/api/products` }),
  endpoints: builder => ({
    getBrandSummary: builder.query<BrandResponse, void>({
      query: () => 'brand-summary',
      keepUnusedDataFor: 300, // cache for 5 minutes
    }),
  }),
});

export const { useGetBrandSummaryQuery } = brandApi;
