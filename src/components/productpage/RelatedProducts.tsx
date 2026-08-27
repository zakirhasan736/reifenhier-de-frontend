import ProductCard from '@/components/elements/cards/ProductCard';
import SsrCarousel from '@/components/elements/SsrCarousel';
import CompareSuggestionsSync from '@/components/productpage/CompareSuggestionsSync';
import type { Product } from '@/types/product';
import Link from 'next/link';

interface RelatedProductsProps {
  relatedProductData: Product[];
  loading?: boolean;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  relatedProductData,
  loading = false,
}) => {
  return (
    <section className="featured-product lg:py-[70px] py-[50px]">
      <CompareSuggestionsSync products={relatedProductData} />
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end mb-9">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 text-primary-70 md:text-[28px] text-[26px] lg:text-[36px] font-secondary text-center">
              Ähnliche Produkte
            </h2>
            <p className="text-mono-100 text-center font-medium lg:text-[18px] text-[14px] font-primary">
              Erhalten Sie schnell die passenden Reifen für Ihr Fahrzeug und
              Ihren Fahrstil.
            </p>
          </div>
        </div>
      </div>

      <div className="custom-container">
        {relatedProductData.length === 0 && !loading ? (
          <div className="not-found-wrapper py-12">
            <div className="not-found-cont flex flex-col justify-center items-center h-full">
              <h4 className="text-center max-sm:text-[20px]">
                Keine ähnlichen Produkte
              </h4>
              <p className="text-center max-sm:text-[14px]">
                Wir konnten keine ähnlichen Produkte für Ihre Auswahl finden.
              </p>
              <Link
                href="/produkte"
                className="primary-btn btn-styles mt-6 mx-auto block"
              >
                Alle Produkte durchsuchen
              </Link>
            </div>
          </div>
        ) : (
          <div className="featured-product-list-area product-slides-area">
            <SsrCarousel
              variant="products"
              autoplayMs={3900}
              ariaLabel="Ähnliche Produkte"
            >
              {relatedProductData.map((product, index) => (
                <ProductCard
                  key={product._id || index}
                  {...product}
                  showCompareButton={true}
                />
              ))}
            </SsrCarousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;
