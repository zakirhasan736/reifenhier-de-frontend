import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getOrCreateUuid } from '@/utils/uuid';
interface RelatedCheaperItem {
  _id: string;
  brand_name: string;
  price: number;
}
// Define the wishlist item shape
export interface WishlistProduct {
  _id: string;
  slug: string;
  brand_logo: string;
  product_image: string;
  merchant_product_third_category: string;
  brand_name: string;
  search_price: number;
  average_rating: number;
  rating_count: number;
  cheapest_offer: number;
  expensive_offer: number;
  savings_percent: string;
  savings_amount: number;
  related_cheaper: RelatedCheaperItem[] | string;
  product_name: string;
  dimensions: string;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  in_stock: string;
  showCompareButton?: boolean;
  favoritedAt?: string;
}

// Define the response shape for count
interface WishlistCountResponse {
  count: number;
}

export const wishlistApi = createApi({
  reducerPath: 'wishlistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + '/api/wishlist',
    credentials: 'include',
  }),
  tagTypes: ['Wishlist'],
  endpoints: builder => ({
    // ✅ GET: List of wishlist items
    getWishlist: builder.query<{ wishlist: WishlistProduct[] }, void>({
      query: () => `list?uuid=${getOrCreateUuid()}`,
      providesTags: ['Wishlist'],
    }),

    // ✅ GET: Wishlist item count
    getWishlistCount: builder.query<WishlistCountResponse, void>({
      query: () => `count?uuid=${getOrCreateUuid()}`,
      providesTags: ['Wishlist'],
    }),

    // ✅ POST: Add a product to wishlist
    addWishlist: builder.mutation<void, string>({
      query: (productId: string) => ({
        url: 'add',
        method: 'POST',
        body: { productId, uuid: getOrCreateUuid() },
      }),
      invalidatesTags: ['Wishlist'],
    }),

    // ✅ POST: Remove a product from wishlist
    removeWishlist: builder.mutation<void, string>({
      query: (productId: string) => ({
        url: 'remove',
        method: 'POST',
        body: { productId, uuid: getOrCreateUuid() },
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useGetWishlistCountQuery,
  useAddWishlistMutation,
  useRemoveWishlistMutation,
} = wishlistApi;