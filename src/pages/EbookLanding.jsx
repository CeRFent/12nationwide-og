import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MotionLink = motion(Link);

const tickerItems = [
  { icon: '📘', text: 'New Release — Field Guide' },
  { icon: '⚡', text: 'Instant PDF Download' },
  { icon: '🚐', text: 'Cars · Cargo Vans · Box Trucks' }
];

const tocItems = [
  {
    num: '01',
    title: 'Choosing the Right Vehicle',
    desc: 'Match your vehicle to the work — car, SUV, cargo van, Sprinter van, or box truck — plus an upgrade decision checklist and inspection steps before you buy or lease.'
  },
  {
    num: '02',
    title: 'Set Up Like a Business',
    desc: 'Sole prop vs. LLC vs. C-Corp, opening a business bank account, required licenses and permits, and the insurance questions that protect you before your first delivery.'
  },
  {
    num: '03',
    title: 'Making Money',
    desc: 'Platform stacking and peak-hour timing, plus the bad-job decision rules that keep you from taking work that quietly loses money.'
  },
  {
    num: '04',
    title: 'Medical Courier Work',
    desc: 'HIPAA and bloodborne pathogens training, the documents you need, and a sample medical route week from pickup to payout.'
  },
  {
    num: '05',
    title: 'Direct Contracts',
    desc: 'A cold-outreach phone script, which local businesses to approach, and how to price and lock in repeat contract work.'
  },
  {
    num: '06',
    title: 'Profit Control',
    desc: 'Revenue vs. profit, true cost-per-mile, and cutting deadhead miles with smarter route density and planning.'
  },
  {
    num: '07',
    title: 'Job Decisions',
    desc: 'The job acceptance calculator and a profit-first framework for deciding which jobs are worth taking before you drive.'
  },
  {
    num: '08',
    title: 'Mistakes That Kill Profit',
    desc: 'The most common profit leaks, a mistake-consequence-fix breakdown, and a self-audit to catch them early.'
  },
  {
    num: '09',
    title: 'Weekly Income System',
    desc: 'A beginner-to-intermediate roadmap with a sample weekly schedule built to hit consistent $1,000+ gross weeks.'
  },
  {
    num: '10',
    title: 'Scaling',
    desc: 'Hiring your first driver, adding a second route, a scale-readiness checklist, and the printable trackers to run it all.'
  }
];

const lessons = [
  { text: '<strong>Why gross revenue is a trap</strong> — and how to calculate true net profit after every expense' },
  { text: '<strong>The vehicle upgrade checklist</strong> — a clear, data-driven way to know when it\'s time to buy a bigger vehicle' },
  { text: '<strong>Medical courier requirements</strong> — HIPAA and bloodborne pathogens training, required documents, and how to land the work' },
  { text: '<strong>The phone script</strong> that helped one driver land 3 direct contracts from 47 cold visits' },
  { text: '<strong>Route density math</strong> — why a tighter, denser route beats a scattered high-mileage day every time' },
  { text: '<strong>Tax reserve system</strong> — move 25–30% weekly so April never blindsides you' },
  { text: '<strong>When to hire your first driver</strong> — and how to profit from a second route without driving it yourself' },
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

export default function EbookLanding() {
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
            Vehicle<br /><span className="text-brand-accent">Income</span><br />Blueprint
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-[500px]">
            A practical 72-page system for finding better-paying delivery work, controlling expenses, and building toward $1,000 weeks — with the real-world math, systems, and client outreach scripts to keep it.
          </p>
          
          <div className="flex items-center gap-6 mb-10 flex-wrap">
            <div className="font-display font-black text-6xl text-brand-accent">$27</div>
            <div className="flex flex-col">
              <span className="text-white/40 line-through text-lg">$49</span>
              <span className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[11px] font-bold tracking-widest uppercase px-2 py-1">Save 45%</span>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <MotionLink 
              to="/checkout" 
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,215,0,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block font-display font-bold text-lg tracking-[2px] uppercase text-brand-bg bg-brand-accent px-12 py-5 no-underline shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
            >
              Download Now — $27
            </MotionLink>
            <div className="mt-3 text-[11px] text-brand-accent/80 font-bold uppercase tracking-wider">
              ⚡ Instant Download · All Sales Final (No Refunds)
            </div>
          </div>
          
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
              alt="Vehicle Income Blueprint"
              className="w-full max-w-[400px] rounded-lg shadow-[0_40px_80px_rgba(0,0,0,0.6)] group-hover:rotate-y-5 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -right-6 bg-brand-accent text-brand-bg font-display font-black text-2xl p-4 leading-tight text-center shadow-xl">
              72<br />PAGES
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-brand-card border-y border-brand-border py-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '72', label: 'Pages of Field Tactics' },
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
            Ten chapters covering every stage — from choosing your first vehicle to scaling with your first hire and a second route.
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

          {/* CTA 2 (Mid-Page 1) */}
          <div className="mt-16 pt-10 border-t border-brand-border flex flex-col items-center text-center">
            <MotionLink 
              to="/checkout" 
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,215,0,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block font-display font-bold text-lg tracking-[2px] uppercase text-brand-bg bg-brand-accent px-12 py-5 no-underline shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
            >
              Get Instant Access — $27
            </MotionLink>
            <div className="mt-3 text-[11px] text-brand-accent/80 font-bold uppercase tracking-wider">
              ⚡ Instant PDF Access · All Sales Final (No Refunds)
            </div>
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

      {/* BEHIND THE BLUEPRINT (BRAND AUTHORITY) */}
      <section className="bg-brand-card/30 border-y border-brand-border py-24 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-4">
              Real-World Delivery Experience
            </div>
            <h2 className="font-display font-black text-[clamp(40px,6vw,60px)] leading-[0.95] uppercase mb-8">
              BEHIND THE <span className="text-brand-accent">BLUEPRINT</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              This guide was created by an independent courier with 3 years of active, real-time experience on the road. Instead of theoretical courses or generic advice from online gurus, the <strong>Vehicle Income Blueprint</strong> is built entirely on real street data, verified routing workflows, and the exact spreadsheets used to run a profitable delivery operation.
            </p>
            <p className="text-white/60 leading-relaxed mb-8">
              After navigating the learning curve, stacking platforms, and optimizing local delivery routes, I compiled the exact scripts, worksheets, and calculators into a printable action plan so other independent drivers can skip the costly trial-and-error.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-2 border-brand-accent pl-4">
                <div className="font-display font-bold text-xl text-white">3+ YEARS</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-semibold">Real-Time Experience</div>
              </div>
              <div className="border-l-2 border-brand-accent pl-4">
                <div className="font-display font-bold text-xl text-white">1,500+ RUNS</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-semibold">Completed & Tracked</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-brand-card border border-brand-border p-8 rounded-lg relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-brand-accent font-display font-extrabold text-[12px] tracking-[2px] uppercase block mb-6">
              ★ The 12-Nationwide Operational Manifesto
            </span>
            <blockquote className="text-white/80 italic text-base leading-relaxed mb-6">
              "I didn't write this to teach you how to 'hustle' harder. I built it to show you the actual math and routing tactics that make driving profitable. If you apply the same route density formulas, stacking limits, and cost-per-mile controls, your delivery business will be built on rock, not sand."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center font-display font-bold text-[11px] text-brand-accent">
                12NW
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">12 Nationwide Courier Operations</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Independent Delivery Systems</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VERIFIED DRIVER EVIDENCE & TESTIMONIALS */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="mb-16 text-center">
          <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5">
            Real Driver Results
          </div>
          <h2 className="font-display font-black text-[clamp(40px,6vw,70px)] leading-none uppercase text-brand-white">
            VERIFIED PROOF & <span className="text-brand-accent">TESTIMONIALS</span>
          </h2>
          <p className="text-white/60 text-center mt-4 max-w-[600px] mx-auto">
            These independent drivers stacked platforms, optimized route density, and set up direct contracts using the blueprint systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-card border border-brand-border p-8 rounded-lg shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-display font-bold text-lg text-white">J. T.</h4>
                  <span className="text-[11px] text-brand-cyan uppercase tracking-wider font-semibold">Cargo Van Owner-Operator</span>
                </div>
                <span className="text-brand-accent font-mono text-xs font-bold bg-brand-accent/10 px-2.5 py-1 rounded">+$1,450/wk Net</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                "Was running generic apps earning gross $800 but driving 1,200 miles a week. Used the HIPAA requirements in Chapter 4 to stack two local lab routes. Now averaging $1,450/week net, and I've cut my driving miles in half."
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border p-8 rounded-lg shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-display font-bold text-lg text-white">Markus D.</h4>
                  <span className="text-[11px] text-brand-cyan uppercase tracking-wider font-semibold">Mid-Size SUV Courier</span>
                </div>
                <span className="text-brand-accent font-mono text-xs font-bold bg-brand-accent/10 px-2.5 py-1 rounded">+$240/wk Saved</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                "The Route Density Math sheet changed everything. I stopped chasing high gross routes that led me 60 miles out of town. I stack 3 platforms inside a 15-mile radius now. Keeping an extra $240/week in gas savings alone."
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border p-8 rounded-lg shadow-xl md:col-span-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-display font-bold text-lg text-white">Elena S.</h4>
                  <span className="text-[11px] text-brand-cyan uppercase tracking-wider font-semibold">Contract Fleet Dispatcher</span>
                </div>
                <span className="text-brand-accent font-mono text-xs font-bold bg-brand-accent/10 px-2.5 py-1 rounded">2 Routes Locked In</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                "I bought the guide for the scaling scripts. The contract negotiation guidelines helped me approach a local wholesale pharmacy. We just locked in our second van route. The route calculator is worth 10x the price."
              </p>
            </div>
          </div>

          {/* EARNINGS LEDGER CARD */}
          <div className="bg-brand-card border border-brand-accent/20 rounded-lg p-8 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-display font-bold uppercase tracking-widest text-xs text-white/60">Live Driver Ledger</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded font-bold">Verified Statement</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Weekly Direct Contract</span>
                <span className="font-mono text-white font-bold">$1,145.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Stacked App Runs (Density)</span>
                <span className="font-mono text-white font-bold">$430.50</span>
              </div>
              <div className="flex justify-between text-sm pb-4 border-b border-brand-border">
                <span className="text-white/40">Fuel & Toll Deductions</span>
                <span className="font-mono text-red-400 font-bold">-$210.20</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="font-display font-bold uppercase text-brand-accent text-sm">Net Take Home</span>
                <span className="font-mono text-3xl font-bold text-brand-accent">$1,365.30</span>
              </div>
            </div>
            <div className="mt-8 text-center text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
              Calculated using the Weekly Profit Review worksheet included in Chapter 10 of the Blueprint.
            </div>
          </div>
        </div>

        {/* CTA 3 (Mid-Page 2) */}
        <div className="pt-8 flex flex-col items-center text-center">
          <MotionLink 
            to="/checkout" 
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,215,0,0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-block font-display font-bold text-lg tracking-[2px] uppercase text-brand-bg bg-brand-accent px-12 py-5 no-underline shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
          >
            Download Vehicle Blueprint — $27
          </MotionLink>
          <div className="mt-3 text-[11px] text-brand-accent/80 font-bold uppercase tracking-wider">
            ⚡ Instant Download · Digital Product (All Sales Final)
          </div>
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
            Get the full 72-page system instantly. No fluff. No subscription. Just the logistics math and direct contract frameworks that move the needle.
          </p>
          
          <div className="font-display font-black text-8xl text-brand-accent mb-2">$27</div>
          <div className="font-display font-bold text-[14px] tracking-[3px] uppercase text-white/30 mb-8">
            Instant PDF · Was $49
          </div>

          <div className="flex flex-col items-center">
            <MotionLink 
              to="/checkout" 
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255,215,0,0.6)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block font-display font-bold text-xl tracking-[3px] uppercase text-brand-bg bg-brand-accent px-16 py-6 no-underline shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all"
            >
              Get Instant Access →
            </MotionLink>
            <div className="mt-4 text-xs text-brand-accent/80 font-bold uppercase tracking-wider">
              ⚡ Immediate Download · Due to Instant Digital Delivery, All Sales Are Final (No Refunds)
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-8 md:gap-16 flex-wrap grayscale opacity-50">
            {['Instant PDF Download', '72-Page Field Guide', 'No Subscription', 'Any Device'].map((badge, i) => (
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
