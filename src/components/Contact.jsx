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
        <div className="flex flex-col gap-4">
          <a 
            href="tel:+13862155963" 
            className="flex items-center gap-3 font-display font-bold text-[22px] text-brand-white no-underline hover:text-brand-accent transition-colors"
          >
            <svg className="w-[22px] h-[22px] fill-brand-accent" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            386-215-5963
          </a>
          <a 
            href="https://wa.me/13862155963" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 font-display font-bold text-[13px] tracking-[2px] uppercase text-brand-cyan no-underline hover:text-brand-accent transition-colors"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Text / WhatsApp
          </a>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-brand-card border border-brand-card-border rounded-[6px] p-6 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.4)]"
      >
        <form 
          action="https://formspree.io/f/xojrlgll" 
          method="POST"
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="block font-display font-bold text-[12px] tracking-[1.5px] uppercase text-white/55">Name *</label>
            <input name="name" type="text" required placeholder="Your full name" className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[3px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" />
          </div>
          <div className="space-y-2">
            <label className="block font-display font-bold text-[12px] tracking-[1.5px] uppercase text-white/55">Email *</label>
            <input name="email" type="email" required placeholder="your@email.com" className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[3px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" />
          </div>
          <div className="space-y-2">
            <label className="block font-display font-bold text-[12px] tracking-[1.5px] uppercase text-white/55">Phone</label>
            <input name="phone" type="tel" placeholder="(555) 000-0000" className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[3px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" />
          </div>
          <div className="space-y-2">
            <label className="block font-display font-bold text-[12px] tracking-[1.5px] uppercase text-white/55">Service Needed</label>
            <select name="service" className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[3px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all">
              <option value="">Select a service...</option>
              <option>Scheduled delivery</option>
              <option>Moving services</option>
              <option>Furniture pickup</option>
              <option>Junk removal</option>
              <option>Medical delivery</option>
              <option>other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block font-display font-bold text-[12px] tracking-[1.5px] uppercase text-white/55">Message</label>
            <textarea name="message" placeholder="Tell us about your delivery needs..." className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[3px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all min-h-[110px] resize-y" />
          </div>
          <button type="submit" className="w-full bg-brand-accent text-brand-bg font-display font-bold text-[14px] tracking-[2px] uppercase py-[18px] rounded-[2px] shadow-[0_0_18px_rgba(255,215,0,0.25)] hover:bg-[#ffe44d] hover:shadow-[0_0_32px_rgba(255,215,0,0.5)] transition-all">
            Send Message
          </button>
        </form>
      </motion.div>
    </section>
  );
}
