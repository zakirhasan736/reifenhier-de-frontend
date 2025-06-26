import React from 'react';

const FaqSection: React.FC = () => {
    return (
      <section className="FAQ-section pt-16 pb-10 bg-bg-opacity">
        <div className="custom-container">
          <div className="FAQ-content">
            <div className="section-header text-left mb-9">
              <h2 className="h3 max-sm:text-[22px] text-primary-70 font-secondary text-left leading-tight">
                <span className="text-primary-100">Frequently</span> <br />{' '}
                Frequently Asked Question (FAQ)
              </h2>
            </div>
            <div className="FAQ-list">
              <div className="collapse collapse-plus bg-mono-0 border border-border-100 mb-3">
                <input type="radio" name="my-accordion-3" defaultChecked />
                <div className="collapse-title max-sm:text-[16px] font-semibold text-primary-70 h5">
                  Why buy from Reifenhier.de?
                </div>
                <div className="collapse-content max-sm:text-[14px] body-regular font-primary">
                  Our tire price comparison goes beyond simply finding the best
                  prices. We know that price is important, but the environmental
                  friendliness of products is also becoming increasingly
                  relevant. That&apos;s why we offer a comprehensive overview
                  that, in addition to the most affordable offers, also
                  considers the ECO aspect of the tires. This means we highlight
                  tires that have better energy efficiency, produce fewer CO₂
                  emissions, and are made from more environmentally friendly
                  materials. This way, you not only save money but also
                  contribute to protecting the environment. We only work with
                  reputable online tire shops.
                </div>
              </div>
              <div className="collapse collapse-plus bg-mono-0 border border-border-100 mb-3">
                <input type="radio" name="my-accordion-3" />
                <div className="collapse-title max-sm:text-[16px] font-semibold text-primary-70 h5">
                  How do I find the right tires for my car?
                </div>
                <div className="collapse-content body-regular font-primary">
                  Use our search tool to input your vehicle type, tire
                  dimensions, and other preferences. Our platform will provide
                  you with the best options tailored to your needs.
                </div>
              </div>
              <div className="collapse collapse-plus bg-mono-0 border border-border-100 mb-3">
                <input type="radio" name="my-accordion-3" />
                <div className="collapse-title max-sm:text-[16px] font-semibold text-primary-70 h5">
                  Why do electric and hybrid vehicles need special tires?
                </div>
                <div className="collapse-content max-sm:text-[14px] body-regular font-primary">
                  Electric and hybrid vehicles are heavier due to their
                  batteries and require tires that can handle the extra weight
                  while maintaining efficiency and performance.
                </div>
              </div>
              <div className="collapse collapse-plus bg-mono-0 border border-border-100 mb-3">
                <input type="radio" name="my-accordion-3" />
                <div className="collapse-title max-sm:text-[16px] font-semibold text-primary-70 h5">
                  What characteristics should tires for electric vehicles have?
                </div>
                <div className="collapse-content max-sm:text-[14px] body-regular font-primary">
                  Tires for electric vehicles should have low rolling
                  resistance, high durability, and the ability to handle the
                  increased torque of electric motors.
                </div>
              </div>
              <div className="collapse collapse-plus bg-mono-0 border border-border-100 mb-3">
                <input type="radio" name="my-accordion-3" />
                <div className="collapse-title max-sm:text-[16px] font-semibold text-primary-70 h5">
                  Can I use regular tires on my electric vehicle?
                </div>
                <div className="collapse-content max-sm:text-[14px] body-regular font-primary">
                  While regular tires can be used, it is recommended to use
                  tires specifically designed for electric vehicles to ensure
                  optimal performance, safety, and efficiency.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default FaqSection;
