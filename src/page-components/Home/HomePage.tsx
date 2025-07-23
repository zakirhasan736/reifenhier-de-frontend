import AboutUs from '@/components/homepage/AboutUs'
import BannerSection from '@/components/homepage/Banner'
import BrandCategory from '@/components/homepage/BrandCategory'
import FaqSection from '@/components/homepage/Faq'
import FeaturedProducts from '@/components/homepage/FeaturedProducts'
import HowItWorks from '@/components/homepage/HowItWorks'
import LatestProducts from '@/components/homepage/LatestProducts'
import NewArticles from '@/components/homepage/NewArticles'
// import ProductCategory from '@/components/homepage/ProductCategory'
import React from 'react'

const HomePageMain = () => {
  return (
    <div className="home-page-main-wrapper">
      <BannerSection />
      <LatestProducts />
      <FeaturedProducts />
      {/* <ProductCategory /> */}
      <BrandCategory />
      <AboutUs />
      <HowItWorks />
      <FaqSection />
      <NewArticles />
    </div>
  );
}

export default HomePageMain
