import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface FilterParams {
  kategorie?: string;
  width?: string;
  height?: string;
  diameter?: string;
}

export interface FilterOption {
  name: string;
  count?: number;
}

interface FilterState {
  kategories: FilterOption[];
  widths: FilterOption[];
  heights: FilterOption[];
  diameters: FilterOption[];
  loading: boolean;
  error: string | null;
}

const initialState: FilterState = {
  kategories: [],
  widths: [],
  heights: [],
  diameters: [],
  loading: false,
  error: null,
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
type FilterApiItem = string | { name: string; count?: number };
export const fetchFilters = createAsyncThunk(
  'filters/fetchFilters',
  async (params: FilterParams) => {
    console.log('🟡 fetchFilters called with params:', params);
    console.log('🟡 API endpoint:', `${apiUrl}/api/products`);

    try {
      const res = await axios.get(`${apiUrl}/api/products`, {
        params,
      });

      console.log('🟢 RAW FILTER API RESPONSE:', res.data);

      return res.data;
    } catch (error) {
      console.error('🔴 fetchFilters error:', error);
      throw error;
    }
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

        state.kategories = mapToOptions(action.payload.kategories);
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