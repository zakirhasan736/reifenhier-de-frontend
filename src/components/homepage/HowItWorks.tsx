import React from 'react';
import Image from 'next/image';

const HowItWorks: React.FC = () => {
    return (
      <section className="how-it-works-section py-8">
        <div className="custom-container">
          <div className="how-it-works-content">
            <div className="how-it-works-right-content w-full">
              <ul className="work-process-lists flex items-center justify-between max-md:flex-wrap max-md:gap-8">
                <li className="work-process-item max-md:flex-col max-md:w-full flex gap-6 items-center justify-center text-center">
                  <div className="icons-item">
                    <Image
                      src="/images/icons/fast-delivery.png"
                      alt="Trusted Product Icon"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="content-area max-md:justify-cente  max-md:items-center flex justify-start flex-col items-start">
                    <h5 className="work-process-title text-primary-70">
                      Trusted Product
                    </h5>
                    <p className="work-process-text text-mono-100">
                      Only parts from trusted brands
                    </p>
                  </div>
                </li>
                <li className="divider mx-6 my-0 w-[2px] h-16 bg-border-100 max-md:hidden"></li>
                <li className="work-process-item max-md:flex-col max-md:w-full flex gap-6 items-center justify-center text-center">
                  <div className="icons-item">
                    <Image
                      src="/images/icons/fast-delivery (1).png"
                      alt="Fast Delivery Icon"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="content-area max-md:justify-center  max-md:items-center flex justify-start flex-col items-start">
                    <h5 className="work-process-title text-primary-70">
                      Fast Delivery
                    </h5>
                    <p className="work-process-text text-mono-100">
                      All Over Germany
                    </p>
                  </div>
                </li>
                <li className="divider mx-6 my-0 w-[2px] h-16 bg-border-100 max-md:hidden"></li>
                <li className="work-process-item max-md:flex-col max-md:w-full flex gap-6 items-center justify-center text-center">
                  <div className="icons-item">
                    <Image
                      src="/images/icons/best-price.png"
                      alt="Best Price Icon"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="content-area max-md:justify-center  max-md:items-center flex justify-start flex-col items-start">
                    <h5 className="work-process-title text-primary-70">
                      Best Price
                    </h5>
                    <p className="work-process-text text-mono-100">
                      We compare the best prices
                    </p>
                  </div>
                </li>
                <li className="divider mx-6 my-0 w-[2px] h-16 bg-border-100 max-md:hidden"></li>
                <li className="work-process-item max-md:flex-col  max-md:items-center max-md:w-full flex gap-6 items-center justify-center text-center">
                  <div className="icons-item">
                    <Image
                      src="/images/icons/product-return.png"
                      alt="Easy Return Icon"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="content-area max-md:justify-center max-md:items-center flex justify-start flex-col items-start">
                    <h5 className="work-process-title text-primary-70">
                      Easy Return
                    </h5>
                    <p className="work-process-text text-mono-100">
                      Easy return policy
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
};

export default HowItWorks;