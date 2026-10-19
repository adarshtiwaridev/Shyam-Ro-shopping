import HeroSection from "../components/HeroSection";
import SEO from "../components/SEO";
import siteConfig from "../config/site";

export default function Home() {
  return (
    <>
      <SEO
        title={`${siteConfig.brandName} - ${siteConfig.tagline}`}
        description={siteConfig.description}
        canonical="/"
      />
      <div>
        <HeroSection />
      </div>
    </>
  );
}
