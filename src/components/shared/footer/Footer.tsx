import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const Footer: React.FC = () => {
  return (
    <footer className="footer-section">
      <div className="footer-wrapper bg-primary-100 pt-12">
        <div className="custom-container">
          <div className="footer-main-centent">
            <div className="footer-top-area grid grid-cols-4 max-sm:grid-cols-1 gap-6 pb-12">
              <div className="direct-links  max-sm:order-2">
                <h5 className="body-regular h6 text-mono-0 mb-3 font-secondary font-medium">
                  Quick Links
                </h5>
                <ul className="footer-links flex flex-col gap-2">
                  <li>
                    <Link
                      className="cursor-pointer text-mono-0 body-regular font-secondary"
                      href="/"
                    >
                      contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="cursor-pointer text-mono-0 body-regular font-secondary"
                      href="/"
                    >
                      Information for tire shop operators
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="direct-links  max-sm:order-3">
                <h5 className="body-regular h6 text-mono-0 mb-3 font-secondary font-medium">
                  Quick Links
                </h5>
                <ul className="footer-links flex flex-col gap-2">
                  <li>
                    <Link
                      className="cursor-pointer text-mono-0 body-regular font-secondary"
                      href="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="cursor-pointer text-mono-0 body-regular font-secondary"
                      href="/"
                    >
                      Products
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="direct-links  max-sm:order-4">
                <h5 className="body-regular h6 text-mono-0 mb-3 font-secondary font-medium">
                  Legal links
                </h5>
                <ul className="footer-links flex flex-col gap-2">
                  <li>
                    <Link
                      className="cursor-pointer text-mono-0 body-regular font-secondary"
                      href="/"
                    >
                      imprint
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="cursor-pointer text-mono-0 body-regular font-secondary"
                      href="/"
                    >
                      Terms and Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="cursor-pointer text-mono-0 body-regular font-secondary"
                      href="/"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="direct-links max-sm:order-1">
                <h5 className="subscription text-mono-0 h6 font-secondary mb-3">
                  Subscribe to our Newsletter
                </h5>
                <form
                  action="post"
                  className="subscription-form flex flex-col gap-4"
                >
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email address"
                    required
                    className="input !rounded-full body-regular font-secondary !outline-none w-full !border-none !bg-mono-0 !shadow-none !border-2 !border-border-100 px-4 py-2"
                  />
                  <button
                    type="submit"
                    className="max-w-[120px] max-sm:max-w-full bg-primary-70 w-full focus:outline-none focus:!rounded-[4px] ml-auto block border text-mono-0 hover:text-mono-0 rounded-full hover:bg-transparent  transition ease border-primary-70 hover:border-border-100 cursor-pointer py-2 px-6"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
            <div className="footer-bottom-area pb-8 flex items-center justify-between max-sm:flex-col max-sm:gap-3">
              <div className="left-content">
                <Image
                  src="/images/reifenier_logo_new.webp"
                  className="opacity-100 max-sm:w-[130px]"
                  alt="company logo"
                  width="160"
                  height="40"
                />
              </div>
              <div className="right-content flex items-end max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:gap-2 gap-4">
                <h6 className="title text-mono-0 mb-2 body-regular font-seconday font-medium">
                  Social Media:
                </h6>
                <ul className="footer-links flex gap-3 items-center">
                  <li className="bg-border-100  rounded-[4px] p-2">
                    <Link href="/" className="">
                      <Image
                        src="/images/icons/instagram.png"
                        width="18"
                        height="18"
                        alt="socials icons image"
                      />
                    </Link>
                  </li>
                  <li className="bg-border-100  rounded-[4px] p-2">
                    <Link href="/" className="">
                      <Image
                        src="/images/icons/twitter.png"
                        width="18"
                        height="18"
                        alt="socials icons image"
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-bg-opacity">
        <div className="custom-container">
          <div className="foot-centent sm:flex-row flex-col flex items-center justify-between py-2">
            <div className="foot-left-content">
              <p className="foot-copyright-text body-regular font-seconday max-sm:text-center max-sm:text-[14px] font-normal text-primary-70">
                © 2024 Reifenhier.de – Tire price comparison. Find the cheapest
                tires for your car.
              </p>
            </div>
            <div className="foot-right-content body-regular font-seconday font-normal max-sm:text-center max-sm:text-[14px] mt-3 text-primary-70 flex items-center gap-2">
              Language:
              <ul className="language-switch">
                <li className="lang-item px-2 border border-border-100 py-1 body-regular  max-sm:text-[14px] font-seconday font-normal text-primary-70 cursor-pointer rounded-[4px]">
                  Germany
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
