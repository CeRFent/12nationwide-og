import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ isLoading }) {
  return (
    <section id="hero" className="relative h-screen min-h-[640px] flex items-center justify-center text-center overflow-hidden bg-brand-bg">
      {/* BACKGROUND VIDEO */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="none"
        poster="/hero-poster.png"
        onCanPlay={(e) => e.target.play()}
        className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
      >
        <source src="/Hero-Video.mp4" type="video/mp4" />
      </video>

      {/* GRADIENT OVERLAY */}
      <div 
        className="absolute inset-0 bg-linear-to-b from-brand-bg/80 via-brand-bg/40 to-brand-bg/90 z-[1]"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={isLoading ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 px-5 flex flex-col items-center"
      >
        {/* OVERLAY HERO LOGO */}
        <motion.img 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isLoading ? {} : { scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
          src="/overlay-hero-logo.png" 
          alt="12 Nationwide" 
          className="max-w-[320px] md:max-w-[600px] w-full h-auto mb-6 drop-shadow-[0_0_40px_rgba(255,215,0,0.2)]"
        />

        {/* SUBTITLE */}
        <p className="font-display font-semibold text-[17px] md:text-[20px] tracking-[4px] md:tracking-[8px] uppercase text-white/70 mb-8 md:mb-12">
          Courier · On-Demand Delivery · Based in Orlando, FL
        </p>

        {/* CTA */}
        <motion.a 
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,215,0,0.7)' }}
          whileTap={{ scale: 0.95 }}
          href="#contact" 
          className="inline-block font-display font-bold text-sm tracking-[2px] uppercase text-brand-bg bg-brand-accent px-[46px] py-[17px] no-underline shadow-[0_0_22px_rgba(255,215,0,0.45)] transition-colors"
        >
          Get a Free Quote
        </motion.a>
      </motion.div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 font-display text-[11px] tracking-[3px] uppercase text-white/40 z-10 flex flex-col items-center gap-2.5">
        SCROLL
        <div className="w-[1px] h-[38px] bg-linear-to-b from-brand-accent to-transparent animate-pulse" />
      </div>
    </section>
  );
}
