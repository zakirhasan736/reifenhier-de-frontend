import Link from 'next/link';
import ProductCard from '@/components/elements/cards/ProductCard';
import SsrCarousel from '@/components/elements/SsrCarousel';
import type { Product } from '@/types/product';

const FeaturedProducts: React.FC<{
  products?: Product[];
  title?: string;
  category?: string;
}> = ({
  products = [],
  title = 'Our recommendation',
  category = 'Winterreifen',
}) => {
  return (
    <section className="featured-product lg:py-[70px] py-14">
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end mb-8">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 font-primary font-medium md:text-[28px] text-[26px] lg:text-[36px] text-center text-[#16171A] mb-3 leading-[120%]">
              {title}
            </h2>
            <p className="font-normal font-secondary text-center lg:text-[18px] text-[16px] leading-[140%] text-[#404042]">
              Erhalten Sie schnell die passenden Reifen für Ihr Fahrzeug und
              Ihren Fahrstil.
            </p>
          </div>
        </div>

        <div className="featured-product-list-area product-slides-area">
          <SsrCarousel variant="products" autoplayMs={3900} ariaLabel={title}>
            {(products ?? []).map((product, index) => (
              <ProductCard key={product._id || index} {...product} />
            ))}
          </SsrCarousel>
        </div>
        <div className="featured-product-right-content max-md:flex justify-center mt-5 mx-auto w-full">
          <Link
            href={{
              pathname: '/produkte',
              query: { category },
            }}
            className="mx-auto block text-center underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
          >
            Alle ansehen
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
