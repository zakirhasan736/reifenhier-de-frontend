'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchFavorites, removeFavorite } from '../../store/favoriteSlice';
import { RootState, AppDispatch } from '../../store/store';
import Image from 'next/image';

export default function FavoritesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorite.items);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleUnfavorite = (productId: string) => {
    dispatch(removeFavorite(productId));
  };

  return (
    <div>
      <h1>Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
        >
          {favorites.map(product => (
            <div
              key={product._id}
              style={{
                border: '1px solid #eee',
                borderRadius: 12,
                padding: 16,
                position: 'relative',
              }}
            >
              <Image
                src={product.product_image}
                width={80}
                height={80}
                alt={product.product_name}
              />
              <h3>{product.product_name}</h3>
              <Image
                src={product.brand_logo}
                width={80}
                height={80}
                alt={product.brand_name}
              />
              <p>{product.merchant_product_third_category}</p>
              {/* <h3>{product.main_price}</h3> */}
              <h3>{product.search_price}</h3>
              <h3>{product.expensive_offer}</h3>
              <h3>{product.cheapest_offer}</h3>
              <p>{product.savings_percent}</p>
              {/* Remove/Favorite button */}
              <button
                onClick={() => handleUnfavorite(product._id)}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'none',
                  border: 'none',
                  fontSize: 28,
                  color: 'red',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                title="Unfavorite"
                aria-label="Remove from favorites"
              >
                {/* Filled heart icon */}
                <span role="img" aria-label="favorite">
                  ❤️
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
