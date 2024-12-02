import Layout from "@/components/Common/Layout";
import HeroBanner from "@/components/LandingPage/HeroBanner";
import JoinUs from "@/components/LandingPage/JoinUs";
import SpysharkMobile from "@/components/LandingPage/SpysharkMobile";
import WhySection from "@/components/LandingPage/WhySection";



const Home: React.FC = () => {
  return (
    <Layout>
      <HeroBanner/>
      <WhySection/>
      <SpysharkMobile/>
      <JoinUs/>
    </Layout>
  );
};

export default Home;
