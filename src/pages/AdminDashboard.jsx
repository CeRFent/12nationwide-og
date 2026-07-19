import { motion } from 'framer-motion';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-brand-bg text-white pt-[100px] px-6">
      <div className="max-w-[1200px] mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="font-display font-black text-4xl uppercase">Logistics <span className="text-brand-accent">Command</span></h1>
            <p className="text-white/40 font-display tracking-widest uppercase text-sm mt-2">Fleet Management & Order Entry</p>
          </div>
          <button className="bg-brand-accent text-brand-bg font-display font-bold px-6 py-3 uppercase tracking-wider text-sm hover:scale-105 transition-transform">
            + New Order
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Jobs', value: '0' },
              { label: 'Drivers Online', value: '1' },
              { label: 'Completed (24h)', value: '0' },
              { label: 'Total Revenue', value: '$0.00' }
            ].map((stat, i) => (
              <div key={i} className="bg-brand-card border border-brand-border p-6 rounded-lg">
                <div className="text-white/40 text-xs uppercase tracking-widest font-display font-bold mb-1">{stat.label}</div>
                <div className="text-3xl font-display font-black text-brand-accent">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Active Orders List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display font-bold text-xl uppercase tracking-wider">Active Shipments</h2>
            <div className="bg-brand-card border border-brand-border p-8 rounded-lg text-center">
              <p className="text-white/30 italic">No active shipments found. Create an order to begin tracking.</p>
            </div>
          </div>

          {/* Map Preview Placeholder */}
          <div className="bg-brand-card border border-brand-border rounded-lg overflow-hidden min-h-[400px] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
            <span className="relative z-10 text-white/20 font-display font-bold uppercase tracking-[5px]">Fleet Map Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
}
