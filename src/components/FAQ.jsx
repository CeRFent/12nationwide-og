import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "How quickly can you pick up my delivery?",
    a: "For on-demand orders, we typically dispatch within 30–90 minutes of booking, depending on location and driver availability. Scheduled deliveries are confirmed at your preferred time window."
  },
  {
    q: "Do you handle large or heavy freight?",
    a: "Yes. Our cargo vans can accommodate items up to 2,000 lbs and oversized pallets. Contact us for a custom freight quote and we'll match the right vehicle to your load."
  },
  {
    q: "Do you offer real-time tracking?",
    a: "Absolutely. Every delivery comes with live GPS tracking. You'll receive a tracking link via SMS or email so you can follow your shipment every mile of the route."
  },
  {
    q: "Are you available on weekends and holidays?",
    a: "Yes — 12 Nationwide operates 7 days a week including holidays. We know business doesn't stop, and neither do we."
  },
  {
    q: "Do you offer business/corporate accounts?",
    a: "Yes! Corporate accounts get priority dispatch, volume pricing, and a dedicated account manager. Setup takes less than 24 hours."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="bg-brand-card border-t border-brand-card-border px-6 md:px-[60px] py-[100px]">
      <div className="max-w-[860px] mx-auto text-center">
        <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5">
          FAQ
        </div>
        <h2 className="font-display font-black text-[clamp(28px,4vw,54px)] uppercase text-brand-white mb-[60px] leading-none">
          Frequently Asked Questions
        </h2>

        <div className="text-left">
          {faqs.map((faq, i) => (
            <div key={i} className="border-t border-white/10 last:border-b last:border-white/10">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group"
              >
                <span className="font-body font-medium text-[16px] text-brand-white group-hover:text-brand-accent transition-colors">
                  {faq.q}
                </span>
                <motion.svg 
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  className="w-5 h-5 shrink-0 fill-brand-accent" 
                  viewBox="0 0 24 24"
                >
                  <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-[14px] leading-[1.8] text-white/55">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
