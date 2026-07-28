import { motion } from 'framer-motion';
import SmartCalculator from './SmartCalculator';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-brand-bg relative overflow-hidden">
      {/* Background Decorator Gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand-accent font-display font-bold uppercase tracking-[4px] text-xs">
            Instant Quote & Booking Engine
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-wider mt-3">
            Get Your <span className="text-brand-accent">Custom Quote</span>
          </h2>
          <p className="text-white/60 font-display text-sm max-w-xl mx-auto mt-3">
            Select your service, items, and delivery preferences below to calculate an instant estimated quote.
          </p>
        </motion.div>

        {/* Render 7-Step Smart Delivery Quote Calculator */}
        <SmartCalculator />
      </div>
    </section>
  );
}
