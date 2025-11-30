// 'use client';
// import { usePathname, useSearchParams } from 'next/navigation';
// import React, { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useGetWishlistCountQuery } from '@/store/api/wishlistApi';
// import { FaRegSnowflake } from 'react-icons/fa';
// import { IoMdSunny } from 'react-icons/io';
// import GlobalSearch from '@/components/elements/search/globalSearch';
// import { FaBars } from 'react-icons/fa';
// import { RiCloseLargeLine } from 'react-icons/ri';
// import { FiPlus } from 'react-icons/fi';
// import { AiOutlineMinus } from 'react-icons/ai';

// const Header = () => {
//   const { data = { count: 0 }, isLoading } = useGetWishlistCountQuery();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const activeCategory = searchParams?.get('kategorie');

//   const isActive = (cat: string) =>
//     pathname === '/produkte' && activeCategory === cat;

//   const categories = [
//     {
//       name: 'Sommerreifen',
//       href: '/produkte?kategorie=Sommerreifen',
//       icon: <IoMdSunny className="!fill-[#e9d435] text-lg" />,
//     },
//     {
//       name: 'Winterreifen',
//       href: '/produkte?kategorie=Winterreifen',
//       icon: <FaRegSnowflake className="!fill-[#88cdff] text-lg" />,
//     },
//     {
//       name: 'Ganzjahresreifen',
//       href: '/produkte?kategorie=Ganzjahresreifen',
//       icon: (
//         <Image
//           src={'/images/icons/icon-reifen-com-ico-season-allyear-color.svg'}
//           alt="all season icons"
//           width={18}
//           height={18}
//         />
//       ),
//     },
//   ];

//   // BLOG PARENT → SUBCATEGORIES
//   const blogCategories: Record<string, string[]> = {
//     Test: [
//       'Reifentests',
//       'Sommerreifen Test',
//       'Winterreifen Test',
//       'Ganzjahresreifen Test',
//       'Premium Reifen Check',
//       'Budget Reifen Analyse',
//       'Elektroauto Reifen Test',
//       'All Terrain Test',
//       'Bremsweg Vergleich',
//       'Reifentests',
//       'Sommerreifen Test',
//       'Winterreifen Test',
//       'Ganzjahresreifen Test',
//       'Premium Reifen Check',
//       'Budget Reifen Analyse',
//       'Elektroauto Reifen Test',
//       'All Terrain Test',
//       'Bremsweg Vergleich',
//     ],
//     News: [
//       'Branchen News',
//       'Hersteller Updates',
//       'Produktneuheiten',
//       'Markt Trends',
//       'Innovationen',
//       'Unternehmensmeldungen',
//       'Presseberichte',
//       'Branchen News',
//       'Hersteller Updates',
//       'Produktneuheiten',
//       'Markt Trends',
//       'Innovationen',
//       'Unternehmensmeldungen',
//       'Presseberichte',
//       'Branchen News',
//       'Hersteller Updates',
//       'Produktneuheiten',
//       'Markt Trends',
   
//     ],
//     Ratgeber: [
//       'Reifenwissen',
//       'Wechsel & Pflege',
//       'Tipps & Sicherheit',
//       'Montage Guide',
//       'Profiltiefe',
//       'Felgenwissen',
//       'Kraftstoffeffizienz',
//       'Häufige Fehler',
//       'Reifenwissen',
//       'Wechsel & Pflege',
//       'Tipps & Sicherheit',
//       'Montage Guide',
//       'Profiltiefe',
//       'Felgenwissen',
//       'Kraftstoffeffizienz',
//       'Häufige Fehler',
//       'Reifenwissen',
//       'Wechsel & Pflege',
//       'Tipps & Sicherheit',

//     ],
//   };

//   const COLUMN_SIZE = 7;

//   // ⭐ FIX: Separate states for mobile drawer + accordion
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [openAccordion, setOpenAccordion] = useState<string | null>(null);

//   // Desktop mega menu state
//   const [openMegaDesktop, setOpenMegaDesktop] = useState<string | null>(null);

//   return (
//     <header className="header-section relative bg-mono-0 z-[999]">
//       {/* TOP HEADER */}
//       <div className="header-content-area border-b border-border-100 pt-4 pb-5 max-sm:pb-2 max-sm:pt-3">
//         <div className="custom-container flex items-center justify-between">
//           {/* LOGO + PRODUCT CATEGORY NAV */}
//           <div className="logo-section flex items-center gap-8 max-sm:justify-center max-sm:pt-1">
//             <Link href="/" className="text-2xl font-bold text-mono-100">
//               <Image
//                 loading="lazy"
//                 width="131"
//                 height="51"
//                 className="max-sm:hidden"
//                 src="/images/brand-logo.svg"
//                 alt="reifenier brand logo"
//               />
//               <Image
//                 loading="lazy"
//                 width="110"
//                 height="36"
//                 className="sm:hidden"
//                 src="/images/brand-logo.svg"
//                 alt="reifenier brand logo mobile"
//               />
//             </Link>

//             {/* PRODUCT CATEGORIES (DESKTOP) */}
//             <nav className="nav-section hidden lg:block px-[6px] border !border-secondary-100/20 rounded-full">
//               <ul className="flex items-center gap-0">
//                 {categories.map(({ name, href, icon }) => (
//                   <li key={name}>
//                     <Link
//                       href={href}
//                       className={`flex items-center gap-2 text-[14px] capitalize px-[18px] py-3 transition
//                       ${
//                         isActive(name)
//                           ? 'text-primary-100 font-medium'
//                           : 'text-[#404042] hover:text-primary-100'
//                       }`}
//                     >
//                       {icon}
//                       <span>{name}</span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </nav>
//           </div>

//           {/* SEARCH + USER ACTIONS */}
//           <div className="global-search lg:w-full max-w-[380px] flex items-center gap-4">
//             <GlobalSearch />

//             <div className="header-action-comp">
//               <ul className="flex items-center gap-4">
//                 {/* FAVORITES */}
//                 <li className="border relative rounded-full border-secondary-100/40 h-10 w-10 flex items-center justify-center">
//                   <Link href="/favoriten" className="flex p-[6px]">
//                     <Image
//                       src="/images/icons/heart.svg"
//                       alt="Favoriten"
//                       width={24}
//                       height={24}
//                       className="w-6 h-auto"
//                     />
//                     {!isLoading && data?.count > 0 && (
//                       <span className="count-number absolute -top-1 -right-1 text-[10px] w-[18px] h-[18px] rounded-full text-white bg-[#FF3333] flex items-center justify-center">
//                         {data?.count ?? 0}
//                       </span>
//                     )}
//                   </Link>
//                 </li>

//                 {/* MOBILE NAV TRIGGER */}
//                 <li className="lg:hidden">
//                   <button
//                     onClick={() => setMobileOpen(true)}
//                     className="flex items-center justify-center h-10 w-10 border border-secondary-100/40 rounded-full"
//                   >
//                     <FaBars size={18} color="#404042" />
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ⭐ BLOG BOTTOM NAV (DESKTOP) ⭐ */}
//       <div className="header-bottom-nav border-b border-border-100 relative hidden lg:block">
//         <div className="custom-container">
//           <ul className="flex items-center gap-8">
//             {Object.keys(blogCategories).map(parent => (
//               <li
//                 key={parent}
//                 className="text-[14px] uppercase tracking-[2px] font-medium cursor-pointer hover:text-primary-100 py-4"
//                 onMouseEnter={() => setOpenMegaDesktop(parent)}
//                 onMouseLeave={() => setOpenMegaDesktop(null)}
//               >
//                 {parent}

//                 {/* DESKTOP MEGA MENU */}
//                 {openMegaDesktop === parent && (
//                   <div
//                     className="absolute left-0 w-full bg-white shadow-xl border-t border-border-100 top-[46px] py-6 z-[9999]"
//                     onMouseEnter={() => setOpenMegaDesktop(parent)}
//                     onMouseLeave={() => setOpenMegaDesktop(null)}
//                   >
//                     <div className="custom-container grid grid-cols-3 gap-8">
//                       {Array.from({ length: 3 }).map((_, colIndex) => {
//                         const start = colIndex * COLUMN_SIZE;
//                         const end = start + COLUMN_SIZE;
//                         const items = blogCategories[parent].slice(start, end);

//                         return (
//                           <div key={colIndex}>
//                             <h4 className="font-semibold text-[12px] mb-2 text-[#404042]">
//                               {parent} – Bereich {colIndex + 1}
//                             </h4>
//                             <ul className="flex flex-col">
//                               {items.map(item => (
//                                 <li
//                                   key={item}
//                                   className="border-b border-gray-200 py-2"
//                                 >
//                                   <Link
//                                     href={`/blog/${parent.toLowerCase()}/${item
//                                       .toLowerCase()
//                                       .replace(/\s+/g, '-')}`}
//                                     className="text-[12px] capitalize tracking-normal text-[#404042] font-normal hover:text-primary-100"
//                                   >
//                                     {item}
//                                   </Link>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* ⭐ MOBILE SLIDE-IN BLOG MENU ⭐ */}
//       {mobileOpen && (
//         <div className="fixed inset-0 z-[9999] lg:hidden">
//           {/* Overlay */}
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={() => setMobileOpen(false)}
//           ></div>

//           {/* Slide Panel */}
//           <div className="absolute right-0 top-0 h-full w-[90%] max-w-[360px] bg-white shadow-xl p-6 overflow-y-auto animate-slideLeft">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-semibold">Blog Kategorien</h3>
//               <button
//                 onClick={() => setMobileOpen(false)}
//                 className="text-gray-700 text-2xl"
//               >
//                 <RiCloseLargeLine size={18} />
//               </button>
//             </div>

//             {/* Accordion */}
//             {Object.keys(blogCategories).map(parent => (
//               <div
//                 key={parent}
//                 className="mb-4 border-b  border-b-[#404042] pb-4"
//               >
//                 <button
//                   className="flex justify-between items-center w-full font-medium text-[16px] text-left"
//                   onClick={() =>
//                     setOpenAccordion(prev => (prev === parent ? null : parent))
//                   }
//                 >
//                   {parent}
//                   <span className="text-[#404042] text-[20px]">
//                     {openAccordion === parent ? (
//                       <AiOutlineMinus size={20} />
//                     ) : (
//                       <FiPlus size={20} />
//                     )}
//                   </span>
//                 </button>

//                 {/* Subcategory columns */}
//                 {openAccordion === parent && (
//                   <div className="mt-2 grid grid-cols-1 gap-4">
//                     {Array.from({ length: 1 }).map((_, colIndex) => {
//                       // const start = colIndex * MOBO_COLUMN_SIZE;
//                       // const end = start + MOBO_COLUMN_SIZE;
//                       // const items = blogCategories[parent].slice(start, end);

//                       return (
//                         <ul key={colIndex} className="flex flex-col">
//                           {blogCategories[parent].map(item => (
//                             <li
//                               key={item}
//                               className="border-b border-b-[#404042] py-2 text-[14px] last:border-none"
//                             >
//                               <Link
//                                 href={`/blog/${parent.toLowerCase()}/${item
//                                   .toLowerCase()
//                                   .replace(/\s+/g, '-')}`}
//                                 onClick={() => setMobileOpen(false)} // CLOSE MENU ONLY HERE
//                                 className="text-[#404042] hover:text-primary-100"
//                               >
//                                 {item}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useGetWishlistCountQuery } from '@/store/api/wishlistApi';
import { FaRegSnowflake } from 'react-icons/fa';
import { IoMdSunny } from 'react-icons/io';
import { FaBars } from 'react-icons/fa';
import { RiCloseLargeLine } from 'react-icons/ri';
import { FiPlus } from 'react-icons/fi';
import { AiOutlineMinus } from 'react-icons/ai';
import GlobalSearch from '@/components/elements/search/globalSearch';

const WP_API = 'https://wp.reifencheck.de/wp-json/wp/v2';

/* ------------------------------------------
   TYPES
-------------------------------------------*/

// WordPress API category type
interface WPCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
}

// Local blog category structure
interface BlogCategoryItem {
  id: number;
  name: string;
  slug: string;
}

interface BlogCategoryGroup {
  name: string;
  slug: string;
  sub: BlogCategoryItem[];
}

type BlogCategoryStructure = Record<string, BlogCategoryGroup>;

/* ------------------------------------------
   HEADER COMPONENT
-------------------------------------------*/

export default function Header() {
  const { data = { count: 0 }, isLoading } = useGetWishlistCountQuery();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams?.get('kategorie');

  const isActive = (cat: string) =>
    pathname === '/produkte' && activeCategory === cat;

  /* PRODUCT CATEGORIES */
  const shopCategories = [
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
          width={18}
          height={18}
          alt="all-season"
        />
      ),
    },
  ];

  /* ------------------------------------------
     LOAD WP BLOG CATEGORIES
  -------------------------------------------*/

  const [blogCategories, setBlogCategories] = useState<BlogCategoryStructure>(
    {}
  );
  const [catLoading, setCatLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const parents = await axios.get<WPCategory[]>(
          `${WP_API}/categories?parent=0&per_page=50&orderby=name&order=asc`
        );

        const structure: BlogCategoryStructure = {};

        for (const parent of parents.data) {
          const subs = await axios.get<WPCategory[]>(
            `${WP_API}/categories?parent=${parent.id}&per_page=100`
          );

          structure[parent.slug] = {
            name: parent.name,
            slug: parent.slug,
            sub: subs.data.map(s => ({
              id: s.id,
              name: s.name,
              slug: s.slug,
            })),
          };
        }

        setBlogCategories(structure);
      } catch (err) {
        console.error('WordPress category fetch failed:', err);
      }

      setCatLoading(false);
    }

    loadCategories();
  }, []);

  const COLUMN_SIZE = 7;

  /* ------------------------------------------
     STATE (Mobile + Desktop)
  -------------------------------------------*/

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [openMegaDesktop, setOpenMegaDesktop] = useState<string | null>(null);

  /* ------------------------------------------
     RENDER
  -------------------------------------------*/

  return (
    <header className="bg-white relative z-[999]">
      {/* ============================
          TOP HEADER
      ============================= */}
      <div className="border-b border-gray-200 pt-4 pb-5">
        <div className="custom-container flex items-center justify-between">
          {/* LOGO + PRODUCT CATEGORY NAV */}
          <div className="logo-section flex items-center gap-8 max-sm:justify-center max-sm:pt-1">
            <Link href="/" className="text-2xl font-bold text-mono-100">
              <Image
                loading="lazy"
                width="131"
                height="51"
                className="max-sm:hidden"
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

            {/* PRODUCT CATEGORIES (DESKTOP) */}
            <nav className="nav-section hidden lg:block px-[6px] border !border-secondary-100/20 rounded-full">
              <ul className="flex items-center gap-0">
                {shopCategories.map(({ name, href, icon }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className={`flex items-center gap-2 text-[14px] capitalize px-[18px] py-3 transition
                      ${
                        isActive(name)
                          ? 'text-primary-100 font-medium'
                          : 'text-[#404042] hover:text-primary-100'
                      }`}
                    >
                      {icon}
                      <span>{name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* RIGHT SIDE — SEARCH + FAVORITES + MOBILE MENU */}
          <div className="global-search lg:w-full max-w-[420px] flex items-center gap-4">
            <div className="hidden lg:block w-full">
              <GlobalSearch />
            </div>

            <div className="header-action-comp">
              <ul className="flex items-center gap-4">
                {/* FAVORITES */}
                <li className="border relative rounded-full border-secondary-100/40 h-10 w-10 flex items-center justify-center">
                  <Link href="/favoriten" className="flex p-[6px]">
                    <Image
                      src="/images/icons/heart.svg"
                      alt="Favoriten"
                      width={24}
                      height={24}
                      className="w-6 h-auto"
                    />
                    {!isLoading && data?.count > 0 && (
                      <span className="count-number absolute -top-1 -right-1 text-[10px] w-[18px] h-[18px] rounded-full text-white bg-[#FF3333] flex items-center justify-center">
                        {data?.count ?? 0}
                      </span>
                    )}
                  </Link>
                </li>

                {/* MOBILE NAV TRIGGER */}
                <li className="lg:hidden">
                  <button
                    onClick={() => setMobileOpen(true)}
                    className="flex items-center justify-center h-10 w-10 border border-secondary-100/40 rounded-full"
                  >
                    <FaBars size={18} color="#404042" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ============================
          DESKTOP BLOG MEGA MENU
      ============================= */}
      <div className="hidden bg-primary-100 lg:block border-b border-primary-100 relative">
        <div className="custom-container">
          {catLoading ? (
            <p className="py-4 text-sm text-gray-400">
              Kategorien werden geladen…
            </p>
          ) : (
            <ul className="flex gap-8">
              {Object.keys(blogCategories).map(parentSlug => {
                const parent = blogCategories[parentSlug];

                return (
                  <li
                    key={parentSlug}
                    onMouseEnter={() => setOpenMegaDesktop(parentSlug)}
                    onMouseLeave={() => setOpenMegaDesktop(null)}
                    className="uppercase tracking-[2px] text-[14px] py-4 text-white cursor-pointer hover:text-secondary-100"
                  >
                    {parent.name}

                    {/* MEGA MENU */}
                    {openMegaDesktop === parentSlug && (
                      <div className="absolute left-0 top-[48px] w-full bg-white shadow-xl border-t border-gray-200 py-6 z-[9999]">
                        <div className="custom-container grid grid-cols-3 gap-8">
                          {Array.from({ length: 3 }).map((_, colIndex) => {
                            const start = colIndex * COLUMN_SIZE;
                            const items = parent.sub.slice(
                              start,
                              start + COLUMN_SIZE
                            );

                            return (
                              <div key={colIndex}>
                                <h4 className="font-semibold text-[12px] mb-2 text-gray-700">
                                  {parent.name}
                                </h4>

                                <ul>
                                  {items.map(item => (
                                    <li
                                      key={item.slug}
                                      className="border-b border-gray-200 py-2"
                                    >
                                      <Link
                                        href={`/artikel?kategorie=${parent.slug}&subkategorie=${item.slug}`}
                                        className="text-[12px] text-gray-600 hover:text-primary-100"
                                      >
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ============================
          MOBILE MENU PANEL
      ============================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99999] lg:hidden">
          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          {/* RIGHT PANEL */}
          <div className="absolute right-0 top-0 w-[90%] max-w-[360px] h-full bg-white shadow-xl p-6 overflow-y-auto animate-slideLeft">
            {/* PANEL HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Menü</h3>
              <button onClick={() => setMobileOpen(false)}>
                <RiCloseLargeLine size={20} />
              </button>
            </div>

            {/* SEARCH */}
            <div className="mb-6 block lg:hidden">
              <GlobalSearch />
            </div>

            {/* PRODUCT CATEGORIES */}
            <div className="mb-6">
              <h4 className="text-[16px] font-semibold mb-3">
                Produkte Kategorien
              </h4>

              <ul className="flex flex-col gap-2">
                {shopCategories.map(cat => (
                  <li key={cat.name} className="border-b border-gray-300 py-2">
                    <Link
                      href={cat.href}
                      className="flex items-center gap-2 text-gray-700 text-[15px]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {cat.icon}
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* BLOG CATEGORIES ACCORDION */}
            <div>
              <h4 className="text-[16px] font-semibold mb-3">
                Blog Kategorien
              </h4>

              {Object.keys(blogCategories).map(parentSlug => {
                const parent = blogCategories[parentSlug];

                return (
                  <div
                    key={parentSlug}
                    className="mb-4 border-b border-gray-400 pb-4"
                  >
                    <button
                      className="flex justify-between items-center w-full text-[16px] font-medium"
                      onClick={() =>
                        setOpenAccordion(prev =>
                          prev === parentSlug ? null : parentSlug
                        )
                      }
                    >
                      {parent.name}

                      {openAccordion === parentSlug ? (
                        <AiOutlineMinus size={20} />
                      ) : (
                        <FiPlus size={20} />
                      )}
                    </button>

                    {openAccordion === parentSlug && (
                      <ul className="mt-3">
                        {parent.sub.map(item => (
                          <li
                            key={item.slug}
                            className="py-2 border-b border-gray-300"
                          >
                            <Link
                              href={`/artikel?kategorie=${parent.slug}&subkategorie=${item.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="text-gray-700 text-[14px]"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
