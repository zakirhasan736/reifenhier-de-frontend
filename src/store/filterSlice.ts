import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface FilterParams {
  category?: string;
  width?: string;
  height?: string;
  diameter?: string;
}

export interface FilterOption {
  name: string;
  count?: number;
}

interface FilterState {
  categories: FilterOption[];
  widths: FilterOption[];
  heights: FilterOption[];
  diameters: FilterOption[];
  loading: boolean;
  error: string | null;
}

const initialState: FilterState = {
  categories: [],
  widths: [],
  heights: [],
  diameters: [],
  loading: false,
  error: null,
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
type FilterApiItem = string | { name: string; count?: number };
export const fetchFilters = createAsyncThunk(
  'filters/fetchFilters',
  async (params: FilterParams) => {
    const res = await axios.get(`${apiUrl}/api/products/filter-tyres`, {
      params,
    });
    return res.data;
  }
);

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    resetSubFilters: state => {
      state.widths = [];
      state.heights = [];
      state.diameters = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFilters.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.loading = false;

        const mapToOptions = (arr: FilterApiItem[] = []): FilterOption[] =>
          arr.map(item =>
            typeof item === 'string'
              ? { name: item }
              : { name: item.name, count: item.count }
          );

        state.categories = mapToOptions(action.payload.categories);
        state.widths = mapToOptions(action.payload.widths);
        state.heights = mapToOptions(action.payload.heights);
        state.diameters = mapToOptions(action.payload.diameters);
      })
      .addCase(fetchFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { resetSubFilters } = filterSlice.actions;
export default filterSlice.reducer;