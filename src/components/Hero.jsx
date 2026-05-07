import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ isLoading }) {
  return (
    <section id="hero" className="relative h-screen min-h-[640px] flex items-center justify-center text-center overflow-hidden">
      {/* BACKGROUND */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(26,28,34,0.65) 0%, rgba(26,28,34,0.2) 50%, rgba(26,28,34,0.88) 100%), url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')`
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={isLoading ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 px-5"
      >
        {/* LOGO MARK */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isLoading ? {} : { scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-[92px] h-[92px] mx-auto mb-[22px] bg-brand-accent/10 border-2 border-brand-accent/40 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.22),inset_0_0_20px_rgba(255,215,0,0.05)]"
        >
          <svg className="w-12 h-12 fill-brand-accent" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        </motion.div>

        {/* TITLE */}
        <h1 className="font-display font-black text-[clamp(60px,9.5vw,118px)] leading-[0.88] tracking-[-2px] uppercase text-brand-white drop-shadow-[0_4px_60px_rgba(0,0,0,0.5)]">
          <span className="text-brand-accent">12</span> <span className="text-brand-cyan drop-shadow-[0_0_40px_rgba(0,229,255,0.55)]">Nationwide</span>
        </h1>

        {/* SUBTITLE */}
        <p className="font-display font-semibold text-[17px] tracking-[5px] uppercase text-white/60 my-4 md:my-9">
          Courier · On-Demand Delivery · Cargo Van
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
