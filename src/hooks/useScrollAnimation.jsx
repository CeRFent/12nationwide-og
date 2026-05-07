import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP ScrollTrigger animations
 * @param {Object} config - GSAP animation configuration
 * @returns {import('react').RefObject}
 */
export const useScrollAnimation = (config = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          ...config.scrollTrigger,
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        ...config,
      });
    }, el);

    return () => ctx.revert();
  }, [config]);

  return elementRef;
};
