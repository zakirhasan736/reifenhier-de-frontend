import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000';

/* -------------------- Types -------------------- */

export interface Product {
  _id: string;
  slug: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string;
  search_price: number;
  main_price: number;
  average_rating: number;
  rating_count: number;
  cheapest_offer: number;
  expensive_offer: number;
  savings_percent: string;
  savings_amount: number;
  related_cheaper: [];
  brand_name: string;
  product_name: string;
  in_stock: string;
  delivery_time: string;
  ean: string;
  product_url: string;
  dimensions: string;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
}

export interface Filters {
  category: string[];
  brand: string[];
  condition: string[];
  width: string[];
  height: string[];
  diameter: string[];
  speedIndex: string[];
  lastIndex: string[];
  noise: string[];
  fuelClass: string[];
  wetGrip: string[];
  additionalOptions: string[];
  minPrice: number;
  maxPrice: number;
}

type ArrayFilterKey = {
  [K in keyof Filters]: Filters[K] extends string[] ? K : never;
}[keyof Filters];

type FilterBucket = string[] | number[] | Record<string, unknown>[];
export type FilterProducts = Record<string, FilterBucket>;

interface ProductState {
  products: Product[];
  filterProducts: FilterProducts;
  total: number;

  /** Visible loader only for non-silent fetches */
  loading: boolean;
  currentRequestId?: string;

  filters: Filters;
  page: number;
  sortField: string;
  sortOrder: string;

  minPriceLimit: number;
  maxPriceLimit: number;
  initialPriceRange: { minPrice: number; maxPrice: number };
}

type QueryParamValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | undefined;
type QueryParams = Record<string, QueryParamValue>;

interface ApiRequestParams extends QueryParams {
  page: number;
  limit: number;
  sortField: string;
  sortOrder: string;
  includeFilters?: boolean;
  // filters (optional)
  category?: string[];
  brand?: string[];
  condition?: string[];
  width?: string[];
  height?: string[];
  diameter?: string[];
  speedIndex?: string[];
  lastIndex?: string[];
  noise?: string[];
  fuelClass?: string[];
  wetGrip?: string[];
  additionalOptions?: string[];
  minPrice?: number;
  maxPrice?: number;
}

interface ApiResponse {
  products: Product[];
  total: number;
  minPrices?: number;
  maxPrices?: number;
  filterGroups?: FilterProducts;
}

interface FetchArg {
  silent?: boolean;
}

/* -------------------- Initial State -------------------- */

const initialState: ProductState = {
  products: [],
  filterProducts: {},
  total: 0,
  loading: false,
  currentRequestId: undefined,

  filters: {
    category: [],
    brand: [],
    condition: [],
    width: [],
    height: [],
    diameter: [],
    speedIndex: [],
    lastIndex: [],
    noise: [],
    fuelClass: [],
    wetGrip: [],
    additionalOptions: [],
    minPrice: 0,
    maxPrice: 99999,
  },
  page: 1,
  sortField: 'createdAt',
  sortOrder: 'desc',

  minPriceLimit: 0,
  maxPriceLimit: 99999,
  initialPriceRange: { minPrice: 0, maxPrice: 99999 },
};

/* -------------------- Networking -------------------- */

/** Cancel previous HTTP request to avoid stale updates & flicker */
let inflightController: AbortController | null = null;

/**
 * Fetch products.
 * Pass `{ silent: true }` to avoid toggling `loading` (useful for price-only refreshes).
 */
export const fetchProducts = createAsyncThunk<
  ApiResponse,
  FetchArg | undefined,
  { state: { products: ProductState } }
>('products/fetchProducts', async (_arg, { getState }) => {
  const state = getState().products;
  const { filters, page, sortField, sortOrder } = state;

  // Send both new and legacy sort params for backend compatibility.
  const params: ApiRequestParams & { sort?: string; order?: string } = {
    page,
    limit: 12,
    sortField,
    sortOrder,
    sort: sortField,
    order: sortOrder,
    ...filters,
    includeFilters: page === 1 ? true : undefined,
  };

  // Abort previous request
  try {
    inflightController?.abort();
  } catch {
    /* no-op */
  }
  inflightController = new AbortController();

  const res = await axios.get<ApiResponse>(
    `${apiUrl}/api/products/product-lists`,
    {
      params,
      headers: { 'Cache-Control': 'no-cache' },
      signal: inflightController.signal,
    }
  );

  return res.data;
});

/* -------------------- Slice -------------------- */

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    /**
     * Merge-only update for filters so partial changes (like min/max price)
     * don’t wipe the rest of the filter object.
     */
    setFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    removeFilter(
      state,
      action: PayloadAction<{ filterType: ArrayFilterKey; value: string }>
    ) {
      const { filterType, value } = action.payload;
      state.filters[filterType] = state.filters[filterType].filter(
        v => v !== value
      );
    },
    setSort(state, action: PayloadAction<{ field: string; order: string }>) {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        const silent = action.meta.arg?.silent === true;
        if (!silent) state.loading = true; // only show overlay for non-silent
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        const data = action.payload;
        state.loading = false;
        state.currentRequestId = undefined;
        inflightController = null;

        state.products = data.products ?? [];
        state.total = data.total ?? 0;

        // Update UI price limits; do NOT overwrite user's current min/max.
        if (data.minPrices !== undefined && data.maxPrices !== undefined) {
          state.minPriceLimit = data.minPrices;
          state.maxPriceLimit = data.maxPrices;
          state.initialPriceRange = {
            minPrice: data.minPrices,
            maxPrice: data.maxPrices,
          };
        }
        if (data.filterGroups) {
          state.filterProducts = data.filterGroups;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentRequestId = undefined;
        inflightController = null;
      });
  },
});

export const { setFilters, removeFilter, setSort, setPage } =
  productSlice.actions;
export default productSlice.reducer;

/* -------------------- Selectors -------------------- */

/** Instant client-side price filter against last fetched products */
export const selectVisibleProducts = (state: { products: ProductState }) => {
  const { products, filters } = state.products;
  const min = Number.isFinite(filters.minPrice) ? filters.minPrice : 0;
  const max = Number.isFinite(filters.maxPrice)
    ? filters.maxPrice
    : Number.MAX_SAFE_INTEGER;

  return products.filter(p => {
    // prefer search_price, fallback to main_price; both are expected numeric
    const price = Number.isFinite(p.search_price)
      ? p.search_price
      : Number.isFinite(p.main_price)
      ? (p.main_price as number)
      : 0;
    return price >= min && price <= max;
  });
};

export const selectVisibleCount = (state: { products: ProductState }) =>
  selectVisibleProducts(state).length;


