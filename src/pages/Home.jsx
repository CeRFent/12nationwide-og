import { lazy, Suspense } from 'react';
import { useLenis } from '../hooks/useLenis.jsx';
import InfoBar from '../components/InfoBar';

const Hero = lazy(() => import('../components/Hero'));
const Services = lazy(() => import('../components/Services'));
const Difference = lazy(() => import('../components/Difference'));
const WhyUs = lazy(() => import('../components/WhyUs'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Social = lazy(() => import('../components/Social'));
const FAQ = lazy(() => import('../components/FAQ'));
const Contact = lazy(() => import('../components/Contact'));

const SectionLoader = () => (
  <div className="w-full h-screen bg-brand-bg flex items-center justify-center">
    <div className="spinner" />
  </div>
);

export default function Home({ isLoading }) {
  return (
    <Suspense fallback={<SectionLoader />}>
      <Hero isLoading={isLoading} />
      <InfoBar />
      <Services />
      <Difference />
      <WhyUs />
      <Testimonials />
      <Social />
      <FAQ />
      <Contact />
    </Suspense>
  );
}
