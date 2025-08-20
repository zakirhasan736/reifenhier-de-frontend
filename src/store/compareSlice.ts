// redux/compareSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  _id: string;
  product_name: string;
  brand_name: string;
  product_image: string;
  dimensions: string;
  search_price: number;
  fuel_class: string;
  noise_class: string;
  wet_grip: string;
  lastIndex?: string;
  speedIndex?: string;
}

interface CompareState {
  products: Product[];
  isOpen: boolean;
}

const initialState: CompareState = {
  products: [],
  isOpen: false,
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    // addProduct: (state, action: PayloadAction<Product>) => {
    //   if (!state.products.find(p => p._id === action.payload._id)) {
    //     state.products.push(action.payload);
    //   }
    // },
    addProduct: (state, action: PayloadAction<Product>) => {
      if (state.products.find(p => p._id === action.payload._id)) return;
      const exists = state.products.find(p => p._id === action.payload._id);
      if (!exists && state.products.length < 4) {
        state.products.push(action.payload);
      }
      if (state.products.length >= 4) {
        console.warn('Maximum of 4 products allowed for comparison');
        return;
      }
      if (!state.products.find(p => p._id === action.payload._id)) {
        state.products.push(action.payload);
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p._id !== action.payload);
    },
    clearProducts: state => {
      state.products = [];
    },
    openModal: state => {
      state.isOpen = true;
    },
    closeModal: state => {
      state.isOpen = false;
    },
  },
});

export const { addProduct, removeProduct, clearProducts, openModal, closeModal } = compareSlice.actions;
export default compareSlice.reducer;
