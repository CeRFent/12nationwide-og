import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Preloader({ onComplete }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const brandRef = useRef(null);
  const subRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Slide up the entire overlay
        gsap.to(overlayRef.current, {
          y: '-100%',
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            onComplete();
          }
        });
      }
    });

    // 1. Logo Scale & Fade
    tl.fromTo(logoRef.current, 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
    );

    // 2. "NATIONWIDE" Fade
    tl.fromTo(brandRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.3"
    );

    // 3. "COURIER SERVICES LLC" Fade
    tl.fromTo(subRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.2"
    );

    // 4. Progress Bar Fill
    tl.to(barRef.current, {
      width: '100%',
      duration: 2.2,
      ease: 'power1.inOut'
    }, "-=0.4");

    // Brief pause before exiting
    tl.to({}, { duration: 0.2 });

  }, [onComplete]);

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-brand-bg z-[9999] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="text-center">
        <div 
          ref={logoRef}
          className="font-display text-[120px] leading-none text-brand-white uppercase mb-2 font-black"
        >
          12
        </div>
        <div 
          ref={brandRef}
          className="font-display text-[14px] text-brand-cyan uppercase tracking-[0.5em] mb-1 font-bold"
        >
          NATIONWIDE
        </div>
        <div 
          ref={subRef}
          className="font-display text-[11px] text-white/40 uppercase tracking-[0.4em]"
        >
          COURIER · LOGISTICS · CARGO
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
        <div 
          ref={barRef}
          className="h-full bg-brand-accent w-0 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
        />
      </div>
    </div>
  );
}
