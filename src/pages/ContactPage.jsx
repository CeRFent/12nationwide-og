import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('general'); // 'general', 'support', 'quote', 'driver'
  const [message, setMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle', 'sending', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    try {
      const response = await fetch("https://formspree.io/f/xojrlgll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: 'Contact Inquiry',
          name,
          email,
          phone,
          subject,
          message
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen text-white pt-[110px] pb-24 px-6">
      <div className="max-w-[1200px] mx-auto space-y-16">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[11px] font-bold px-3 py-1.5 uppercase tracking-[3px] rounded inline-block">
            📞 24/7 Logistics Support
          </span>
          <h1 className="font-display font-black text-[clamp(42px,6vw,72px)] leading-[0.95] uppercase">
            Let's Start a <br />
            <span className="text-brand-cyan">Conversation</span>
          </h1>
          <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Have questions about our freight services, routes, custom enterprise quotes, or driver openings? Drop us a line and our dispatch team will get back to you immediately.
          </p>
        </div>

        {/* TWO COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
          
          {/* LEFT: INFO CARD */}
          <div className="bg-brand-card border border-brand-card-border p-8 rounded-2xl shadow-2xl space-y-8 text-left">
            <h3 className="font-display font-black text-2xl uppercase tracking-wider text-brand-white border-b border-white/5 pb-4">
              Contact <span className="text-brand-accent">Channels</span>
            </h3>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-brand-cyan" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block">Call / Text Dispatch</span>
                  <a href="tel:3862155963" className="text-lg font-mono font-bold text-white hover:text-brand-cyan transition-colors">386-215-5963</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-brand-accent" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block">General Inquiry</span>
                  <a href="mailto:12nationwide@gmail.com" className="text-lg font-bold text-white hover:text-brand-accent transition-colors">12nationwide@gmail.com</a>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-green-500" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.88 14.24c-.24.69-1.23 1.25-1.9 1.32-.58.06-1.34.1-3.85-.94-3.2-1.32-5.26-4.57-5.42-4.78-.16-.21-1.3-1.73-1.3-3.3 0-1.57.82-2.34 1.11-2.65.24-.26.65-.33.91-.33.09 0 .17 0 .24.01.25.01.5.02.72.54.27.65.91 2.23.99 2.39.08.16.13.35.03.54-.1.19-.22.31-.38.49-.16.18-.34.4-.49.54-.17.16-.35.34-.15.68.2.33.88 1.45 1.89 2.35 1.3 1.16 2.39 1.52 2.73 1.69.34.17.54.14.74-.09.2-.23.86-1 .99-1.23.13-.23.27-.19.46-.12.19.07 1.23.58 1.44.69.21.1.35.16.4.25.06.09.06.54-.18 1.23z"/>
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block">Live Chat</span>
                  <a href="https://wa.me/13862155963" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-green-400 hover:underline transition-all">Start Chat on WhatsApp</a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block">Coverage Area</span>
                <span className="text-[14px] text-white/70">Based in Florida, servicing all 48 contiguous United States.</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 block">Operating Hours</span>
                <span className="text-[14px] text-white/70">24 Hours / 7 Days a week for scheduled routes & dispatch support.</span>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="bg-brand-card border border-brand-card-border p-8 rounded-2xl shadow-2xl text-left">
            <h3 className="font-display font-black text-2xl uppercase tracking-wider text-brand-white border-b border-white/5 pb-4 mb-6">
              Send Us A <span className="text-brand-cyan">Message</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-cyan transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-cyan transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 3862155963"
                    className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-cyan transition-all"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Inquiry Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-cyan transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Active Shipment Support</option>
                    <option value="quote">Custom Enterprise Pricing</option>
                    <option value="driver">Careers & Driver Openings</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Your Message *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you need help with..."
                  className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-cyan transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  disabled={submitStatus === 'sending'}
                  className="w-full bg-brand-cyan hover:bg-[#4df3ff] text-brand-bg font-display font-black text-[13px] tracking-[2.5px] uppercase py-[18px] rounded-lg transition-all shadow-[0_0_18px_rgba(0,229,255,0.25)] hover:shadow-[0_0_28px_rgba(0,229,255,0.45)] disabled:opacity-50"
                >
                  {submitStatus === 'sending' ? 'Sending Message...' : 'Send Message'}
                </button>

                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-brand-cyan font-bold text-center text-xs tracking-wider uppercase"
                    >
                      ✓ Message Sent. We will reply shortly.
                    </motion.p>
                  )}
                  {submitStatus === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 font-bold text-center text-xs tracking-wider uppercase"
                    >
                      ⚠️ Submit error. Please try again.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
