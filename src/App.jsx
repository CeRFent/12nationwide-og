import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LenisProvider, useLenis } from './hooks/useLenis.jsx';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css';

// Lazy loaded sections
const Hero = lazy(() => import('./components/Hero'));
const InfoBar = lazy(() => import('./components/InfoBar'));
const Services = lazy(() => import('./components/Services'));
const Difference = lazy(() => import('./components/Difference'));
const WhyUs = lazy(() => import('./components/WhyUs'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Social = lazy(() => import('./components/Social'));
const FAQ = lazy(() => import('./components/FAQ'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

gsap.registerPlugin(ScrollTrigger);

const SectionLoader = () => (
  <div className="w-full h-screen bg-brand-bg flex items-center justify-center">
    <div className="spinner" />
  </div>
);

function AppContent({ isLoading }) {
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(100);
    } else {
      gsap.globalTimeline.timeScale(1);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!lenis || isLoading) return;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerUpdate = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerUpdate);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [lenis, isLoading]);

  return (
    <main className="relative bg-brand-bg">
      <Navbar />
      <ErrorBoundary>
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
          <Footer />
        </Suspense>
      </ErrorBoundary>
      <BackToTop />
    </main>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('12nw_loaded');
    }
    return true;
  });

  const handleComplete = useCallback(() => {
    sessionStorage.setItem('12nw_loaded', 'true');
    setIsLoading(false);
  }, []);

  return (
    <LenisProvider options={{ lerp: 0.08, smoothWheel: true }}>
      <ErrorBoundary>
        {isLoading && <Preloader onComplete={handleComplete} />}
        <AppContent isLoading={isLoading} />
      </ErrorBoundary>
    </LenisProvider>
  );
}

export default App;
