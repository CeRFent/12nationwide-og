import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LeadCaptureModal({ isOpen, onClose, blueprintName, downloadUrl }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Mock / Local subscription endpoint call
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, blueprint: blueprintName })
      });
    } catch (err) {
      console.warn('Subscription logging error (ignored for fallback flow):', err);
    }

    // Success state
    setStatus('success');
    localStorage.setItem('12nw_subscribed_email', email);
    localStorage.setItem('12nw_subscribed_name', name);

    // Trigger PDF download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadUrl.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Close modal after a short delay
    setTimeout(() => {
      onClose();
      setStatus('idle');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-bg/85 backdrop-blur-md"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-brand-card border border-brand-card-border p-8 md:p-10 rounded-2xl w-full max-w-[500px] shadow-[0_0_50px_rgba(0,0,0,0.8)] text-left z-10 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl font-bold font-mono transition-colors"
        >
          ×
        </button>

        {status === 'success' ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-brand-cyan/20 border-2 border-brand-cyan rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-display font-black text-2xl uppercase tracking-wider text-brand-cyan">Unlock Successful</h3>
            <p className="text-white/60 text-sm">Your download is starting. Thank you for joining Courier Nation!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="font-display font-bold text-[10px] tracking-[2px] uppercase text-brand-cyan mb-1.5">Free Blueprint Access</div>
              <h3 className="font-display font-black text-3xl uppercase leading-none text-brand-white">
                Start Here <span className="text-brand-accent">(Free)</span>
              </h3>
              <p className="text-white/50 text-xs mt-2.5 leading-relaxed">
                Enter your details to instantly download the <strong className="text-white/80">{blueprintName}</strong> and subscribe to our newsletter for upcoming blueprints.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-white/50">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" 
                  className="w-full bg-brand-bg/60 border border-white/10 p-[12px_14px] text-sm text-brand-white outline-none rounded-lg focus:border-brand-accent focus:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-white/50">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com" 
                  className="w-full bg-brand-bg/60 border border-white/10 p-[12px_14px] text-sm text-brand-white outline-none rounded-lg focus:border-brand-accent focus:shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="w-full bg-brand-accent text-brand-bg font-display font-black text-sm tracking-[2px] uppercase py-[16px] rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:bg-[#ffe44d] hover:shadow-[0_0_24px_rgba(255,215,0,0.4)] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {status === 'sending' ? 'Unlocking...' : 'Get Instant Access'}
            </button>

            <p className="text-[10px] text-white/30 text-center italic">
              🔒 Instant PDF · No spam · Opt-out anytime.
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
