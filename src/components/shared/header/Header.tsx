import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GlobalSearch from '@/components/elements/search/globalSearch';

const Header: React.FC = () => {
    return (
      <header className="header-section bg-mono-0 pb-2 z-50 ">
        <div className="header-content-area border-b border-border-100 pb-4 max-sm:pb-2">
          <div className="custom-container flex items-end justify-between max-sm:items-center max-sm:justify-center max-sm:flex-col">
            <nav className="nav-section pb-2 max-sm:hidden">
              <ul className="flex space-x-4">
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-[10px] uppercase text-center font-primary font-medium text-mono-100 cursor-pointer px-4 py-3 hover:text-primary-100"
                  >
                    Startseite
                  </Link>
                </li>
                <li>
                  <Link
                    href="#featured-products"
                    className="text-[10px] uppercase text-center font-primary font-medium text-mono-100 cursor-pointer px-4 py-3 hover:text-primary-100"
                  >
                    Produkte
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="logo-section max-sm:justify-center max-sm:items-center max-sm:flex max-w:w-full max-sm:pt-1">
              <Link href="/" className="text-2xl font-bold text-mono-100">
                <Image
                  loading="lazy"
                  width="200"
                  height="200"
                  className="max-sm:h-14 max-sm:w-auto"
                  src="/images/reifenier_logo_new.webp"
                  alt="reifenier brand logo"
                />
              </Link>
            </div>
            <div className="global-search max-sm:hidden">
              <GlobalSearch />
            </div>
          </div>
        </div>
        <div className="header-bottom-content max-sm:hidde">
          <div className="custom-container">
            <div className="header-bottom-content flex items-center justify-between py-2">
              <ul className="header-bottom-left-content max-sm:w-full flex items-center max-sm:justify-center  space-x-4 max-sm:space-x-1">
                <li>
                  <Link
                    href={{
                      pathname: '/products',
                      query: { category: 'Sommerreifen' },
                    }}
                    className="text-[10px] max-sm:text-[8px] uppercase text-center font-primary font-medium text-mono-100 cursor-pointer px-4 py-3 max-sm:px-2 hover:text-primary-100"
                  >
                    Sommerreifen
                  </Link>
                </li>
                <li>
                  <Link
                    href={{
                      pathname: '/products',
                      query: { category: 'all sessions' },
                    }}
                    className="text-[10px] max-sm:text-[8px] uppercase text-center font-primary font-medium text-mono-100 cursor-pointer px-4 py-3 max-sm:px-2 hover:text-primary-100"
                  >
                    all sessions
                  </Link>
                </li>
                <li>
                  <Link
                    href={{
                      pathname: '/products',
                      query: { category: 'Winterreifen' },
                    }}
                    className="text-[10px] max-sm:text-[8px] uppercase text-center font-primary font-medium text-mono-100 cursor-pointer px-4 py-3 max-sm:px-2 hover:text-primary-100"
                  >
                    Winterreifen
                  </Link>
                </li>
                <li>
                  <Link
                    href={{
                      pathname: '/products',
                      query: { category: 'Ganzjahresreifen' },
                    }}
                    className="text-[10px] max-sm:text-[8px] uppercase text-center font-primary font-medium text-mono-100 cursor-pointer px-4 py-3 max-sm:px-2 hover:text-primary-100"
                  >
                    Ganzjahresreifen
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    );
};

export default Header;
