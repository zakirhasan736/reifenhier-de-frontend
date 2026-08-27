import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toMoneyNumber } from '@/libs/money';

export interface CompareProduct {
  _id: string;
  slug: string;
  product_name: string;
  brand_name: string;
  product_image: string;
  awin_image_url?: string;
  dimensions: string;
  search_price: number;
  cheapest_offer?: number;
  expensive_offer?: number;
  savings_percent?: string;
  fuel_class: string;
  noise_class: string;
  wet_grip: string;
  lastIndex?: string;
  speedIndex?: string;
  width?: string;
  height?: string;
  diameter?: string;
  merchant_product_third_category?: string;
  average_rating?: number;
  in_stock?: string;
}

interface CompareState {
  products: CompareProduct[];
  suggestions: CompareProduct[];
  isOpen: boolean;
  hydrated: boolean;
}

const MAX_COMPARE = 4;

export const COMPARE_STORAGE_KEY = 'reifexa_compare_v1';

function asImage(value: unknown) {
  if (Array.isArray(value)) return String(value[0] || '');
  return String(value || '');
}

export function normalizeCompareProduct(
  raw: Partial<CompareProduct> & { _id: string; slug: string }
): CompareProduct {
  return {
    _id: raw._id,
    slug: raw.slug,
    product_name: String(raw.product_name || ''),
    brand_name: String(raw.brand_name || ''),
    product_image: asImage(raw.product_image),
    awin_image_url: String(raw.awin_image_url || ''),
    dimensions: String(raw.dimensions || ''),
    search_price:
      toMoneyNumber(raw.cheapest_offer) ??
      toMoneyNumber(raw.search_price) ??
      0,
    cheapest_offer: toMoneyNumber(raw.cheapest_offer) ?? undefined,
    expensive_offer: toMoneyNumber(raw.expensive_offer) ?? undefined,
    savings_percent: raw.savings_percent,
    fuel_class: String(raw.fuel_class || ''),
    noise_class: String(raw.noise_class || ''),
    wet_grip: String(raw.wet_grip || ''),
    lastIndex: raw.lastIndex,
    speedIndex: raw.speedIndex,
    width: raw.width,
    height: raw.height,
    diameter: raw.diameter,
    merchant_product_third_category: raw.merchant_product_third_category,
    average_rating: raw.average_rating,
    in_stock: raw.in_stock,
  };
}

const initialState: CompareState = {
  products: [],
  suggestions: [],
  isOpen: false,
  hydrated: false,
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    hydrateCompare: (state, action: PayloadAction<CompareProduct[]>) => {
      if (state.hydrated) return;
      const stored = Array.isArray(action.payload) ? action.payload : [];
      const byId = new Map<string, CompareProduct>();
      stored.forEach(p => {
        if (p?._id) byId.set(p._id, normalizeCompareProduct(p));
      });
      state.products.forEach(p => byId.set(p._id, p));
      state.products = Array.from(byId.values()).slice(0, MAX_COMPARE);
      state.hydrated = true;
    },
    addProduct: (
      state,
      action: PayloadAction<Partial<CompareProduct> & { _id: string; slug: string }>
    ) => {
      if (state.products.some(p => p._id === action.payload._id)) return;
      if (state.products.length >= MAX_COMPARE) return;
      state.products.push(normalizeCompareProduct(action.payload));
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p._id !== action.payload);
      if (state.products.length === 0) state.isOpen = false;
    },
    clearProducts: state => {
      state.products = [];
      state.isOpen = false;
    },
    setSuggestions: (state, action: PayloadAction<CompareProduct[]>) => {
      state.suggestions = action.payload
        .filter(p => p && p._id)
        .slice(0, 12)
        .map(p => normalizeCompareProduct(p));
    },
    openModal: state => {
      if (state.products.length > 0) state.isOpen = true;
    },
    closeModal: state => {
      state.isOpen = false;
    },
  },
});

export const {
  hydrateCompare,
  addProduct,
  removeProduct,
  clearProducts,
  setSuggestions,
  openModal,
  closeModal,
} = compareSlice.actions;
export default compareSlice.reducer;
