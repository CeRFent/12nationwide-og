import Hero from '../components/Hero';
import InfoBar from '../components/InfoBar';
import Services from '../components/Services';
import Difference from '../components/Difference';
import WhyUs from '../components/WhyUs';
import Testimonials from '../components/Testimonials';
import Social from '../components/Social';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

export default function Home({ isLoading }) {
  return (
    <>
      <Hero isLoading={isLoading} />
      <InfoBar />
      <Services />
      <Difference />
      <WhyUs />
      <Testimonials />
      <Social />
      <FAQ />
      <Contact />
    </>
  );
}
