import Image from 'next/image';
import React from 'react';

const ProductCategory: React.FC = () => {
    return (
      <section className="product-category-section py-10 bg-mono-0">
        <div className="custom-container">
          <div className="product-category-content">
            <div className="section-header text-left mb-9">
              <h2 className="h4 text-primary-70 font-secondary">
                Shop by Vehicles Category
              </h2>
              <p className="text-mono-100 font-medium text-[14px] font-primary">
                Explore our wide range of tyre categories to find the perfect
                fit for your needs.
              </p>
            </div>
            <div className="category-list grid grid-cols-4 gap-6">
              {/* Category item start */}
              <div className="category-item bg-mono-0 border border-border-100 rounded-[4px] p-4 text-center transition ease-in-out duration-300">
                <Image
                  src="/images/icons/category/quade-tyres-category.jpg"
                  alt="Quad Tyres"
                  width={150}
                  height={150}
                  className="w-auto h-[150px] mx-auto mb-4"
                />
                <h5 className="text-primary-70 font-semibold h6 font-secondary">
                  Quad Tyres
                </h5>
                <p className="text-mono-100 text-[12px] font-medium font-primary">
                  High-quality tyres for quad and ATV vehicles.
                </p>
                <p className="number-of-products font-bold text-[12px] font-secondary mt-2">
                  22 Tyres
                </p>
              </div>
              {/* Category item end */}
              {/* Category item start */}
              <div className="category-item bg-mono-0 border border-border-100 rounded-[4px] p-4 text-center transition ease-in-out duration-300">
                <Image
                  src="/images/icons/category/cycle-tyres.webp"
                  alt="Trailer Tyres"
                  width={150}
                  height={150}
                  className="w-auto h-[150px] mx-auto mb-4"
                />
                <h5 className="text-primary-70 font-semibold h6 font-secondary">
                  Trailer Tyres
                </h5>
                <p className="text-mono-100 text-[12px] font-medium font-primary">
                  Durable tyres designed for trailers and oldtimers.
                </p>
                <p className="number-of-products font-bold text-[12px] font-secondary mt-2">
                  22 Tyres
                </p>
              </div>
              {/* Category item end */}
              {/* Category item start */}
              <div className="category-item bg-mono-0 border border-border-100 rounded-[4px] p-4 text-center transition ease-in-out duration-300">
                <Image
                  src="/images/icons/category/car-tyres.webp"
                  alt="Car Tyres"
                  width={150}
                  height={150}
                  className="w-auto h-[150px] mx-auto mb-4"
                />
                <h5 className="text-primary-70 font-semibold h6 font-secondary">
                  Car Tyres
                </h5>
                <p className="text-mono-100 text-[12px] font-medium font-primary">
                  High-quality tyres for cars of all makes and models.
                </p>
                <p className="number-of-products font-bold text-[12px] font-secondary mt-2">
                  22 Tyres
                </p>
              </div>
              {/* Category item end */}
              {/* Category item start */}
              <div className="category-item bg-mono-0 border border-border-100 rounded-[4px] p-4 text-center transition ease-in-out duration-300">
                <Image
                  src="/images/icons/category/motor-cycle-tyres.webp"
                  alt="Motorcycle Tyres"
                  width={150}
                  height={150}
                  className="w-auto h-[150px] mx-auto mb-4"
                />
                <h5 className="text-primary-70 font-semibold h6 font-secondary">
                  Motorcycle Tyres
                </h5>
                <p className="text-mono-100 text-[12px] font-medium font-primary">
                  Premium tyres for motorcycles and scooters.
                </p>
                <p className="number-of-products font-bold text-[12px] font-secondary mt-2">
                  22 Tyres
                </p>
              </div>
              {/* Category item end */}
            </div>
          </div>
        </div>
      </section>
    );
};

export default ProductCategory;
