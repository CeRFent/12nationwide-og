import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const navLinksLeft = [
  { name: 'About', href: '/#why' },
  { name: 'Services', href: '/#services' },
  { name: 'Get The Guide', href: '/guide' },
];

const navLinksRight = [
  { name: 'Rates', href: '/#contact' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrollState, setScrollState] = useState('top'); // 'top', 'scrolled', 'solid'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const heroHeight = window.innerHeight;
      
      if (y < 50) {
        setScrollState('top');
      } else if (y < heroHeight * 0.55) {
        setScrollState('scrolled');
      } else {
        setScrollState('solid');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyles = {
    top: {
      background: 'rgba(26, 28, 34, 0)',
      backdropFilter: 'blur(0px)',
      borderBottomColor: 'rgba(255, 215, 0, 0)',
      boxShadow: 'none',
    },
    scrolled: {
      background: 'rgba(26, 28, 34, 0.5)',
      backdropFilter: 'blur(20px) saturate(160%)',
      borderBottomColor: 'rgba(255, 215, 0, 0.16)',
      boxShadow: '0 4px 40px rgba(0, 0, 0, 0.35)',
    },
    solid: {
      background: 'rgba(26, 28, 34, 0.9)',
      backdropFilter: 'blur(28px) saturate(180%)',
      borderBottomColor: 'rgba(255, 215, 0, 0.22)',
      boxShadow: '0 2px 30px rgba(0, 0, 0, 0.6)',
    }
  };

  const handleLinkClick = (e, href) => {
    if (href.startsWith('/#') && isHomePage) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={false}
        animate={navStyles[scrollState]}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-[999] h-[70px] px-6 md:px-[44px] flex items-center justify-between border-b"
      >
        {/* NAV LEFT */}
        <div className="hidden md:flex items-center gap-[34px]">
          {navLinksLeft.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="font-display font-semibold text-[13px] tracking-[1.8px] uppercase text-brand-white opacity-80 hover:opacity-100 hover:text-brand-accent transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* LOGO */}
        <Link 
          to="/" 
          onClick={(e) => handleLinkClick(e, '/#hero')} 
          className="absolute left-1/2 -translate-x-1/2 flex items-center no-underline group"
        >
          <img 
            src="/logo.png" 
            alt="12 Nationwide Logo" 
            className="h-[50px] md:h-[60px] w-auto transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          />
        </Link>

        {/* NAV RIGHT */}
        <div className="hidden md:flex items-center gap-[34px]">
          {navLinksRight.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="font-display font-semibold text-[13px] tracking-[1.8px] uppercase text-brand-white opacity-80 hover:opacity-100 hover:text-brand-accent transition-all"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-[14px]">
            <a href="https://www.facebook.com/profile.php?id=61566018981481" target="_blank" rel="noopener noreferrer">
              <svg className="w-[18px] h-[18px] fill-white opacity-70 cursor-pointer hover:opacity-100 hover:fill-brand-cyan transition-all" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/12nationwidellc/" target="_blank" rel="noopener noreferrer">
              <svg className="w-[18px] h-[18px] fill-white opacity-70 cursor-pointer hover:opacity-100 hover:fill-brand-cyan transition-all" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@couriernation?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer">
              <svg className="w-[18px] h-[18px] fill-white opacity-70 cursor-pointer hover:opacity-100 hover:fill-brand-cyan transition-all" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
            </a>
          </div>
          <Link 
            to="/#contact" 
            onClick={(e) => handleLinkClick(e, '/#contact')} 
            className="font-display font-bold text-[13px] tracking-[1.5px] uppercase text-brand-bg bg-brand-accent px-[22px] py-[10px] no-underline shadow-[0_0_16px_rgba(255,215,0,0.35)] hover:bg-[#ffe44d] hover:shadow-[0_0_28px_rgba(255,215,0,0.6)] transition-all"
          >
            Get a Quote
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          className="md:hidden text-brand-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            ) : (
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            )}
          </svg>
        </button>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[998] bg-brand-bg pt-[100px] px-6 flex flex-col gap-6"
          >
            {[...navLinksLeft, ...navLinksRight].map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-display font-black text-4xl uppercase text-brand-white hover:text-brand-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/#contact" 
              onClick={(e) => handleLinkClick(e, '/#contact')}
              className="mt-4 font-display font-bold text-xl tracking-[2px] uppercase text-brand-bg bg-brand-accent py-4 text-center shadow-[0_0_20px_rgba(255,215,0,0.3)]"
            >
              Get a Quote
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
