import { motion } from 'framer-motion';

const tickerItems = [
  { icon: '📘', text: 'New Release — Field Guide' },
  { icon: '⚡', text: 'Instant PDF Download' },
  { icon: '🚐', text: 'Cars · Cargo Vans · Box Trucks' }
];

const tocItems = [
  {
    num: '01',
    title: 'Foundation & Vehicle Income',
    desc: 'Which vehicle earns the most net profit, how to calculate cost-per-mile, and the 90-day upgrade rule — based on data, not YouTube screenshots.'
  },
  {
    num: '02',
    title: 'Business Setup & Insurance',
    desc: 'Sole prop vs. LLC, how to open a business account, and the insurance gaps that can wipe out a year of earnings in a single accident.'
  },
  {
    num: '03',
    title: 'Apps, Medical Courier & Contracts',
    desc: 'Platform stacking, STAT medical runs, pharmacy circuits, and cold outreach scripts to land your first direct client this week.'
  },
  {
    num: '04',
    title: 'Profit Math & Route Planning',
    desc: 'Deadhead mile control, route density math, and the job acceptance calculator that separates profitable routes from expensive traps.'
  },
  {
    num: '05',
    title: 'Weekly Income System',
    desc: 'Beginner → intermediate → advanced roadmap with a sample weekly schedule combining platform work, routes, and direct contracts.'
  },
  {
    num: '06',
    title: 'Worksheets & Action Tools',
    desc: 'Daily profit tracker, weekly profit review, vehicle expense worksheet, client outreach tracker, and a driver self-audit — all printable.'
  }
];

const lessons = [
  { text: '<strong>Why gross revenue is a trap</strong> — and how to calculate true net profit after every expense' },
  { text: '<strong>The 90-day upgrade rule</strong> — the only data-driven way to know when to buy a bigger vehicle' },
  { text: '<strong>Medical courier requirements</strong> — HIPAA, chain-of-custody, bloodborne training, $25–$45/hr work' },
  { text: '<strong>The phone script</strong> that helped one driver land 3 direct contracts from 47 cold visits' },
  { text: '<strong>Route density math</strong> — why a $200 dense route beats a $300 scattered day every time' },
  { text: '<strong>Tax reserve system</strong> — move 25–30% weekly so April never blindsides you' },
  { text: '<strong>When to hire your first subcontractor</strong> — and how to profit $145+/week per route without driving' },
  { text: '<strong>Personal insurance won\'t cover you</strong> — get the right commercial policy before your first delivery' }
];

const whoFor = [
  {
    title: 'Side Hustle Starters',
    desc: 'You have a car and want to earn $300–$600/week on evenings and weekends without quitting your job yet.'
  },
  {
    title: 'Platform-Dependent Drivers',
    desc: 'You\'re earning on apps but one algorithm change could cut your income in half. You need direct contracts and a diversified income stack.'
  },
  {
    title: 'Full-Time Drivers',
    desc: 'You\'re already driving but guessing at profit. This guide gives you the math, systems, and checklists to actually keep more of what you earn.'
  },
  {
    title: 'Future Owner-Operators',
    desc: 'You want to scale to multiple vans and subcontractors. The scaling section shows exactly how one driver went from solo to $1,380/week net working 25 hours.'
  }
];

export default function Guide() {
  return (
    <div className="bg-brand-bg pt-[70px]">
      {/* TICKER */}
      <div className="bg-brand-card border-b border-brand-border py-4 px-6 flex justify-center gap-8 md:gap-20 flex-wrap">
        {tickerItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] md:text-[13px] font-display font-bold tracking-widest uppercase text-white/70">
            <span className="text-brand-accent text-lg">{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

      {/* HERO */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-4">
            Driver Business Education
          </div>
          <h1 className="font-display font-black text-[clamp(60px,10vw,110px)] leading-[0.9] uppercase mb-8">
            Driver<br /><span className="text-brand-accent">Income</span><br />Blueprint
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-[500px]">
            The 80-page field guide for independent delivery drivers who want to build $1,000+/week in gross income — with the systems, math, and scripts to actually keep it.
          </p>
          
          <div className="flex items-center gap-6 mb-10 flex-wrap">
            <div className="font-display font-black text-6xl text-brand-accent">$27</div>
            <div className="flex flex-col">
              <span className="text-white/40 line-through text-lg">$49</span>
              <span className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[11px] font-bold tracking-widest uppercase px-2 py-1">Save 45%</span>
            </div>
          </div>

          <motion.a 
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,215,0,0.5)' }}
            whileTap={{ scale: 0.95 }}
            href="#buy" 
            className="inline-block font-display font-bold text-lg tracking-[2px] uppercase text-brand-bg bg-brand-accent px-12 py-5 no-underline shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
          >
            Download Now — $27
          </motion.a>
          
          <div className="mt-6 text-[13px] text-white/40 flex items-center gap-2 font-body">
            🔒 Instant PDF · No subscription · Works on any device
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-center perspective-[1000px]"
        >
          <div className="relative group">
            <img 
              src="/ebook-cover.jpeg" 
              alt="Driver Income Blueprint" 
              className="w-full max-w-[400px] rounded-lg shadow-[0_40px_80px_rgba(0,0,0,0.6)] group-hover:rotate-y-5 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -right-6 bg-brand-accent text-brand-bg font-display font-black text-2xl p-4 leading-tight text-center shadow-xl">
              80<br />PAGES
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-brand-card border-y border-brand-border py-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '80', label: 'Pages of Field Tactics' },
            { num: '6', label: 'Income Strategies' },
            { num: '20+', label: 'Worksheets & Action Tools' },
            { num: '$1K', label: 'Weekly Gross Target' }
          ].map((stat, i) => (
            <div key={i}>
              <div className="font-display font-black text-5xl text-brand-accent mb-1">{stat.num}</div>
              <div className="font-display font-bold text-[11px] tracking-[2px] uppercase text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="mb-16">
          <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5 text-center">
            Inside the Guide
          </div>
          <h2 className="font-display font-black text-[clamp(40px,6vw,70px)] leading-none uppercase text-brand-white text-center">
            What's <span className="text-brand-accent">Inside</span>
          </h2>
          <p className="text-white/60 text-center mt-6 max-w-[600px] mx-auto">
            Six parts covering every stage — from your first delivery to scaling with subcontractors and multiple vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {tocItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-card p-8 border-t-2 border-transparent hover:border-brand-accent hover:bg-brand-card/80 transition-all group"
            >
              <div className="font-display font-black text-5xl text-brand-accent/20 group-hover:text-brand-accent/40 transition-colors mb-4">{item.num}</div>
              <h3 className="font-display font-extrabold text-xl uppercase text-brand-white mb-3 tracking-wide">{item.title}</h3>
              <p className="text-[14px] leading-relaxed text-white/50">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* KEY TAKEAWAYS */}
      <section className="bg-brand-card border-y border-brand-border py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16">
            <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5">
              Key Takeaways
            </div>
            <h2 className="font-display font-black text-[clamp(40px,6vw,70px)] leading-none uppercase text-brand-white">
              What You'll <span className="text-brand-accent">Learn</span>
            </h2>
            <p className="text-white/60 mt-6 max-w-[500px]">
              Concrete systems, not motivation. Read it with a calculator in hand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {lessons.map((lesson, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent flex items-center justify-center text-[10px] font-bold mt-1">
                  ✓
                </div>
                <div 
                  className="text-[15px] leading-relaxed text-white/70"
                  dangerouslySetInnerHTML={{ __html: lesson.text }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="mb-16 text-center">
          <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5">
            Is This For You?
          </div>
          <h2 className="font-display font-black text-[clamp(40px,6vw,70px)] leading-none uppercase text-brand-white">
            Who This Is <span className="text-brand-accent">For</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {whoFor.map((item, i) => (
            <div key={i} className="bg-brand-card border-l-4 border-brand-accent p-10">
              <h3 className="font-display font-black text-2xl uppercase text-brand-accent mb-4 tracking-wide">{item.title}</h3>
              <p className="text-white/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="px-6 pb-24">
        <div className="max-w-[1200px] mx-auto bg-white/[0.03] border border-brand-border p-8 text-[13px] text-white/40 leading-relaxed italic">
          <strong className="text-white/60 block mb-2 not-italic uppercase tracking-widest font-display text-[11px]">Income Disclaimer</strong>
          This ebook is educational only. Every income figure shown is a sample scenario based on publicly available rate ranges — not a guarantee of results. Your actual earnings depend on local market demand, vehicle condition, fuel prices, hours worked, platform policies, and your own business skills. Always run your own 2–4 week test with tracked expenses before making financial commitments. For tax, legal, and insurance advice, consult qualified professionals in your state.
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="buy" className="bg-brand-card border-t border-brand-border py-24 px-6 text-center overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-radial-gradient from-brand-accent/20 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <div className="font-display font-bold text-[12px] tracking-[4px] uppercase text-brand-cyan mb-6">
            One-Time Purchase
          </div>
          <h2 className="font-display font-black text-[clamp(40px,8vw,90px)] leading-[0.9] uppercase text-brand-white mb-8">
            Ready to Build Your<br /><span className="text-brand-accent">Driver Business?</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl mb-12 max-w-[600px] mx-auto leading-relaxed">
            Get the full 80-page field guide instantly. No fluff. No subscription. Just the systems that move the needle.
          </p>
          
          <div className="font-display font-black text-8xl text-brand-accent mb-2">$27</div>
          <div className="font-display font-bold text-[14px] tracking-[3px] uppercase text-white/30 mb-12">
            Instant PDF · Was $49
          </div>

          <motion.a 
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255,215,0,0.6)' }}
            whileTap={{ scale: 0.95 }}
            href="YOUR_PAYMENT_LINK_HERE" 
            className="inline-block font-display font-bold text-xl tracking-[3px] uppercase text-brand-bg bg-brand-accent px-16 py-6 no-underline shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all"
          >
            Get Instant Access →
          </motion.a>

          <div className="mt-12 flex justify-center gap-8 md:gap-16 flex-wrap grayscale opacity-50">
            {['Instant PDF Download', '80-Page Field Guide', 'No Subscription', 'Any Device'].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-display font-bold tracking-widest uppercase text-white">
                <span className="text-brand-accent">✓</span> {badge}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
