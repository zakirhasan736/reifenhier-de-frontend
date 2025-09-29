'use client';

import { useGetWishlistQuery } from '@/store/api/wishlistApi';
import ProductCard from '@/components/elements/cards/ProductCard';
import Loading from '@/app/loading';

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

export default function FavoritesClient() {
  // Hooks are safe here (client component)
  const { data, isLoading, isError } = useGetWishlistQuery();

  const wishlist: Product[] = data?.wishlist || [];

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <p className="text-red-500">
        Fehler beim Laden der Wunschliste. Bitte versuchen Sie es erneut.
      </p>
    );

  if (wishlist.length === 0)
    return <p className="text-[#888]">Ihre Wunschliste ist leer.</p>;

  return (
    <div className="favorite-wrapper grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-x-4 gap-y-6">
      {wishlist.map(product => (
        <ProductCard key={product._id} {...product} showCompareButton={false} />
      ))}
    </div>
  );
}
