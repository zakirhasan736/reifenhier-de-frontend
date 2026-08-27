import ProductCard from '@/components/elements/cards/ProductCard';
import SsrCarousel from '@/components/elements/SsrCarousel';
import type { Product } from '@/types/product';
import Link from 'next/link';

const LatestProducts: React.FC<{ products?: Product[] }> = ({
  products = [],
}) => {
  return (
    <section className="featured-product lg:pb-[70px] pb-14">
      <div className="custom-container">
        <div className="featured-product-content flex justify-between items-end lg:mb-8 mb-6">
          <div className="featured-product-left-content w-full">
            <h2 className="h3 font-primary font-medium md:text-[28px] text-[26px] lg:text-[36px] text-center text-[#404042] mb-3 leading-[120%]">
              Neueste Produkte
            </h2>
            <p className="font-normal font-secondary text-center lg:text-[18px] text-[16px] leading-[140%] text-[#404042]">
              Erhalten Sie schnell die passenden Reifen für Ihr Fahrzeug und
              Ihren Fahrstil.
            </p>
          </div>
          <div className="featured-product-right-content hidden">
            <Link
              href="/produkte"
              className="ml-auto block underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
            >
              Alle ansehen
            </Link>
          </div>
        </div>

        <div className="latest-product-list-area product-slides-area">
          <SsrCarousel
            variant="products"
            autoplayMs={3500}
            ariaLabel="Neueste Produkte"
          >
            {(products ?? []).map((product, index) => (
              <ProductCard key={product._id || index} {...product} />
            ))}
          </SsrCarousel>
        </div>
      </div>
      <div className="featured-product-right-content mt-6 hidden justify-center">
        <Link
          href="/produkte"
          className="mx-auto block underline whitespace-nowrap rounded-full bg-transparent text-primary-70 font-semibold transition ease cursor-pointer py-2 px-6"
        >
          View all
        </Link>
      </div>
    </section>
  );
};

export default LatestProducts;
