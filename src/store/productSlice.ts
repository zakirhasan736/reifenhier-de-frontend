

// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';

// const apiUrl =
//   process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') ||
//   'http://localhost:5000';

// interface Product {
//   _id: string;
//   brand_logo: string;
//   product_image: string;
//   merchant_product_third_category: string;
//   brand_name: string;
//   search_price: number;
//   product_name: string;
//   dimensions: string;
//   fuel_class: string;
//   wet_grip: string;
//   noise_class: string;
// }

// interface Filters {
//   category: string[];
//   brand: string[];
//   condition: string[];
//   width: string[];
//   height: string[];
//   diameter: string[];
//   speedIndex: string[];
//   lastIndex: string[];
//   noise: string[];
//   fuelClass: string[];
//   wetGrip: string[];
//   additionalOptions: string[];
//   minPrice: number;
//   maxPrice: number;
// }

// interface ProductState {
//   products: Product[];
//   filterProducts: Record<string, string[]>;
//   total: number;
//   loading: boolean;
//   filters: Filters;
//   page: number;
//   sortField: string;
//   sortOrder: string;
//   minPriceLimit: number;
//   maxPriceLimit: number;
//   initialPriceRange: { minPrice: number; maxPrice: number };
// }

// const initialState: ProductState = {
//   products: [],
//   filterProducts: {},
//   total: 0,
//   loading: false,
//   filters: {
//     category: [],
//     brand: [],
//     condition: [],
//     width: [],
//     height: [],
//     diameter: [],
//     speedIndex: [],
//     lastIndex: [],
//     noise: [],
//     fuelClass: [],
//     wetGrip: [],
//     additionalOptions: [],
//     minPrice: 0,
//     maxPrice: 99999,
//   },
//   page: 1,
//   sortField: 'createdAt',
//   sortOrder: 'desc',
//   minPriceLimit: 0,
//   maxPriceLimit: 99999,
//   initialPriceRange: { minPrice: 0, maxPrice: 99999 },
// };

// export const fetchProducts = createAsyncThunk(
//   'products/fetchProducts',
//   async (_, { getState }) => {
//     const state = getState() as { products: ProductState };
//     const { filters, page, sortField, sortOrder } = state.products;

//     const res = await axios.get(`${apiUrl}/api/products/product-lists`, {
//       params: {
//         page,
//         limit: 12,
//         sort: sortField,
//         order: sortOrder,
//         ...filters,
//       },
//       headers: { 'Cache-Control': 'no-cache' },
//     });

//     return res.data;
//   }
// );

// const productSlice = createSlice({
//   name: 'products',
//   initialState,
//   reducers: {
//     setFilters(state, action: PayloadAction<Filters>) {
//       state.filters = action.payload;
//     },
//     removeFilter(
//       state,
//       action: PayloadAction<{ filterType: keyof Filters; value: string }>
//     ) {
//       const { filterType, value } = action.payload;
//       const current = state.filters[filterType];
    
//       // Guard against non-array filters like minPrice/maxPrice
//       if (Array.isArray(current)) {
//         state.filters[filterType] = current.filter(item => item !== value);
//       }
//     },    
//     setSort(state, action: PayloadAction<{ field: string; order: string }>) {
//       state.sortField = action.payload.field;
//       state.sortOrder = action.payload.order;
//     },
//     setPage(state, action: PayloadAction<number>) {
//       state.page = action.payload;
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(fetchProducts.pending, state => {
//         state.loading = true;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         const data = action.payload;
//         state.loading = false;
//         state.products = data.products || [];
//         state.total = data.total || 0;
//         state.minPriceLimit = data.minPrices;
//         state.maxPriceLimit = data.maxPrices;
//         state.initialPriceRange = {
//           minPrice: data.minPrices,
//           maxPrice: data.maxPrices,
//         };
//         state.filters.minPrice = data.minPrices;
//         state.filters.maxPrice = data.maxPrices;
//         state.filterProducts = data.filterGroups || {};
//       })
//       .addCase(fetchProducts.rejected, state => {
//         state.loading = false;
//       });
//   },
// });

// export const { setFilters, removeFilter, setSort, setPage } =
//   productSlice.actions;
// export default productSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') ||
  'http://localhost:5000';

// Product interface
interface Product {
  _id: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string;
  brand_name: string;
  search_price: number;
  product_name: string;
  dimensions: string;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
}

// Filters interface
interface Filters {
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

// Utility type: Keys of Filters where values are string arrays
type ArrayFilterKey = {
  [K in keyof Filters]: Filters[K] extends string[] ? K : never;
}[keyof Filters];

// Product slice state interface
interface ProductState {
  products: Product[];
  filterProducts: Record<string, string[]>;
  total: number;
  loading: boolean;
  filters: Filters;
  page: number;
  sortField: string;
  sortOrder: string;
  minPriceLimit: number;
  maxPriceLimit: number;
  initialPriceRange: { minPrice: number; maxPrice: number };
}

// Initial state
const initialState: ProductState = {
  products: [],
  filterProducts: {},
  total: 0,
  loading: false,
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

// Thunk to fetch products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState }) => {
    const state = getState() as { products: ProductState };
    const { filters, page, sortField, sortOrder } = state.products;

    const res = await axios.get(`${apiUrl}/api/products/product-lists`, {
      params: {
        page,
        limit: 12,
        sort: sortField,
        order: sortOrder,
        ...filters,
      },
      headers: { 'Cache-Control': 'no-cache' },
    });

    return res.data;
  }
);

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Filters>) {
      state.filters = action.payload;
    },
    removeFilter(
      state,
      action: PayloadAction<{ filterType: ArrayFilterKey; value: string }>
    ) {
      const { filterType, value } = action.payload;
      const current = state.filters[filterType];
      state.filters[filterType] = current.filter(item => item !== value);
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
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const data = action.payload;
        state.loading = false;
        state.products = data.products || [];
        state.total = data.total || 0;
        state.minPriceLimit = data.minPrices;
        state.maxPriceLimit = data.maxPrices;
        state.initialPriceRange = {
          minPrice: data.minPrices,
          maxPrice: data.maxPrices,
        };
        state.filters.minPrice = data.minPrices;
        state.filters.maxPrice = data.maxPrices;
        state.filterProducts = data.filterGroups || {};
      })
      .addCase(fetchProducts.rejected, state => {
        state.loading = false;
      });
  },
});

// Export actions and reducer
export const { setFilters, removeFilter, setSort, setPage } =
  productSlice.actions;
export default productSlice.reducer;
