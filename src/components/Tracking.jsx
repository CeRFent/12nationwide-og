import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 1, label: 'Package Received', status: 'completed' },
  { id: 2, label: 'In Transit', status: 'completed' },
  { id: 3, label: 'Out for Delivery', status: 'active' },
  { id: 4, label: 'Delivered', status: 'pending' },
];

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const headerRef = useRef(null);
  const headingText = "Track Your Package";

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = headerRef.current?.querySelectorAll('.char');
      if (chars && chars.length > 0) {
        gsap.from(chars, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
          y: 40,
          opacity: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingNumber) return;
    
    setIsTracking(true);
    setShowResult(false);
    
    // Simulate API delay of 1.5s
    setTimeout(() => {
      setIsTracking(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <section id="tracking" className="py-32 px-10 bg-[#1B3A42] min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-4xl w-full text-center">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <span className="font-mono text-[#8A989C] text-sm uppercase tracking-[0.3em] block mb-4">
            REAL-TIME UPDATES
          </span>
          <h2 className="font-display text-6xl md:text-[72px] text-[#F2F4F5] leading-none uppercase flex justify-center flex-wrap">
            12 NATIONWIDE TRACKING
          </h2>
        </div>

        {/* Tracking Form */}
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 mb-16 max-w-2xl mx-auto">
          <div className="flex-1">
            <motion.input 
              type="text" 
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="ENTER TRACKING NUMBER"
              className="w-full bg-[#0F2A33] border border-[#6E7C80] rounded py-4 px-6 text-[#F2F4F5] font-body placeholder-[#6E7C80] focus:outline-none transition-all"
              whileFocus={{ borderColor: '#C4C9CC', scale: 1.01 }}
            />
          </div>
          <motion.button 
            type="submit"
            disabled={isTracking}
            whileHover={{ scale: 1.02, backgroundColor: '#D9DDDF' }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-[#0F2A33] font-display text-xl px-12 py-4 uppercase tracking-[0.1em] transition-colors disabled:opacity-70 flex items-center justify-center min-w-[160px]"
          >
            {isTracking ? (
              <div className="w-6 h-6 border-2 border-[#0F2A33] border-t-transparent rounded-full animate-spin" />
            ) : (
              'Track'
            )}
          </motion.button>
        </form>

        {/* Results */}
        <AnimatePresence>
          {showResult && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="bg-[#0F2A33] border border-[#6E7C80]/30 rounded-lg p-10 text-left max-w-2xl mx-auto relative"
            >
              {/* Progress Bar Container */}
              <div className="mb-12 relative pt-8">
                <div className="h-1 bg-[#1A1A1A] w-full rounded-full relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-white rounded-full relative"
                  >
                    {/* Sliding Truck Icon */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
                      <svg className="w-4 h-4 text-[#1B3A42]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1-5.5h-2.5V9h2.5v4z"/>
                      </svg>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (index * 0.2) }} // 0.2s stagger
                    className="flex items-start gap-6"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 
                        ${step.status === 'completed' ? 'bg-[#C4C9CC]' : 
                          step.status === 'active' ? 'bg-white' : 
                          'border-2 border-[#6E7C80] bg-transparent'}`}
                      >
                        {step.status === 'completed' && (
                          <svg className="w-4 h-4 text-[#0F2A33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {step.status === 'active' && (
                          <motion.div 
                            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2.5 h-2.5 bg-[#0F2A33] rounded-full"
                          />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-0.5 h-12 -mb-8 mt-2 ${step.status === 'completed' ? 'bg-[#C4C9CC]' : 'bg-[#6E7C80]/30'}`} />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-display text-xl uppercase tracking-wider 
                        ${step.status === 'completed' ? 'text-[#C4C9CC]' : 
                          step.status === 'active' ? 'text-white' : 
                          'text-[#6E7C80]'}`}
                      >
                        {step.label}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
