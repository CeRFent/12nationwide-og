import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LenisProvider, useLenis } from './hooks/useLenis.jsx';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css';

// Pages
import Home from './pages/Home';
const Guide = lazy(() => import('./pages/Guide'));
const Success = lazy(() => import('./pages/Success'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Footer = lazy(() => import('./components/Footer'));

gsap.registerPlugin(ScrollTrigger);

function AppContent({ isLoading }) {
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();
  const { pathname } = useLocation();

  useEffect(() => {
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(100);
    } else {
      gsap.globalTimeline.timeScale(1);
    }
  }, [prefersReducedMotion]);

  // Scroll to top on route change
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

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
        <Routes>
          <Route path="/" element={<Home isLoading={isLoading} />} />
          <Route 
            path="/guide" 
            element={
              <Suspense fallback={<div className="h-screen bg-brand-bg" />}>
                <Guide />
              </Suspense>
            } 
          />
          <Route 
            path="/success" 
            element={
              <Suspense fallback={<div className="h-screen bg-brand-bg" />}>
                <Success />
              </Suspense>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <Suspense fallback={<div className="h-screen bg-brand-bg" />}>
                <Checkout />
              </Suspense>
            } 
          />
        </Routes>
        <Suspense fallback={null}>
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
