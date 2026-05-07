import { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext(null);

export const LenisProvider = ({ children, options = {} }) => {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const instance = new Lenis({
      ...options,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    const raf = (time) => {
      instance.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    setLenis(instance);

    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, [options]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
};

export const useLenis = () => {
  const context = useContext(LenisContext);
  return context;
};
