import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const Footer: React.FC = () => {
  return (
    <footer className="footer-section bg-[#F7F8FA]">
      <div className="footer-wrapper pt-4">
        <div className="custom-container">
          <div className="footer-main-centent">
            <div className="footer-cta-section bg-primary-100 md:py-[60px] py-8 lg:px-[78px] md:px-12 px-6 rounded-[20px]">
              <div className="footer-cta-content flex items-center justify-between max-sm:flex-col max-sm:gap-4">
                <div className="left-content">
                  <h3 className="font-medium font-primary text-[24px] lg:text-[30px] md:text-left text-center text-mono-0 leading-[120%]">
                    Subscribe to our Newsletter
                  </h3>
                  <p className="font-normal font-secondary text-[14px] lg:text-[16px] md:text-left text-center text-mono-0 mt-3 leading-[150%]">
                    Stay on the road with exclusive deals
                  </p>
                </div>
                <div className="right-content max-sm:w-full">
                  <form
                    action="post"
                    className="reifencheck-subscription-form w-full flex md:flex-row max-sm:flex-col gap-3 items-center"
                  >
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="border form-subs-input text-[16px] text-left font-normal font-secondary border-[#FFFFFF1F] md:max-w-[344px] placeholder:!text-[#FFFFFFB2] text-[#FFFFFFB2] !shadow-none w-full h-[47px] !bg-[#FFFFFF14] px-6 py-[15px] !rounded-full focus-visible:!rounded-full focus:!rounded-full focus-within:!rounded-full !outline-none focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-mono-0 max-sm:w-full flex items-center text-[16px] font-normal justify-center h-[47px] text-primary-100 text-center body-regular font-secondary rounded-full px-6 py-2 hover:bg-transparent hover:text-mono-0 border border-primary-100 hover:border-mono-0 transition ease cursor-pointer leading-[100%]"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="footer-top-area flex items-start justify-between pt-8  pb-[19px] max-sm:flex-col lg:gap-0 gap-5">
              <div className="footer-logo-wrapper lg:max-w-[350px] max-w-[280px] w-full">
                <Image
                  src="/images/footer-brand-logo.svg"
                  className="opacity-100 max-sm:w-[130px] sm:w-[140px] lg:w-[180px]"
                  alt="company logo"
                  width={180}
                  height={70}
                />
                <p className="sm:text-[16px] text-[14px] text-left font-normal font-secondary  text-[#86878A] leading-[150%] mt-3">
                  your trusted source for high-quality tires from top brands. We
                  make it easy to find the perfect fit for your vehicle, with
                  fast shipping and expert support.
                </p>
              </div>
              <div className="footer-quick-link-cont max-w-[690px] w-full flex items-start justify-between max-sm:flex-col max-sm:gap-4">
                <div className="quick-link-cont">
                  <h5 className="mb-2 md:mb-3 md:text-[18px] text-[14px] text-left font-normal font-primary text-[#404042] leading-[150%]">
                    Quick Links
                  </h5>
                  <ul className="quick-link-list flex flex-col gap-1 md:gap-[6px]">
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/contact-us"
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/privacy-policy"
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/terms-of-service"
                      >
                        Favorites
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="quick-link-cont">
                  <h5 className="mb-2 md:mb-3 md:text-[18px] text-[14px] text-left font-normal font-primary text-[#404042] leading-[150%]">
                    Shop
                  </h5>
                  <ul className="quick-link-list flex flex-col gap-1 md:gap-[6px]">
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/"
                      >
                        Sommer reifen
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/contact-us"
                      >
                        Winter reifen
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/privacy-policy"
                      >
                        Ganzjahresreifen
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/terms-of-service"
                      >
                        By Brand
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="quick-link-cont">
                  <h5 className="mb-2 md:mb-3 md:text-[18px] text-[14px] text-left font-normal font-primary text-[#404042] leading-[150%]">
                    Social Media
                  </h5>
                  <ul className="quick-link-list flex flex-col gap-1 md:gap-[6px]">
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/"
                      >
                        Facebook
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/contact-us"
                      >
                        Instagram
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[12px] text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                        href="/privacy-policy"
                      >
                        Twitter
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="footer-bottom-area w-full pt-[13px] pb-[20px] border-t border-t-border-100 flex items-center justify-between max-sm:flex-col max-sm:gap-3">
              <div className="foot-centent w-full lg:gap-0 gap-4 max-sm:gap-1 sm:flex-row flex-col flex items-center justify-between">
                <div className="foot-left-content">
                  <p className="foot-copyright-text max-sm:text-center text-[12px] font-normal font-secondary md:text-[16px] text-[#86878A] leading-[150%]">
                    © 2025 reifencheck.de All Rights Reserved.
                  </p>
                </div>
                <ul className="foot-middle-cont flex items-center gap-3 lg:gap-10 max-sm:justify-center">
                  <li className="foot-middle-item">
                    <Link
                      className="md:text-[16px] max-sm:text-center text-[14px] whitespace-nowrap text-left font-normal font-secondary leading-[150%] text-[#86878A]"
                      href="/privacy-policy"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="foot-middle-item">
                    <Link
                      className="md:text-[16px] text-left max-sm:text-center text-[12px] whitespace-nowrap font-normal font-secondary leading-[150%] text-[#86878A]"
                      href="/terms-of-service"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
                <p className="foot-right-content md:text-[15px] max-sm:text-center text-[13px] whitespace-nowrap text-left font-normal font-secondary leading-[150%] text-[#86878A]">
                  <Link
                    href="https://www.webdevzakir.tech"
                    rel="nofollow"
                    target="_blank"
                    className="text-[#86878A] md:text-[15px] text-[13px] hover:text-primary-100 transition-colors"
                  >
                    Developed by WebDevZakir
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
