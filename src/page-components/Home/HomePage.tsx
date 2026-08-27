import AboutUs from '@/components/homepage/AboutUs';
import BannerSection from '@/components/homepage/Banner';
import BrandCategory from '@/components/homepage/BrandCategory';
import FaqSection from '@/components/homepage/Faq';
import FeaturedProducts from '@/components/homepage/FeaturedProducts';
import HowItWorks from '@/components/homepage/HowItWorks';
import LatestProducts from '@/components/homepage/LatestProducts';
import NewArticles from '@/components/homepage/Blogs';
import {
  getFeaturedHomeData,
  getHomeBrands,
  getLatestHomeProducts,
} from '@/libs/homeData';

const HomePageMain = async () => {
  const [featured, latestProducts, brands] = await Promise.all([
    getFeaturedHomeData(),
    getLatestHomeProducts(),
    getHomeBrands(),
  ]);

  return (
    <div className="home-page-main-wrapper">
      <BannerSection />
      <FeaturedProducts
        products={featured.products}
        title={featured.title}
        category={featured.category}
      />
      <NewArticles limit={8} />
      <LatestProducts products={latestProducts} />
      <BrandCategory brands={brands} />
      <AboutUs />
      <HowItWorks />
      <FaqSection />
    </div>
  );
};

export default HomePageMain;
