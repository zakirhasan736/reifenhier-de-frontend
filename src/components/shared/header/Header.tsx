"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GlobalSearch from '@/components/elements/search/globalSearch';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Header: React.FC = () => {
  const count = useSelector((state: RootState) => state.favorite.items.length);
    return (
      <header className="header-section bg-mono-0 z-50 ">
        <div className="development-mood-banner">
          <p className="text text-center text-mono-40 font-bold bg-[#3a64f6]  py-1">
            Demo Mood
          </p>
        </div>
        <div className="header-content-area border-b border-border-100 pt-4 pb-5  max-sm:pb-2 max-sm:pt-3">
          <div className="custom-container flex items-center justify-between max-sm:items-center">
            <div className="logo-section max-sm:justify-center items-center gap-8 flex max-w:w-full max-sm:pt-1">
                <Link href="/" className="text-2xl font-bold text-mono-100">
                <Image
                  loading="lazy"
                  width="131"
                  height="51"
                  className="max-sm:hidden max-sm:h-10 max-sm:w-auto"
                  src="/images/brand-logo.svg"
                  alt="reifenier brand logo"
                />
                <Image
                  loading="lazy"
                  width="110"
                  height="36"
                  className="sm:hidden"
                  src="/images/brand-logo.svg"
                  alt="reifenier brand logo mobile"
                />
                </Link>
              <nav className="nav-section hidden lg:block px-[6px] border border-border-100 rounded-full">
                <ul className="flex items-center gap-0">
                  <li> 
                    <Link
                      href={{
                        pathname: '/products',
                        query: { category: 'Sommerreifen' },
                      }}
                      className="text-[14px] capitalize leading-[1] block text-center font-primary font-normal text-[#86878A] cursor-pointer px-[18px] py-3 hover:text-primary-100"
                    >
                      Sommerreifen
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={{
                        pathname: '/products',
                        query: { category: 'Winterreifen' },
                      }}
                      className="text-[14px] capitalize leading-[1] block text-center font-primary font-normal text-[#86878A] cursor-pointer px-[18px] py-3 hover:text-primary-100"
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
                      className="text-[14px] capitalize leading-[1] block text-center font-primary font-normal text-[#86878A] cursor-pointer px-[18px] py-3 hover:text-primary-100"
                    >
                      Ganzjahresreifen
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="global-search flex items-center gap-4">
              <GlobalSearch />
              <div className="header-action-comp">
                <ul className="flex items-center gap-4">
                  <li className="!border relative rounded-full !border-[#F0F0F2] h-12 w-12 max-md:w-10 max-md:h-10 flex items-center justify-center">
                    <Link href="/" className="flex p-3 max-sm:p-2 items-center">
                      <Image
                        src="/images/icons/heart.svg"
                        alt="Favoriten"
                        width={24}
                        height={24}
                        className='w-6 h-6 max-md:w-5 max-md:h-5'
                      />
                      <span className="count-number absolute flex items-center justify-center -top-1 -right-1 text-[10px] max-md:text-2 max-md:w-4 max-md:h-4 w-[20px] h-[20px] rounded-full text-white bg-[#FF3333]">
                        {count}
                      </span>
                    </Link>
                  </li>
                  {/* <li className="border relative rounded-full border-[#F0F0F2] h-12 w-12">
                    <Link href="" className="flex p-3 items-center">
                      <Image
                        src="/images/icons/compared-light.svg"
                        alt="Vergleichen"
                        width={24}
                        height={24}
                      />
                      <span className="count-number absolute flex items-center justify-center -top-1 -right-1 text-[10px] w-[20px] h-[20px] rounded-full text-white bg-[#FF3333]">
                        0
                      </span>
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
};

export default Header;
