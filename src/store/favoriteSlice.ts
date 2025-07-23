import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrCreateUuid } from '../utils/uuid';
import { debounceAsync } from '../utils/debounce';
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000';
export interface Product {
  _id: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string;
  brand_name: string;
  search_price: number;
  main_price: number;
  product_name: string;
  dimensions: string;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  average_rating: number;
  rating_count: number;
  cheapest_offer: number;
  expensive_offer: number;
  savings_percent: string;
  savings_amount: number;
  product_url: string;
}

interface FavoriteState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

export const fetchFavorites = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('favorite/fetchFavorites', async (_, { rejectWithValue }) => {
  try {
    getOrCreateUuid();
    const res = await fetch(`${apiUrl}/api/favorites/list`, {
      credentials: 'include',
    });
    const data = await res.json();
    return data.favorites || [];
  } catch  {
    return rejectWithValue('');
  }
});

// Debounced backend calls for adding/removing
const debouncedAdd = debounceAsync(async (productId: string) => {
  await fetch(`${apiUrl}/api/favorites/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ productId }),
  });
}, 400);

const debouncedRemove = debounceAsync(async (productId: string) => {
  await fetch(`${apiUrl}/api/favorites/remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ productId }),
  });
}, 400);

export const addFavorite = createAsyncThunk<string, string>(
  'favorite/addFavorite',
  async (productId, { dispatch }) => {
    await debouncedAdd(productId);
    dispatch(fetchFavorites());
    return productId;
  }
);

export const removeFavorite = createAsyncThunk<string, string>(
  'favorite/removeFavorite',
  async (productId, { dispatch }) => {
    await debouncedRemove(productId);
    dispatch(fetchFavorites());
    return productId;
  }
);

const initialState: FavoriteState = {
  items: [],
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFavorites.pending, state => {
        state.loading = true;
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.items = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default favoriteSlice.reducer;
