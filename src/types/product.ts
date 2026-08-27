// @/types/product.ts
export interface Product {
  _id: string;
  slug: string;
  product_name: string;
  brand_name: string;
  product_image: string;
  awin_image_url?: string;
  dimensions: string;
  search_price: number;
  fuel_class: string;
  wet_grip: string;
  noise_class: string;
  in_stock: string;
  delivery_time: string;
  average_rating: number;
  rating_count: number;
  cheapest_offer: number;
  expensive_offer: number;
  ean: string;
  product_url: string;
  brand_logo: string;
  merchant_product_third_category: string;
  descriptions?: string;
  description?: string;
  width?: string;
  height?: string;
  diameter?: string;
  lastIndex?: string;
  speedIndex?: string;
  tyre_label_info?: {
    supplier?: string | null;
    identifier?: string | null;
    size?: string | null;
    efficiency_class?: string | null;
    wet_grip_class?: string | null;
    noise_level_db?: string | number | null;
    noise_class?: string | null;
    snow_icon?: boolean | null;
  } | null;
  savings_percent: string;
  savings_amount: number;
  related_cheaper: [];
}
