import React from 'react';

export default function Footer() {
  return (
    <>
      <footer className="bg-[#0d0e12] px-6 md:px-[60px] py-[70px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 border-t border-brand-accent/12">
        <div className="text-left">
          <div className="w-[56px] h-[56px] bg-linear-to-br from-brand-accent to-[#e6c200] rounded-full flex items-center justify-center font-display font-black text-[16px] text-brand-bg tracking-[0.5px] border-2 border-white/20 shadow-[0_0_20px_rgba(255,215,0,0.4)] mb-[18px]">
            12N
          </div>
          <div className="font-display font-extrabold text-[15px] tracking-[1px] uppercase text-brand-white mb-2.5">
            Built to Deliver. Built Nationwide.
          </div>
          <p className="text-[13px] text-white/40 leading-[1.7] max-w-xs">
            Serving businesses and individuals across the nation with speed, reliability, and white-glove care.
          </p>
        </div>

        <div className="text-left">
          <h4 className="font-display font-bold text-[11px] tracking-[2.5px] uppercase text-white/30 mb-[18px]">Quick Links</h4>
          <div className="flex flex-col gap-2.5">
            {['Home', 'About', 'Services', 'Get a Quote', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-[14px] text-white/50 no-underline hover:text-brand-accent transition-colors">{item}</a>
            ))}
          </div>
        </div>

        <div className="text-left">
          <h4 className="font-display font-bold text-[11px] tracking-[2.5px] uppercase text-white/30 mb-[18px]">Services</h4>
          <div className="flex flex-col gap-2.5">
            {['On-Demand Courier', 'Last-Mile Delivery', 'Cargo Van Freight', 'Corporate Accounts'].map((item) => (
              <a key={item} href="#" className="text-[14px] text-white/50 no-underline hover:text-brand-accent transition-colors">{item}</a>
            ))}
          </div>
        </div>

        <div className="text-left">
          <h4 className="font-display font-bold text-[11px] tracking-[2.5px] uppercase text-white/30 mb-[18px]">Contact</h4>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 text-[13px] text-white/50">
              <svg className="w-3.5 h-3.5 fill-brand-accent shrink-0 mt-0.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              Nationwide, USA
            </div>
            <div className="flex items-start gap-2.5 text-[13px] text-white/50">
              <svg className="w-3.5 h-3.5 fill-brand-accent shrink-0 mt-0.5" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              386-215-5963
            </div>
            <div className="flex items-start gap-2.5 text-[13px] text-white/50">
              <svg className="w-3.5 h-3.5 fill-brand-accent shrink-0 mt-0.5" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              12nationwide@gmail.com
            </div>
          </div>
          <div className="flex gap-2.5 mt-[18px]">
            {['fb', 'ig'].map((social) => (
              <a key={social} href="#" className="w-9 h-9 border border-white/12 rounded-full flex items-center justify-center transition-all hover:border-brand-cyan hover:bg-brand-cyan/10 group">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  {social === 'fb' ? (
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  ) : (
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  )}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </footer>
      <div className="bg-[#0d0e12] px-6 md:px-[60px] py-5 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[12px] text-white/30 gap-2 text-center md:text-left">
        <span>© 2025 12 Nationwide LLC. All rights reserved.</span>
        <span>Built for speed. Built nationwide.</span>
      </div>
    </>
  );
}
