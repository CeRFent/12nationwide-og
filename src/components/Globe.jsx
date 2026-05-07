import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlobeScene from '../three/GlobeScene';

gsap.registerPlugin(ScrollTrigger);

const StatCounter = ({ endValue, label, suffix = "" }) => {
  const countRef = useRef(null);

  useEffect(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: endValue,
      duration: 2,
      scrollTrigger: {
        trigger: countRef.current,
        start: 'top 90%',
      },
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.innerText = Math.floor(obj.val).toLocaleString();
        }
      },
      ease: 'power3.out',
    });
  }, [endValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-baseline">
        <span ref={countRef} className="font-display text-7xl md:text-[80px] text-white">0</span>
        <span className="font-display text-4xl md:text-5xl text-white ml-1">{suffix}</span>
      </div>
      <span className="font-mono text-[#8A989C] text-sm uppercase tracking-[0.2em] mt-2">{label}</span>
    </div>
  );
};

export default function Globe() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.globe-content', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="globe" 
      className="relative min-h-screen bg-[#0A0A0A] py-24 px-10 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1B3A42] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] text-center mb-16 globe-content">
        <span className="font-mono text-[#6E7C80] text-sm uppercase tracking-[0.3em] block mb-4">
          OUR REACH
        </span>
        <h2 className="font-display text-5xl md:text-7xl text-[#F2F4F5] leading-none uppercase mb-8">
          Covering Every Corner of the Nation
        </h2>
      </div>

      {/* 3D Scene Container */}
      <div className="relative w-full h-[50vh] md:h-[60vh] mb-16 globe-content cursor-grab active:cursor-grabbing">
        <GlobeScene />
      </div>

      {/* Stats Section */}
      <div className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-3 gap-12 globe-content">
        <StatCounter endValue={50} label="Cities Served" suffix="+" />
        <StatCounter endValue={10000} label="Monthly Deliveries" suffix="+" />
        <StatCounter endValue={98.7} label="On-Time Rate" suffix="%" />
      </div>
    </section>
  );
}
