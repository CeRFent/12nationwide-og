import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function Success() {
  const { width, height } = useWindowSize();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading'); // 'loading' | 'verified' | 'failed'
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed');
      return;
    }

    fetch(`/api/verify-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('verified');
          setUserEmail(data.email || '');
          console.log('Purchase verified successfully!');
        } else {
          setStatus('failed');
        }
      })
      .catch((err) => {
        console.error('Verification error:', err);
        setStatus('failed');
      });
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-bg pt-[120px] pb-24 px-6 flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="font-display font-black text-2xl uppercase tracking-widest text-white">Verifying Transaction...</h2>
          <p className="text-white/40 text-sm mt-2">Please wait while we confirm your payment status.</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-brand-bg pt-[120px] pb-24 px-6 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-[500px] mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="font-display font-black text-4xl uppercase mb-4 text-red-500">Access Denied</h1>
          <p className="text-white/60 mb-8 leading-relaxed">
            We could not verify a valid purchase session. If you recently bought the ebook, please use the unique link sent to your email, or contact support if the issue persists.
          </p>
          <a href="/" className="inline-block font-display font-bold uppercase tracking-widest text-xs text-brand-bg bg-brand-accent px-6 py-4 hover:scale-105 transition-transform">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pt-[120px] pb-24 px-6 relative overflow-hidden">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        recycle={false}
        colors={['#FFD700', '#00FFFF', '#FFFFFF']}
      />
      
      <div className="max-w-[800px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-brand-accent/20 border-2 border-brand-accent rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <span className="text-4xl">✅</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display font-black text-[clamp(40px,8vw,80px)] leading-[0.9] uppercase mb-6">
            Payment<br /><span className="text-brand-accent">Confirmed</span>
          </h1>
          <p className="text-xl text-white/60 mb-12 max-w-[600px] mx-auto leading-relaxed">
            Thank you for your purchase! Your journey to building a profitable driver business starts now. You can download your copy of the <strong>Vehicle Income Blueprint</strong> below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-brand-card border border-brand-border p-8 md:p-12 rounded-lg shadow-2xl relative"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 text-left">
            <div className="w-full md:w-1/3 flex justify-center">
              <img 
                src="/ebook-cover.jpeg" 
                alt="Ebook Cover" 
                className="w-full max-w-[180px] shadow-lg rounded transform -rotate-3 hover:rotate-0 transition-transform duration-300"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="font-display font-bold text-2xl uppercase text-brand-white mb-2">Vehicle Income Blueprint</h3>
              <p className="text-white/40 text-sm mb-6 uppercase tracking-widest font-display font-bold">PDF Format · 72 Pages · 26MB</p>
              
              <motion.a 
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,215,0,0.5)' }}
                whileTap={{ scale: 0.95 }}
                href={`/api/download?session_id=${sessionId}`}
                download
                className="inline-block w-full text-center font-display font-bold text-lg tracking-[2px] uppercase text-brand-bg bg-brand-accent px-8 py-5 no-underline shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
              >
                Download Ebook Now
              </motion.a>
              <p className="mt-4 text-[12px] text-white/30 text-center md:text-left">
                Check your email {userEmail ? `(${userEmail})` : ''} for a receipt from Stripe.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <a href="/" className="text-brand-cyan font-display font-bold uppercase tracking-widest text-[13px] hover:text-brand-accent transition-colors">
            ← Return to Homepage
          </a>
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}

