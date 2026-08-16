import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import LeadCaptureModal from '../components/LeadCaptureModal';

const MotionLink = motion(Link);

const freeResources = [
  {
    id: 'money-flow',
    title: 'Business Money Flow Blueprint',
    badge: 'Featured',
    price: 'FREE',
    desc: 'Establish clear business finance lines, build growth accounts, and set up your quarterly tax reserves.',
    bullets: [
      'Manage your business cash flow',
      'Pay yourself correctly',
      'Stay tax-ready',
      'Build a growth fund',
      'Create a profitable business system'
    ],
    downloadUrl: '/downloads/Business_Money_Flow_Blueprint%20.pdf',
    btnText: 'Start Here (Free)'
  }
];

const premiumResources = [
  {
    title: 'Vehicle Income Blueprint',
    badge: 'Premium Masterclass',
    price: '$27',
    desc: 'The comprehensive 72-page master handbook detailing the road from solo driver to fleet scaling.',
    bullets: [
      'Cost per mile logic',
      'Profitable load selection secrets',
      'Advanced business credit building',
      'Subcontracting and route delegation',
      'Commercial insurance and compliance',
      'Scaling your transport fleet'
    ],
    checkoutUrl: '/checkout',
    btnText: 'Buy Now — $27'
  }
];

const upcomingResources = [
  { title: 'Driver Route Blueprint', status: 'Coming Soon', desc: 'Density formulas, platform stacking schedules, and direct contract cold outreach templates.' },
  { title: 'Cost Per Mile Blueprint', status: 'Coming Soon', desc: 'Operating cost reduction spreadsheets and vehicle write-off logs.' },
  { title: 'Business Credit Blueprint', status: 'Coming Soon', desc: 'Building corporate credit scores for vehicle leasing.' },
  { title: 'Fleet Scaling Blueprint', status: 'Coming Soon', desc: 'Step-by-step guidance on dispatch setups and subcontractor hiring.' }
];

export default function Guide() {
  const [modalState, setModalState] = useState({ isOpen: false, name: '', url: '' });

  const triggerDownload = (name, url) => {
    setModalState({ isOpen: true, name, url });
  };

  return (
    <div className="bg-brand-bg min-h-screen text-white pt-[110px] pb-24">
      {/* HEADER SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 mb-16 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[11px] font-bold px-3 py-1.5 uppercase tracking-[3px] rounded">
            🚛 Welcome to 12 Nationwide Academy
          </div>
          <h1 className="font-display font-black text-[clamp(42px,7vw,85px)] leading-[0.95] uppercase">
            Free Business Resources for <br />
            <span className="text-brand-accent">Couriers & Logistics Entrepreneurs</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 font-display uppercase tracking-[4px] font-bold">
            Build. Save. Invest. Scale.
          </p>
        </motion.div>
      </section>

      {/* FEATURED / FREE BLUEPRINTS SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 mb-24">
        <div className="mb-10 text-left border-b border-white/5 pb-4">
          <h2 className="font-display font-black text-3xl uppercase tracking-wider text-white">
            Featured <span className="text-brand-cyan">Free Download</span>
          </h2>
          <p className="text-sm text-white/40 mt-1">Get standard operational manuals to lay down a solid business foundation.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {freeResources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-brand-card border border-brand-card-border p-8 rounded-xl shadow-2xl flex flex-col justify-between relative group overflow-hidden max-w-[800px] mx-auto"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-cyan/10 transition-colors" />
              
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <span className="bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">
                    {resource.badge}
                  </span>
                  <span className="font-display font-black text-2xl text-brand-cyan">
                    {resource.price}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-black text-3xl uppercase tracking-wide text-white group-hover:text-brand-accent transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">{resource.desc}</p>
                </div>

                <div className="space-y-3.5 border-t border-white/5 pt-6">
                  <span className="text-white/40 text-[10px] font-display font-bold uppercase tracking-widest block">Learn how to:</span>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {resource.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-3 items-start text-[13.5px] text-white/70">
                        <span className="text-brand-cyan font-bold text-xs shrink-0 mt-0.5">✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => triggerDownload(resource.title, resource.downloadUrl)}
                  className="w-full text-center font-display font-black text-[15px] tracking-[2.5px] uppercase text-brand-bg bg-brand-cyan py-4.5 rounded-lg shadow-[0_0_18px_rgba(0,229,255,0.25)] hover:bg-[#4df3ff] hover:shadow-[0_0_28px_rgba(0,229,255,0.45)] transition-all active:scale-[0.98]"
                >
                  {resource.btnText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PREMIUM RESOURCES SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 mb-24">
        <div className="mb-10 text-left border-b border-white/5 pb-4">
          <h2 className="font-display font-black text-3xl uppercase tracking-wider text-white">
            Premium <span className="text-brand-accent">Resources</span>
          </h2>
          <p className="text-sm text-white/40 mt-1">Take the ultimate leap with our complete operational handbook from driver to fleet scaling.</p>
        </div>

        {premiumResources.map((resource, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brand-card border-2 border-brand-accent/20 p-8 md:p-12 rounded-xl shadow-[0_0_40px_rgba(255,215,0,0.1)] grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 items-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-radial-gradient from-brand-accent/15 to-transparent" />
            </div>

            {/* Left side */}
            <div className="space-y-6 z-10 text-left">
              <div className="flex gap-4 items-center">
                <span className="bg-brand-accent/15 border border-brand-accent/30 text-brand-accent text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                  {resource.badge}
                </span>
                <span className="font-display font-black text-3xl text-brand-accent">{resource.price}</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-display font-black text-4xl md:text-5xl uppercase leading-none">
                  {resource.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-md font-medium">
                  {resource.desc} Ready for the next step? Get the Vehicle Income Blueprint and learn how to build a profitable courier business from the ground up.
                </p>
              </div>

              <div className="pt-4">
                <MotionLink
                  to={resource.checkoutUrl}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(255,215,0,0.45)' }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block text-center font-display font-black text-base tracking-[3px] uppercase text-brand-bg bg-brand-accent px-12 py-5 rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all no-underline"
                >
                  {resource.btnText}
                </MotionLink>
              </div>
            </div>

            {/* Right side checkmarks */}
            <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-lg z-10 text-left space-y-6">
              <span className="text-white/40 text-[10px] font-display font-bold uppercase tracking-widest block">Learn:</span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resource.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm text-white/85">
                    <span className="text-brand-accent font-bold text-xs shrink-0 mt-0.5">✓</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </section>

      {/* WHATSAPP COMMUNITY SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-linear-to-br from-[#121c17] to-brand-bg border border-green-500/15 p-8 md:p-12 rounded-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-4 max-w-xl">
            <span className="bg-green-500/10 border border-green-500/25 text-green-400 text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full inline-block">
              🤝 Join the Community
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase text-white leading-none">
              Join the 12 Nationwide Community
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Connect with courier and logistics professionals. Access weekly business tips, new blueprint releases, live Q&A sessions, and industry updates.
            </p>
          </div>

          <a
            href="https://chat.whatsapp.com/BSkY9QBDsJj7p3w9XZxytm?s=cl&p=a&ilr=4"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-display font-black text-sm tracking-[2.5px] uppercase px-10 py-5 rounded-lg shadow-[0_0_20px_rgba(37,211,102,0.25)] hover:shadow-[0_0_30px_rgba(37,211,102,0.45)] transition-all select-none no-underline shrink-0"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Join WhatsApp
          </a>
        </motion.div>
      </section>

      {/* UPCOMING BLUEPRINTS */}
      <section className="max-w-[1200px] mx-auto px-6 mb-24">
        <div className="mb-10 text-left border-b border-white/5 pb-4">
          <h2 className="font-display font-black text-3xl uppercase tracking-wider text-white">
            Upcoming <span className="text-white/40">Blueprint Releases</span>
          </h2>
          <p className="text-sm text-white/40 mt-1">Check out what guides are in active development.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {upcomingResources.map((item, idx) => (
            <div key={idx} className="bg-brand-card/50 border border-white/5 p-6 rounded-xl text-left space-y-3 relative group">
              <span className="bg-white/5 border border-white/10 text-white/40 text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-full inline-block font-mono">
                {item.status}
              </span>
              <h4 className="font-display font-bold text-base uppercase text-white/70 group-hover:text-brand-cyan transition-colors">
                {item.title}
              </h4>
              <p className="text-white/30 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORK WITH US SECTION */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="bg-brand-card border border-brand-card-border p-8 md:p-12 rounded-xl text-center space-y-6">
          <div className="font-display font-bold text-[11px] tracking-[3px] uppercase text-brand-cyan">
            Work With 12 Nationwide
          </div>
          <h3 className="font-display font-black text-3xl uppercase leading-none">
            Need Courier or Freight Shipping?
          </h3>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl mx-auto">
            If you need reliable logistics services—including local courier runs, hotshot delivery, heavy freight, or consulting—calculate your shipping rate instantly.
          </p>
          <div className="pt-2">
            <Link 
              to="/#quote" 
              className="inline-block bg-brand-cyan hover:bg-[#4df3ff] text-brand-bg font-display font-black text-sm tracking-[2.5px] uppercase px-10 py-4.5 rounded-lg shadow-[0_0_20px_rgba(0,229,255,0.25)] transition-all no-underline"
            >
              Calculate Delivery Rates →
            </Link>
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE MODAL DIALOG */}
      <LeadCaptureModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, name: '', url: '' })}
        blueprintName={modalState.name}
        downloadUrl={modalState.url}
      />
    </div>
  );
}
