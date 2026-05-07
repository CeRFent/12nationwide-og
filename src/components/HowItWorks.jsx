import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    num: "01",
    title: "Book Online",
    desc: "Enter your details and get an instant quote. Secure payment and immediate confirmation.",
    icon: (
      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    num: "02",
    title: "We Pick Up",
    desc: "Our professional courier arrives at your doorstep. We handle everything with care.",
    icon: (
      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4m8 4v10" />
      </svg>
    )
  },
  {
    num: "03",
    title: "Track Live",
    desc: "Watch your delivery in real-time. GPS updates and precise arrival estimates.",
    icon: (
      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    num: "04",
    title: "Delivered",
    desc: "Safe arrival at destination. Instant proof of delivery sent directly to you.",
    icon: (
      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const horizontalSections = gsap.utils.toArray('.how-panel');
      const totalWidth = containerRef.current.scrollWidth;
      const amountToScroll = totalWidth - window.innerWidth;

      // Horizontal Scroll Animation
      gsap.to(containerRef.current, {
        x: () => -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.2,
          start: "top top",
          end: () => `+=${amountToScroll}`,
          invalidateOnRefresh: true,
        }
      });

      // Connecting Line SVG
      const line = lineRef.current;
      if (line) {
        const lineLength = line.getTotalLength();
        gsap.set(line, { strokeDasharray: lineLength, strokeDashoffset: lineLength });

        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${amountToScroll}`,
            scrub: 1.2,
          }
        });
      }

      // Dots Scaling Animation using a master timeline linked to scroll
      const dots = gsap.utils.toArray('.step-dot');
      if (dots.length > 0) {
        const dotsTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${amountToScroll}`,
            scrub: 1.2,
          }
        });

        dots.forEach((dot, i) => {
          dotsTl.to(dot, { 
            scale: 1, 
            duration: 0.1, 
            ease: "back.out(2)" 
          }, i / (panels.length - 1));
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0F2A33]">
      {/* Header */}
      <div className="pt-24 px-10 max-w-[1280px] mx-auto z-20 relative">
        <span className="font-mono text-[#6E7C80] text-sm uppercase tracking-[0.3em] block mb-4">
          HOW IT WORKS
        </span>
        <h2 className="font-display text-5xl md:text-6xl text-[#F2F4F5] leading-none uppercase">
          Simple. Fast. Reliable.
        </h2>
      </div>

      {/* Horizontal Container */}
      <div 
        ref={containerRef} 
        className="flex h-screen items-center w-fit relative px-[15vw]"
      >
        {/* Connecting Line SVG */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none px-[15vw]">
          <svg className="w-full h-2 overflow-visible" fill="none">
            <path 
              ref={lineRef}
              d="M 0,1 L 10000,1" 
              stroke="#C4C9CC" 
              strokeWidth="1" 
              className="opacity-30"
            />
            {panels.map((_, i) => (
              <circle 
                key={i}
                cx="0" 
                cy="1" 
                r="6" 
                fill="#FFFFFF" 
                className="step-dot"
                style={{ 
                  transform: `translateX(${i * 70}vw)`,
                  transformOrigin: 'center' 
                }}
              />
            ))}
          </svg>
        </div>

        {panels.map((panel, i) => (
          <div 
            key={i} 
            className="how-panel w-[70vw] flex-shrink-0 flex flex-col justify-center px-12 relative"
          >
            {/* Giant Number BG */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[300px] text-[#1B3A42] opacity-20 pointer-events-none select-none z-0">
              {panel.num}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-start max-w-md">
              <div className="mb-8 p-4 bg-[#1B3A42] rounded-2xl">
                {panel.icon}
              </div>
              <h3 className="font-display text-4xl text-[#F2F4F5] mb-4 uppercase tracking-wider">
                {panel.title}
              </h3>
              <p className="font-body text-[#8A989C] text-lg leading-relaxed">
                {panel.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
