import React from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contact" className="bg-linear-to-br from-brand-bg to-[#12141a] px-6 md:px-[60px] py-[100px] grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-[80px] items-start border-t border-brand-card-border">
      <div className="text-left">
        <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5">
          Get Started
        </div>
        <h2 className="font-display font-black text-[clamp(32px,4vw,54px)] uppercase text-brand-white mb-5 leading-none">
          Ready to <em className="not-italic text-brand-accent">Move?</em>
        </h2>
        <p className="text-[14px] leading-[1.8] text-white/55 mb-[30px] max-w-md">
          Whether you need an urgent courier run, a scheduled last-mile route, or long-haul cargo van service — 12 Nationwide is ready to roll. Request a no-obligation quote today.
        </p>
        <a 
          href="tel:+13862155963" 
          className="flex items-center gap-3 font-display font-bold text-[22px] text-brand-white no-underline hover:text-brand-accent transition-colors"
        >
          <svg className="w-[22px] h-[22px] fill-brand-accent" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          386-215-5963
        </a>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-brand-card border border-brand-card-border rounded-[6px] p-6 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.4)]"
      >
        <form className="space-y-5">
          <div className="space-y-2">
            <label className="block font-display font-bold text-[12px] tracking-[1.5px] uppercase text-white/55">Name *</label>
            <input type="text" placeholder="Your full name" className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[3px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" />
          </div>
          <div className="space-y-2">
            <label className="block font-display font-bold text-[12px] tracking-[1.5px] uppercase text-white/55">Email *</label>
            <input type="email" placeholder="your@email.com" className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[3px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" />
          </div>
          <div className="space-y-2">
            <label className="block font-display font-bold text-[12px] tracking-[1.5px] uppercase text-white/55">Phone</label>
            <input type="tel" placeholder="(555) 000-0000" className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[3px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" />
          </div>
          <div className="space-y-2">
            <label className="block font-display font-bold text-[12px] tracking-[1.5px] uppercase text-white/55">Service Needed</label>
            <select className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[3px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all">
              <option value="">Select a service...</option>
              <option>On-Demand Courier</option>
              <option>Last-Mile Delivery</option>
              <option>Cargo Van Freight</option>
              <option>Corporate/Business Account</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block font-display font-bold text-[12px] tracking-[1.5px] uppercase text-white/55">Message</label>
            <textarea placeholder="Tell us about your delivery needs..." className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[3px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all min-h-[110px] resize-y" />
          </div>
          <button type="submit" className="w-full bg-brand-accent text-brand-bg font-display font-bold text-[14px] tracking-[2px] uppercase py-[18px] rounded-[2px] shadow-[0_0_18px_rgba(255,215,0,0.25)] hover:bg-[#ffe44d] hover:shadow-[0_0_32px_rgba(255,215,0,0.5)] transition-all">
            Send Message
          </button>
        </form>
      </motion.div>
    </section>
  );
}
