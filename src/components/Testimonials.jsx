import React from 'react';

const testimonials = [
  {
    quote: "They picked up our freight within the hour and delivered cross-state before our deadline. Absolutely the most reliable carrier we've used.",
    author: "Marcus T., Operations Manager"
  },
  {
    quote: "Fast turnaround, constant updates, and the driver called ahead of drop-off. This is how every delivery service should operate.",
    author: "Danielle R., Small Business Owner"
  },
  {
    quote: "We ship medical equipment on tight timelines. 12 Nationwide handles it with the care and urgency it deserves. Professional every single step.",
    author: "Kevin A., Healthcare Logistics"
  },
  {
    quote: "Booked a same-day run at 9 PM on a Friday. They showed up, handled it perfectly. I've never seen that kind of availability from any carrier.",
    author: "Priya S., E-Commerce Retailer"
  },
  {
    quote: "The tracking link is a game-changer. My client was watching the van live. That level of transparency builds trust immediately.",
    author: "Jerome W., Real Estate Agent"
  },
  {
    quote: "Set up a corporate account and it's been smooth ever since. Priority dispatch, great pricing, and one person who picks up every time.",
    author: "Tasha M., Logistics Coordinator"
  }
];

const Star = () => (
  <svg className="w-[15px] h-[15px] fill-brand-accent" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-linear-to-b from-brand-card to-brand-bg py-[100px] text-center border-t border-brand-card-border overflow-hidden">
      <div className="px-6 md:px-[60px] mb-[60px]">
        <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5">
          What Our Clients Say
        </div>
        <div className="font-display font-black text-[clamp(28px,4vw,54px)] uppercase text-brand-white leading-none">
          Trusted by Businesses Nationwide
        </div>
      </div>

      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
        <div className="flex gap-6 py-2.5 w-max animate-scroll hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((testi, i) => (
            <div 
              key={i} 
              className="w-[300px] md:w-[360px] shrink-0 bg-brand-card border border-brand-card-border p-[32px_28px] rounded-[6px] text-left transition-all hover:border-brand-accent/35 hover:shadow-[0_4px_32px_rgba(255,215,0,0.08)]"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} />)}
              </div>
              <blockquote className="text-[14px] leading-[1.8] text-white/68 italic mb-[22px]">
                "{testi.quote}"
              </blockquote>
              <cite className="font-display font-bold text-[12px] tracking-[1.5px] uppercase text-brand-cyan not-italic">
                — {testi.author}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
