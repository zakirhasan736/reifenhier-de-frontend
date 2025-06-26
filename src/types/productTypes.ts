export interface Product {
  id: number | string;
  charity: {
    charityName: string;
    profileImage: string;
    charityID: string;
    addresses: { city: string; country: string }[];
  };
  seller: {
    firstName: string;
    lastName: string;
    profileImages: string;
    addresses: { city: string; country: string }[];
  };
  charityImageSrc?: string;
  charityImageAlt?: string;
  productImageSrc?: string;
  images: Array<{ url: string; altText: string }>;
  productImageAlt?: string;
  brand?: string;
  name?: string;
  size?: string;
  dimensionHeight?: string;
  dimensionWidth?: string;
  price?: string;
  location?: string;
  category?: string;
  subcategory?: string;
  condition?: string;
  status?: 'DRAFT' | 'LIVE' | 'REMOVED'; // Refined status types
  stock?: number;
  averageDeliveryTime?: number;
  isLoggedIn?: boolean;
  onFavoriteClick?: () => void;
  onDeleteConfirm?: (productId: number) => void;
  isFavorite?: boolean;
  isArchived?: boolean;
}
export interface CartItem {
  productId: Product;
  quantity: number;
}