import React from 'react';
import { motion } from 'framer-motion';

export default function Difference() {
  return (
    <section id="difference" className="bg-linear-to-br from-[#12141a] to-brand-card px-6 md:px-[60px] py-[100px] border-y border-brand-card-border grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
      {/* VIDEO WRAP */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative rounded-[6px] overflow-hidden aspect-video bg-[#111] shadow-[0_0_60px_rgba(0,229,255,0.1)] border border-brand-cyan/15 group cursor-pointer"
      >
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        >
          <source src="/promo-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay if video is missing or loading */}
        <div className="absolute inset-0 bg-linear-to-br from-brand-bg/40 to-brand-card/40 pointer-events-none" />
      </motion.div>

      {/* CONTENT */}
      <div className="text-left">
        <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5">
          See the Difference
        </div>
        <h2 className="font-display font-black text-[clamp(32px,4vw,58px)] leading-none uppercase text-brand-white mb-5">
          Speed. <em className="not-italic text-brand-accent">Every Mile.</em> Every Time.
        </h2>
        <p className="text-[15px] leading-[1.8] text-white/60 mb-8 max-w-lg">
          Watch how our drivers move freight across the country with military efficiency and white-glove care — from pickup to drop-off, no delays, no excuses.
        </p>
        <motion.a 
          whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(255,215,0,0.55)' }}
          whileTap={{ scale: 0.95 }}
          href="#contact" 
          className="inline-block font-display font-bold text-[13px] tracking-[2px] uppercase bg-brand-accent text-brand-bg px-[34px] py-4 no-underline shadow-[0_0_18px_rgba(255,215,0,0.3)] transition-all"
        >
          Get Your Free Quote
        </motion.a>
      </div>
    </section>
  );
}
