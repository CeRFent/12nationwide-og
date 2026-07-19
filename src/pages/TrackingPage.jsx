import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TrackingPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-brand-bg text-white pt-[120px] px-6">
      <div className="max-w-[1000px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="inline-block bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-[10px] font-bold px-3 py-1 uppercase tracking-[2px] mb-4">
              Live Tracking Active
            </div>
            <h1 className="font-display font-black text-5xl uppercase leading-none">
              Shipment <span className="text-brand-accent">Status</span>
            </h1>
            <p className="text-white/40 font-display tracking-widest uppercase text-xs mt-4">Order ID: {orderId || 'DEMO-123-456'}</p>
          </div>

          <div className="bg-brand-card border border-brand-border p-6 rounded-lg min-w-[200px]">
            <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Estimated Arrival</div>
            <div className="text-2xl font-display font-black text-brand-cyan uppercase">Pending...</div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Map View */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden min-h-[500px] relative">
              {/* Placeholder for real Mapbox/Google Map */}
              <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-display font-bold uppercase tracking-widest text-white/30 text-sm">Initializing Live Map...</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border p-8 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg uppercase mb-1">Status: <span className="text-brand-accent">Order Received</span></h3>
                <p className="text-white/40 text-sm">Your courier is preparing for pickup at Airport Terminal A.</p>
              </div>
              <div className="hidden md:block">
                 <img src="/logo.png" alt="12 Nationwide" className="h-8 opacity-20 grayscale" />
              </div>
            </div>
          </div>

          {/* Timeline & Details */}
          <div className="space-y-6">
            <div className="bg-brand-card border border-brand-border p-8 rounded-xl">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest mb-8 text-white/60">Milestones</h3>
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                {[
                  { label: 'Order Created', time: '14:30', active: true },
                  { label: 'Courier Assigned', time: '--:--', active: false },
                  { label: 'Picked Up', time: '--:--', active: false },
                  { label: 'In Transit', time: '--:--', active: false },
                  { label: 'Delivered', time: '--:--', active: false }
                ].map((step, i) => (
                  <div key={i} className={`relative pl-10 flex flex-col ${step.active ? 'text-white' : 'text-white/20'}`}>
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 ${step.active ? 'bg-brand-accent border-brand-accent shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'bg-brand-bg border-white/10'} flex items-center justify-center z-10`}>
                       {step.active && <span className="text-brand-bg text-[10px] font-bold">✓</span>}
                    </div>
                    <span className="font-display font-bold uppercase text-sm tracking-wide">{step.label}</span>
                    <span className="text-[10px] font-mono mt-1 opacity-60">{step.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-accent p-6 rounded-xl text-brand-bg">
              <h3 className="font-display font-black text-sm uppercase tracking-widest mb-2">Need Help?</h3>
              <p className="text-xs font-bold leading-relaxed mb-4">Contact your dispatch officer directly for urgent shipment changes.</p>
              <a href="tel:+1234567890" className="inline-block bg-brand-bg text-white font-display font-bold text-xs uppercase tracking-widest px-4 py-2">Call Dispatch</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
