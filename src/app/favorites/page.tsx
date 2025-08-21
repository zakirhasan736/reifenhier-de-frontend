'use client';

import { useGetWishlistQuery } from '@/store/api/wishlistApi';
import ProductCard from '@/components/elements/cards/ProductCard';
import Loading from '../loading';
interface RelatedCheaperItem {
  _id: string;
  brand_name: string;
  price: number;
}
interface Product {
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

export default function FavoritesPage() {
  const { data, isLoading, isError } = useGetWishlistQuery();

  const wishlist: Product[] = data?.wishlist || [];

  return (
    <section className="favorite-page-section pt-8 pb-9">
      <div className="custom-container">
        <h1 className="h4 font-medium font-primary text-[#404042] mb-5">
          Ihre Wunschliste
        </h1>

        {isLoading ? (
          <Loading />
        ) : isError ? (
          <p className="text-red-500">
            Fehler beim Laden der Wunschliste. Bitte versuchen Sie es erneut.
          </p>
        ) : wishlist.length === 0 ? (
          <p className="text-[#888]">Ihre Wunschliste ist leer.</p>
        ) : (
          <div className="favorite-wrapper grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-x-4 gap-y-6">
            {wishlist.map(product => (
              <ProductCard
                key={product._id}
                {...product}
                showCompareButton={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
