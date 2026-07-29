import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '../components/ProtectedRoute';
import {
  getAllQuotes,
  updateQuoteStatus,
  getPricingConfig,
  savePricingConfig,
  resetPricingConfig,
  exportQuotesToCSV,
  getAdminPin,
  setAdminPin
} from '../utils/quoteStorage';
import { DEFAULT_PRICING_CONFIG } from '../utils/pricingEngine';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('quotes'); // 'quotes' | 'pricing' | 'security'
  const [quotesList, setQuotesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  // Pricing Rules State
  const [pricingForm, setPricingForm] = useState(DEFAULT_PRICING_CONFIG);
  const [pricingSaveSuccess, setPricingSaveSuccess] = useState(false);

  // Security PIN state
  const [currentPin, setCurrentPinState] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState('');

  // Refresh quotes & pricing config
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setQuotesList(getAllQuotes());
    setPricingForm(getPricingConfig());
    setCurrentPinState(getAdminPin());
  };

  // Filtered quotes logic
  const filteredQuotes = quotesList.filter(q => {
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    const qStr = `${q.quoteNumber} ${q.customer?.name} ${q.customer?.phone} ${q.customer?.email} ${q.service}`.toLowerCase();
    const matchesSearch = !searchQuery || qStr.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle status update
  const handleStatusChange = (quoteNum, newStatus) => {
    const updated = updateQuoteStatus(quoteNum, newStatus);
    setQuotesList(updated);
    if (selectedQuote && selectedQuote.quoteNumber === quoteNum) {
      setSelectedQuote(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Handle pricing save
  const handleSavePricing = (e) => {
    e.preventDefault();
    savePricingConfig(pricingForm);
    setPricingSaveSuccess(true);
    setTimeout(() => setPricingSaveSuccess(false), 3000);
  };

  // Handle PIN update
  const handleUpdatePin = (e) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setPinMessage('PIN must be at least 4 digits.');
      return;
    }
    setAdminPin(newPin);
    setCurrentPinState(newPin);
    setNewPin('');
    setPinMessage('Master PIN updated successfully!');
    setTimeout(() => setPinMessage(''), 4000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-brand-bg text-white pt-[60px] pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <span className="text-brand-accent font-mono text-xs uppercase tracking-widest font-bold">12 Nationwide Operations</span>
              <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-wider text-white">
                Logistics <span className="text-brand-accent">Command Center</span>
              </h1>
            </div>

            {/* Sub-Nav Tabs */}
            <div className="flex gap-2 bg-brand-card border border-brand-border p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-4 py-2 text-xs font-display font-bold uppercase rounded-md transition-all ${
                  activeTab === 'quotes' ? 'bg-brand-accent text-brand-bg shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                📋 Quotes ({quotesList.length})
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-4 py-2 text-xs font-display font-bold uppercase rounded-md transition-all ${
                  activeTab === 'pricing' ? 'bg-brand-accent text-brand-bg shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                ⚙️ Pricing Rules
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 text-xs font-display font-bold uppercase rounded-md transition-all ${
                  activeTab === 'security' ? 'bg-brand-accent text-brand-bg shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                🔒 Passcode & Security
              </button>
            </div>
          </header>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Quotes', value: quotesList.length, color: 'text-white' },
              { label: 'New Requests', value: quotesList.filter(q => q.status === 'New').length, color: 'text-brand-accent' },
              { label: 'Scheduled Jobs', value: quotesList.filter(q => q.status === 'Scheduled').length, color: 'text-green-400' },
              {
                label: 'Est. Pipeline Revenue',
                value: `$${quotesList.reduce((sum, q) => sum + (q.pricingBreakdown?.estimatedTotal || 0), 0).toFixed(2)}`,
                color: 'text-brand-accent'
              }
            ].map((s, idx) => (
              <div key={idx} className="bg-brand-card border border-brand-border p-5 rounded-xl">
                <div className="text-white/40 text-[10px] uppercase font-mono tracking-widest mb-1">{s.label}</div>
                <div className={`text-2xl md:text-3xl font-display font-black ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* TAB 1: QUOTES MANAGEMENT TABLE */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              {/* Controls Bar: Search, Status Tabs, CSV Export */}
              <div className="bg-brand-card border border-brand-border p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Search */}
                <div className="w-full md:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by quote #, name, phone..."
                    className="w-full bg-white/5 border border-brand-border px-4 py-2.5 rounded-lg text-xs text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-1.5 overflow-x-auto w-full md:w-auto">
                  {['All', 'New', 'Pending Review', 'Quote Sent', 'Scheduled', 'Completed', 'Cancelled'].map(st => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 text-[11px] font-display font-bold uppercase rounded border transition-all ${
                        statusFilter === st
                          ? 'bg-brand-accent text-brand-bg border-brand-accent'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Export CSV Button */}
                <button
                  onClick={() => exportQuotesToCSV(filteredQuotes)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold text-xs px-4 py-2.5 rounded-lg uppercase tracking-wider whitespace-nowrap transition-colors"
                >
                  📥 Export CSV
                </button>
              </div>

              {/* Quotes Table */}
              <div className="bg-brand-card border border-brand-border rounded-xl overflow-x-auto shadow-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-brand-border text-white/40 font-mono uppercase text-[10px]">
                      <th className="py-3.5 px-4">Quote #</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Service</th>
                      <th className="py-3.5 px-4">Pickup → Dropoff</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {filteredQuotes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-white/30 italic">
                          No quotes matching the criteria found.
                        </td>
                      </tr>
                    ) : (
                      filteredQuotes.map(q => (
                        <tr key={q.quoteNumber} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-brand-accent">
                            {q.quoteNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{q.customer?.name}</div>
                            <div className="text-[11px] text-white/40 font-mono">{q.customer?.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white/90">{q.service}</span>
                            <div className="text-[10px] text-white/40">{q.vehicle}</div>
                          </td>
                          <td className="py-3.5 px-4 max-w-[200px] truncate">
                            <div className="text-white/80">{q.pickup?.city || q.pickup?.address}</div>
                            <div className="text-white/40 text-[10px]">→ {q.delivery?.city || q.delivery?.address}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            ${q.pricingBreakdown?.estimatedTotal?.toFixed(2) || '0.00'}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={q.status || 'New'}
                              onChange={(e) => handleStatusChange(q.quoteNumber, e.target.value)}
                              className="bg-white/10 border border-white/20 text-xs text-white rounded px-2 py-1 focus:border-brand-accent"
                            >
                              <option value="New" className="bg-brand-card">New</option>
                              <option value="Pending Review" className="bg-brand-card">Pending Review</option>
                              <option value="Quote Sent" className="bg-brand-card">Quote Sent</option>
                              <option value="Scheduled" className="bg-brand-card">Scheduled</option>
                              <option value="Completed" className="bg-brand-card">Completed</option>
                              <option value="Cancelled" className="bg-brand-card">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedQuote(q)}
                              className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent hover:bg-brand-accent hover:text-brand-bg font-display font-bold text-[10px] px-3 py-1 rounded uppercase tracking-wider transition-all"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: NO-CODE PRICING RULES MANAGER */}
          {activeTab === 'pricing' && (
            <form onSubmit={handleSavePricing} className="bg-brand-card border border-brand-border p-6 md:p-8 rounded-xl space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-display font-black text-white uppercase">No-Code Pricing Rules Manager</h3>
                  <p className="text-white/50 text-xs">Update your base rates, mileage, labor & vehicle pricing without touching code.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const reset = resetPricingConfig();
                      setPricingForm(reset);
                    }}
                    className="text-xs text-white/50 hover:text-white uppercase font-display font-bold px-3 py-2"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-accent text-brand-bg font-display font-bold text-xs px-6 py-2.5 rounded-lg uppercase tracking-wider hover:brightness-110 shadow-lg"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>

              {pricingSaveSuccess && (
                <div className="p-4 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-xs font-bold text-center">
                  ✓ Pricing configuration saved successfully! Active on customer quote calculator.
                </div>
              )}

              {/* Service Base Prices */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-brand-accent uppercase tracking-wider">Service Base Prices ($)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.keys(pricingForm.serviceBasePrices || {}).map(srvKey => (
                    <div key={srvKey}>
                      <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">{srvKey}</label>
                      <input
                        type="number"
                        value={pricingForm.serviceBasePrices[srvKey]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPricingForm(prev => ({
                            ...prev,
                            serviceBasePrices: { ...prev.serviceBasePrices, [srvKey]: val }
                          }));
                        }}
                        className="w-full bg-white/5 border border-brand-border px-3 py-2 rounded text-white font-mono text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Mileage & Vehicle Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-sm text-brand-accent uppercase tracking-wider">Mileage Rates</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">Rate Per Mile ($/mi)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={pricingForm.ratePerMile}
                        onChange={(e) => setPricingForm(prev => ({ ...prev, ratePerMile: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-white/5 border border-brand-border px-3 py-2 rounded text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">Base Miles Included</label>
                      <input
                        type="number"
                        value={pricingForm.baseMilesIncluded}
                        onChange={(e) => setPricingForm(prev => ({ ...prev, baseMilesIncluded: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-white/5 border border-brand-border px-3 py-2 rounded text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">Minimum Base Charge ($)</label>
                      <input
                        type="number"
                        value={pricingForm.minimumBaseCharge}
                        onChange={(e) => setPricingForm(prev => ({ ...prev, minimumBaseCharge: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-white/5 border border-brand-border px-3 py-2 rounded text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-display font-bold text-sm text-brand-accent uppercase tracking-wider">Vehicle Upgrade Charges ($)</h4>
                  <div className="space-y-3">
                    {Object.keys(pricingForm.vehiclePrices || {}).map(vKey => (
                      <div key={vKey}>
                        <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">{vKey}</label>
                        <input
                          type="number"
                          value={pricingForm.vehiclePrices[vKey]}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setPricingForm(prev => ({
                              ...prev,
                              vehiclePrices: { ...prev.vehiclePrices, [vKey]: val }
                            }));
                          }}
                          className="w-full bg-white/5 border border-brand-border px-3 py-2 rounded text-white font-mono text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Additional Services Fees */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-brand-accent uppercase tracking-wider">Labor & Handling Surcharges ($)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.keys(pricingForm.additionalServicePrices || {}).map(sKey => (
                    <div key={sKey}>
                      <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">{sKey}</label>
                      <input
                        type="number"
                        value={pricingForm.additionalServicePrices[sKey]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPricingForm(prev => ({
                            ...prev,
                            additionalServicePrices: { ...prev.additionalServicePrices, [sKey]: val }
                          }));
                        }}
                        className="w-full bg-white/5 border border-brand-border px-3 py-2 rounded text-white font-mono text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: ADMIN SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <div className="bg-brand-card border border-brand-border p-6 md:p-8 rounded-xl max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="text-xl font-display font-black text-white uppercase">Master Security & Passcode</h3>
                <p className="text-white/50 text-xs">Update your master admin PIN for accessing the Logistics Command Center.</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-xs flex justify-between items-center font-mono">
                <span className="text-white/60">Current Active PIN:</span>
                <span className="text-brand-accent font-bold tracking-widest">{currentPin}</span>
              </div>

              {pinMessage && (
                <div className="p-3 bg-brand-accent/20 border border-brand-accent/40 rounded text-brand-accent text-xs text-center font-bold">
                  {pinMessage}
                </div>
              )}

              <form onSubmit={handleUpdatePin} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-1">Enter New Admin PIN</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="e.g. 212789"
                    maxLength={12}
                    className="w-full bg-white/5 border border-brand-border px-4 py-2.5 rounded text-white font-mono tracking-widest text-sm focus:border-brand-accent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-accent text-brand-bg font-display font-bold py-3 rounded uppercase tracking-wider text-xs hover:brightness-110"
                >
                  Update Admin Passcode
                </button>
              </form>
            </div>
          )}

          {/* QUOTE DETAIL MODAL */}
          {selectedQuote && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-brand-card border border-brand-border w-full max-w-2xl p-6 md:p-8 rounded-2xl space-y-6 shadow-2xl relative">
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white text-xl font-bold"
                >
                  ×
                </button>

                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className="text-brand-accent font-mono text-xs font-bold">{selectedQuote.quoteNumber}</span>
                    <h3 className="font-display font-black text-xl text-white uppercase">{selectedQuote.customer?.name}</h3>
                    <p className="text-xs text-white/50 font-mono">{selectedQuote.customer?.phone} • {selectedQuote.customer?.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-brand-accent">
                      ${selectedQuote.pricingBreakdown?.estimatedTotal?.toFixed(2)}
                    </span>
                    <div className="text-[10px] text-white/40 uppercase font-mono">Est. Total</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-brand-accent font-bold uppercase font-mono mb-1">📍 Pickup Location</div>
                    <p className="text-white font-bold">{selectedQuote.pickup?.address}, {selectedQuote.pickup?.city}</p>
                    <p className="text-white/50">{selectedQuote.pickup?.locationType} • Floor {selectedQuote.pickup?.floor} ({selectedQuote.pickup?.elevator ? 'Elevator' : 'Stairs'})</p>
                  </div>

                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-brand-accent font-bold uppercase font-mono mb-1">🏁 Delivery Location</div>
                    <p className="text-white font-bold">{selectedQuote.delivery?.address}, {selectedQuote.delivery?.city}</p>
                    <p className="text-white/50">{selectedQuote.delivery?.locationType} • Floor {selectedQuote.delivery?.floor} ({selectedQuote.delivery?.elevator ? 'Elevator' : 'Stairs'})</p>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h4 className="font-display font-bold text-xs text-white/70 uppercase tracking-wider mb-2">Items Being Transported ({selectedQuote.items?.length})</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {selectedQuote.items?.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-white/5 border border-white/10 rounded flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white">{item.quantity}x {item.type}</span>
                          <span className="text-white/40 text-[10px] block font-mono">{item.weight} lbs per item {item.over300lbs && '• Heavy (>300lbs)'}</span>
                        </div>
                        {item.photo && (
                          <div className="relative group cursor-pointer" onClick={() => setActivePhotoModal(item.photo)}>
                            <img
                              src={item.photo}
                              alt="Item Attachment"
                              className="w-12 h-12 object-cover rounded-lg border border-brand-accent/40 group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] text-white font-bold">🔍 View</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Instructions */}
                {selectedQuote.customer?.instructions && (
                  <div className="p-3 bg-white/5 rounded text-xs">
                    <span className="text-white/50 font-mono block mb-1 uppercase">Special Instructions:</span>
                    <p className="text-white/80 italic">"{selectedQuote.customer.instructions}"</p>
                  </div>
                )}

                <div className="pt-4 flex justify-between items-center border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60 font-mono">Status:</span>
                    <select
                      value={selectedQuote.status}
                      onChange={(e) => handleStatusChange(selectedQuote.quoteNumber, e.target.value)}
                      className="bg-white/10 border border-white/20 text-xs text-white rounded px-2 py-1"
                    >
                      <option value="New" className="bg-brand-card">New</option>
                      <option value="Pending Review" className="bg-brand-card">Pending Review</option>
                      <option value="Quote Sent" className="bg-brand-card">Quote Sent</option>
                      <option value="Scheduled" className="bg-brand-card">Scheduled</option>
                      <option value="Completed" className="bg-brand-card">Completed</option>
                      <option value="Cancelled" className="bg-brand-card">Cancelled</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="bg-white/10 text-white font-display font-bold text-xs px-5 py-2 rounded uppercase hover:bg-white/20"
                  >
                    Close Window
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* LIGHTBOX PHOTO PREVIEW MODAL */}
          {activePhotoModal && (
            <div
              className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]"
              onClick={() => setActivePhotoModal(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-4xl max-h-[90vh] bg-brand-card border border-brand-accent/50 p-2 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActivePhotoModal(null)}
                  className="absolute top-4 right-4 bg-black/60 text-white hover:text-brand-accent w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold border border-white/20 z-10"
                >
                  ×
                </button>
                <img
                  src={activePhotoModal}
                  alt="Item High-Res Attachment"
                  className="max-w-full max-h-[80vh] object-contain rounded-xl"
                />
                <div className="w-full p-3 flex justify-between items-center text-xs font-mono bg-white/5 border-t border-white/10 mt-2">
                  <span className="text-white/60">High-Resolution Item Attachment</span>
                  <a
                    href={activePhotoModal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-accent text-brand-bg font-display font-bold px-4 py-1.5 rounded uppercase hover:brightness-110"
                  >
                    ↗️ Open Full Image
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
