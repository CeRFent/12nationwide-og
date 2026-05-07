import React from 'react';
import { motion } from 'framer-motion';

const reasons = [
  {
    num: "01",
    title: "Real-Time Tracking",
    description: "Every delivery tracked live. You and your recipient always know exactly where your shipment is — full transparency, zero guesswork."
  },
  {
    num: "02",
    title: "On-Demand Availability",
    description: "Need it gone now? We dispatch same-day, nights, weekends, and holidays — whenever your business needs us, we move."
  },
  {
    num: "03",
    title: "Nationwide Coverage",
    description: "All 48 contiguous states with direct-run capability. No handoffs, no hub delays — your freight goes straight from A to B."
  },
  {
    num: "04",
    title: "Dedicated Account Service",
    description: "A real person, not a chatbot. Every business client gets a dedicated point of contact who knows your operation inside and out."
  }
];

export default function WhyUs() {
  return (
    <section id="why" className="bg-brand-bg px-6 md:px-[60px] py-[100px] grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-start">
      <div className="text-left">
        <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5">
          Why 12 Nationwide
        </div>
        <h2 className="font-display font-black text-[clamp(32px,4vw,56px)] leading-none uppercase text-brand-white mb-9">
          Why Businesses & Individuals Choose Us
        </h2>

      </div>

      <div className="flex flex-col gap-4">
        {reasons.map((reason, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-brand-card border border-brand-card-border p-[26px_28px] rounded-[4px] flex gap-[22px] items-start transition-all hover:border-brand-cyan/30 hover:shadow-[0_4px_28px_rgba(0,229,255,0.08)]"
          >
            <div className="font-display font-black text-[38px] text-brand-accent leading-none shrink-0 w-[50px] opacity-85">
              {reason.num}
            </div>
            <div>
              <h3 className="font-display font-extrabold text-[16px] tracking-[1px] uppercase text-brand-white mb-2">
                {reason.title}
              </h3>
              <p className="text-[14px] leading-[1.75] text-white/55">
                {reason.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
