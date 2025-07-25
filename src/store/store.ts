import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import filterReducer from './filterSlice';
import compareReducer from './compareSlice';
import favoriteReducer from './favoriteSlice';
import { wishlistApi } from './api/wishlistApi';
import { latestProductApi } from './api/latestProductApi';
import { featuredProductApi } from './api/featuredProductApi';
import { blogsApi } from './api/blogApi';
import { brandApi } from './api/brandApi';
import { filterApi } from './api/filterApi';
const store = configureStore({
  reducer: {
    products: productReducer,
    filters: filterReducer,
    compare: compareReducer,
    favorite: favoriteReducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [latestProductApi.reducerPath]: latestProductApi.reducer,
    [featuredProductApi.reducerPath]: featuredProductApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [filterApi.reducerPath]: filterApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      wishlistApi.middleware,
      latestProductApi.middleware,
      featuredProductApi.middleware,
      blogsApi.middleware,
      brandApi.middleware,
      filterApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;