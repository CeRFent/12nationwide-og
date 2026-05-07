import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: "Courier Service",
    description: "Fast, secure, and reliable same-day delivery for documents, parcels, and time-critical items across the region.",
    image: "/service-1.jpg"
  },
  {
    title: "White Glove Delivery",
    description: "Premium handling for high-value items, including inside delivery, professional unpacking, and debris removal.",
    image: "/service-2.jpg"
  },
  {
    title: "Junk Removal",
    description: "Efficient hauling and responsible disposal of unwanted items from residential or commercial properties.",
    image: "/service-3.jpg"
  },
  {
    title: "Small Moving",
    description: "Perfect for apartments, studios, or small offices needing professional transport without full-size moving truck costs.",
    image: "/service-1.jpg"
  },
  {
    title: "Medical Logistics",
    description: "Specialized transport for medical equipment, specimens, and supplies with strict adherence to safety and timing.",
    image: "/service-2.jpg"
  },
  {
    title: "Contract Delivery Routes",
    description: "Dedicated recurring delivery solutions for businesses needing consistent last-mile or inter-office transport.",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto text-left">
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
