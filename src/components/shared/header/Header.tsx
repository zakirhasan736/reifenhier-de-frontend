'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetWishlistCountQuery } from '@/store/api/wishlistApi';
import { FaRegSnowflake } from 'react-icons/fa';
import { IoMdSunny } from 'react-icons/io';
import GlobalSearch from '@/components/elements/search/globalSearch';

const Header = () => {
  const { data = { count: 0 }, isLoading } = useGetWishlistCountQuery();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams?.get('kategorie');

  const isActive = (cat: string) =>
    pathname === '/produkte' && activeCategory === cat;

  const categories = [
    {
      name: 'Sommerreifen',
      href: '/produkte?kategorie=Sommerreifen',
      icon: <IoMdSunny className="!fill-[#e9d435] text-lg" />,
    },
    {
      name: 'Winterreifen',
      href: '/produkte?kategorie=Winterreifen',
      icon: <FaRegSnowflake className="!fill-[#88cdff] text-lg" />,
    },
    {
      name: 'Ganzjahresreifen',
      href: '/produkte?kategorie=Ganzjahresreifen',
      icon: (
        <Image
          src={'/images/icons/icon-reifen-com-ico-season-allyear-color.svg'}
          alt="all seassion icons"
          width={18}
          height={18}
        />
      ),
    },
  ];
  return (
    <header className="header-section relative bg-mono-0 z-[999] ">
      <div className="header-content-area border-b border-border-100 pt-4 pb-5  max-sm:pb-2 max-sm:pt-3">
        <div className="custom-container flex items-center justify-between max-sm:items-center">
          <div className="logo-section max-sm:justify-center items-center gap-8 flex max-w-full max-sm:pt-1">
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
            <nav className="nav-section hidden lg:block px-[6px] border !border-secondary-100/20 rounded-full">
              <ul className="flex items-center gap-0">
                {categories.map(({ name, href, icon }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className={`flex items-center  font-notmal gap-2 text-[14px] capitalize leading-[1] font-primary cursor-pointer px-[18px] py-3 transition duration-300
                ${
                  isActive(name)
                    ? 'text-primary-100 font-notmal'
                    : 'text-[#404042] hover:text-primary-100 hover:font-medium'
                }`}
                    >
                      {icon}
                      <span
                        className={`transition duration-300  font-normal
                ${
                  isActive(name)
                    ? 'text-primary-100 font-medium'
                    : 'text-[#404042] hover:text-primary-100 hover:font-normal'
                }`}
                      >
                        {name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="global-search lg:w-full max-w-[380px] flex items-center gap-4">
            <GlobalSearch />
            <div className="header-action-comp">
              <ul className="flex items-center gap-4">
                <li className="!border relative rounded-full !border-secondary-100/40 h-12 w-12 max-md:w-10 max-md:h-10 flex items-center justify-center">
                  <Link
                    href="/favoriten"
                    className="flex p-3 max-sm:p-2 items-center"
                  >
                    <Image
                      src="/images/icons/heart.svg"
                      alt="Favoriten"
                      width={24}
                      height={24}
                      className="w-6 h-auto max-md:w-5 "
                    />
                    {!isLoading && data?.count > 0 && (
                      <span className="count-number absolute flex items-center justify-center -top-1 -right-1 text-[10px] max-md:text-2 max-md:w-4 max-md:h-4 w-[20px] h-[20px] rounded-full text-white bg-[#FF3333]">
                        {data?.count ?? 0}
                      </span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
