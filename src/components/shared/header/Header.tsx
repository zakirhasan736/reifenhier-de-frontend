
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GlobalSearch from '@/components/elements/search/globalSearch';
import { useGetWishlistCountQuery } from '@/store/api/wishlistApi';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  activeCategory?: string | null;
}

const Header: React.FC<HeaderProps> = ({ activeCategory }) => {
  const { data = { count: 0 }, isLoading } = useGetWishlistCountQuery();
  const pathname = usePathname();

  const isActive = (cat: string) =>
    pathname === '/produkte' && activeCategory === cat;
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
                {/* <li>
                  <Link
                    href="/produkte?kategorie=Sommerreifen"
                    className="text-[14px] capitalize leading-[1] block transition ease-in duration-500 text-center font-primary font-normal text-[#404042] hover:font-medium cursor-pointer px-[18px] py-3 hover:text-primary-100 "
                  >
                    Sommerreifen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/produkte?kategorie=Winterreifen"
                    className="text-[14px] capitalize leading-[1] block transition ease-in duration-500 text-center font-primary font-normal text-[#404042] hover:font-medium cursor-pointer px-[18px] py-3 hover:text-primary-100 "
                  >
                    Winterreifen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/produkte?kategorie=Ganzjahresreifen"
                    className="text-[14px] capitalize leading-[1] block transition ease-in duration-500 text-center font-primary font-normal text-[#404042] hover:font-medium cursor-pointer px-[18px] py-3 hover:text-primary-100 "
                  >
                    Ganzjahresreifen
                  </Link>
                </li> */}
                {[
                  {
                    name: 'Sommerreifen',
                    href: '/produkte?kategorie=Sommerreifen',
                  },
                  {
                    name: 'Winterreifen',
                    href: '/produkte?kategorie=Winterreifen',
                  },
                  {
                    name: 'Ganzjahresreifen',
                    href: '/produkte?kategorie=Ganzjahresreifen',
                  },
                ].map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className={`text-[14px] capitalize leading-[1] block text-center font-primary cursor-pointer px-[18px] py-3 transition duration-300
                        ${
                          isActive(name)
                            ? 'text-primary-100 font-semibold'
                            : 'text-[#404042] hover:text-primary-100 hover:font-medium'
                        }`}
                    >
                      {name}
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
                    href="/favorites"
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
