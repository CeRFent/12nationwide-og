import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: "On-Demand Courier",
    description: "Urgent, time-sensitive deliveries handled with precision. From legal documents to medical supplies — we move what matters, when it matters.",
    image: "/service-1.jpg"
  },
  {
    title: "Last-Mile Delivery",
    description: "Reliable last-mile logistics connecting your business to your customers. Scheduled routes and dedicated runs tailored to your operation.",
    image: "/service-2.jpg"
  },
  {
    title: "Cargo Van Freight",
    description: "Larger loads, same reliability. Our cargo vans handle oversized packages, pallets, and freight runs that standard carriers won't take.",
    image: "/service-3.jpg"
  }
];

export default function Services() {
  return (
    <section id="services" className="bg-brand-bg px-6 md:px-[60px] py-[100px] text-center">
      <div className="mb-[58px]">
        <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5">
          What We Do
        </div>
        <h2 className="font-display font-black text-[clamp(36px,5vw,66px)] leading-none uppercase text-brand-white">
          Our Services
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto text-left">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-brand-card border border-brand-card-border overflow-hidden transition-all hover:shadow-[0_8px_48px_rgba(255,215,0,0.14),0_0_0_1px_rgba(255,215,0,0.3)] hover:-translate-y-1 hover:border-brand-accent/40 group"
          >
            <div 
              className="h-[230px] bg-center bg-cover bg-no-repeat transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('${service.image}')` }}
            />
            <div className="p-[28px] md:pb-8">
              <h3 className="font-display font-extrabold text-[22px] uppercase text-brand-white mb-2.5">
                {service.title}
              </h3>
              <p className="text-[14px] leading-[1.75] text-white/60 mb-5">
                {service.description}
              </p>
              <a 
                href="#contact" 
                className="font-display font-bold text-[13px] tracking-[1px] uppercase text-brand-accent no-underline flex items-center gap-1.5 transition-all hover:gap-3 hover:text-brand-cyan"
              >
                Learn More →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
