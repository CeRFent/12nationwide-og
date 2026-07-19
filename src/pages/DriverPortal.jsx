import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DriverPortal() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg text-white pt-[100px] px-4">
      <div className="max-w-[600px] mx-auto">
        <header className="mb-8">
          <h1 className="font-display font-black text-3xl uppercase italic">Driver <span className="text-brand-accent">Mode</span></h1>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40">
              {isActive ? 'GPS Broadcasting Active' : 'Offline'}
            </span>
          </div>
        </header>

        <div className="space-y-6">
          {/* Active Job Card */}
          <div className="bg-brand-card border-l-4 border-brand-accent p-6 rounded-r-lg shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-brand-accent/10 text-brand-accent text-[10px] font-bold px-2 py-1 uppercase tracking-tighter">Current Assignment</span>
              <span className="text-white/40 text-xs font-mono">#ORD-0000</span>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-white/30 text-[10px] uppercase font-bold tracking-widest block mb-1">Pickup</label>
                <p className="font-display font-bold text-lg leading-tight uppercase">Airport Cargo Terminal A</p>
              </div>
              <div className="flex justify-center py-2 opacity-20">↓</div>
              <div>
                <label className="text-white/30 text-[10px] uppercase font-bold tracking-widest block mb-1">Drop-off</label>
                <p className="font-display font-bold text-lg leading-tight uppercase">Medical Logistics Center</p>
              </div>
            </div>

            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-full font-display font-black text-xl py-6 rounded-lg uppercase tracking-[3px] transition-all active:scale-95 ${
                isActive 
                  ? 'bg-red-500/10 border-2 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                  : 'bg-brand-accent text-brand-bg shadow-[0_0_30px_rgba(255,215,0,0.3)]'
              }`}
            >
              {isActive ? 'Stop Broadcast' : 'Start Trip'}
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
            <h3 className="font-display font-bold text-sm uppercase mb-4 tracking-widest text-white/60">Delivery Controls</h3>
            <div className="grid grid-cols-2 gap-4">
              <button disabled className="bg-white/5 border border-white/10 py-4 text-[11px] font-bold uppercase tracking-widest opacity-30">Arrived</button>
              <button disabled className="bg-white/5 border border-white/10 py-4 text-[11px] font-bold uppercase tracking-widest opacity-30">Take Photo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
