'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSuggestions, type CompareProduct } from '@/store/compareSlice';
import type { AppDispatch } from '@/store/store';
import type { Product } from '@/types/product';

export default function CompareSuggestionsSync({
  products,
}: {
  products: Product[];
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const mapped: CompareProduct[] = (products || []).map(p => ({
      _id: p._id,
      slug: p.slug,
      product_name: p.product_name,
      brand_name: p.brand_name,
      product_image: Array.isArray(p.product_image)
        ? p.product_image[0]
        : p.product_image,
      awin_image_url: p.awin_image_url,
      dimensions: p.dimensions,
      search_price: p.search_price,
      cheapest_offer: p.cheapest_offer,
      expensive_offer: p.expensive_offer,
      savings_percent: p.savings_percent,
      fuel_class: p.fuel_class,
      wet_grip: p.wet_grip,
      noise_class: p.noise_class,
      lastIndex: p.lastIndex,
      speedIndex: p.speedIndex,
      width: p.width,
      height: p.height,
      diameter: p.diameter,
      merchant_product_third_category: p.merchant_product_third_category,
      average_rating: p.average_rating,
      in_stock: p.in_stock,
    }));
    dispatch(setSuggestions(mapped));
    return () => {
      dispatch(setSuggestions([]));
    };
  }, [products, dispatch]);

  return null;
}
