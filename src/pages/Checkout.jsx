import { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch('/api/checkout', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <div className="min-h-screen bg-brand-bg pt-[120px] pb-24 px-6">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display font-black text-5xl uppercase mb-4">
            Secure <span className="text-brand-accent">Checkout</span>
          </h1>
          <p className="text-white/60 font-display tracking-widest uppercase text-sm">
            Driver Income Blueprint · One-Time Payment
          </p>
        </motion.div>

        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden shadow-2xl min-h-[600px]">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={options}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/30 text-xs flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            Secured by Stripe · PCI Compliant · Encrypted Connection
          </p>
        </div>
      </div>
    </div>
  );
}
