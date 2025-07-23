'use client';
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import filterReducer from './filterSlice';
import compareReducer from './compareSlice';
import favoriteReducer from './favoriteSlice'; 

const store = configureStore({
  reducer: {
    products: productReducer,
    filters: filterReducer,
    compare: compareReducer,
    favorite: favoriteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
