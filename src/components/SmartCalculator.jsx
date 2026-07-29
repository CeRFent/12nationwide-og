import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateQuote, recommendVehicle, DEFAULT_PRICING_CONFIG } from '../utils/pricingEngine';
import { saveQuote, getPricingConfig } from '../utils/quoteStorage';
import { uploadQuotePhoto, saveQuoteToSupabase } from '../lib/supabase';

const DEFAULT_MAPBOX_TOKEN = typeof window !== 'undefined'
  ? atob('cGsuZXlKMWFXUWlPaUpqYjNWeWFXVnlibUYwYVc5dUlpd2lhU0k2SW1OcmNtTXpNek0yZUhVd01HUnBTVzVsZG1wdmJEVjRkM2QzSW4wLmttdEttZzdrWDRVVnN0RVFMNERUNHc=')
  : '';

const SERVICES_LIST = [
  { id: 'Small Item Delivery', title: 'Small Item Delivery', desc: 'Single boxes, small packages, or single item drops', icon: '📦' },
  { id: 'Furniture Delivery', title: 'Furniture Delivery', desc: 'Couches, tables, beds, dressers & outdoor sets', icon: '🛋️' },
  { id: 'Appliance Delivery', title: 'Appliance Delivery', desc: 'Refrigerators, washers, dryers & ranges', icon: '🧊' },
  { id: 'Store Pickup & Delivery', title: 'Store Pickup & Delivery', desc: 'Home Depot, IKEA, Lowe’s or retail pickups', icon: '🏬' },
  { id: 'Facebook Marketplace Pickup', title: 'Facebook Marketplace Pickup', desc: 'Peer-to-peer Craigslist & Marketplace buys', icon: '🤝' },
  { id: 'White Glove Delivery', title: 'White Glove Delivery', desc: 'Full unboxing, room placement & debris removal', icon: '👑' },
  { id: 'Small Move', title: 'Small Move', desc: 'Studio, 1-bedroom apartment or dorm moves', icon: '🚚' },
  { id: 'Commercial Delivery', title: 'Commercial Delivery', desc: 'Office equipment, pallets & retail stock distribution', icon: '🏢' },
  { id: 'Long-Distance Delivery', title: 'Long-Distance Delivery', desc: 'Interstate transport & multi-city logistics', icon: '🛣️' }
];

const LOCATION_TYPES = ['House', 'Apartment', 'Business', 'Warehouse', 'Storage Unit'];

export default function SmartCalculator() {
  const [activeStep, setActiveStep] = useState(1);
  const [pricingConfig, setPricingConfig] = useState(DEFAULT_PRICING_CONFIG);

  // Load pricing config from local storage (synced with admin settings)
  useEffect(() => {
    setPricingConfig(getPricingConfig());
  }, []);

  // Auto-scroll to top of calculator on step change for smooth mobile UX
  useEffect(() => {
    const el = document.getElementById('smart-calculator');
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  }, [activeStep]);

  // Step 1: Service
  const [service, setService] = useState('Furniture Delivery');

  // Step 2: Pickup
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupZip, setPickupZip] = useState('');
  const [pickupLocationType, setPickupLocationType] = useState('House');
  const [pickupFloor, setPickupFloor] = useState(1);
  const [pickupElevator, setPickupElevator] = useState(false);
  const [pickupGateCode, setPickupGateCode] = useState('');

  // Step 3: Delivery
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryZip, setDeliveryZip] = useState('');
  const [deliveryLocationType, setDeliveryLocationType] = useState('House');
  const [deliveryFloor, setDeliveryFloor] = useState(1);
  const [deliveryElevator, setDeliveryElevator] = useState(false);
  const [deliveryGateCode, setDeliveryGateCode] = useState('');

  // Distance & Time State
  const [miles, setMiles] = useState(5);
  const [driveTimeMins, setDriveTimeMins] = useState(15);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState('');

  // Autocomplete Suggestions
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);

  // Step 4: Items List
  const [items, setItems] = useState([
    { id: 1, type: 'Furniture / Box', quantity: 1, weight: 80, requiresTwoPeople: false, over300lbs: false, photo: null }
  ]);

  // Step 5: Additional Services
  const [additionalServices, setAdditionalServices] = useState({
    insidePickup: false,
    insideDelivery: false,
    assembly: false,
    disassembly: false,
    wrapping: false,
    additionalStop: false,
    additionalStopCount: 1,
    waitingTime: false,
    waitingTimeMins: 30,
    sameDay: false,
    rushService: false
  });

  // Step 6: Vehicle Selection
  const [vehicle, setVehicle] = useState('Cargo Van');

  // Step 7: Delivery Team
  const [deliveryTeam, setDeliveryTeam] = useState('Driver + One Helper');
  const [extraHelpersNote, setExtraHelpersNote] = useState('');

  // Step 8: Customer Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (8am - 12pm)');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Submission Status
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [confirmedQuote, setConfirmedQuote] = useState(null);

  // Auto Distance calculation trigger
  useEffect(() => {
    if (!pickupAddress || !deliveryAddress) return;
    const timer = setTimeout(() => {
      calculateDistance(pickupAddress, deliveryAddress);
    }, 1000);
    return () => clearTimeout(timer);
  }, [pickupAddress, deliveryAddress]);

  // Mapbox Directions & Geocoding
  const calculateDistance = async (fromAddr, toAddr) => {
    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || DEFAULT_MAPBOX_TOKEN;
    if (!mapboxToken) return;

    setIsCalculatingRoute(true);
    setRouteError('');

    try {
      const geocode = async (addr) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addr)}.json?access_token=${mapboxToken}&limit=1&country=us`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.features || data.features.length === 0) return null;
        return { lat: data.features[0].center[1], lon: data.features[0].center[0] };
      };

      const p1 = await geocode(fromAddr);
      const p2 = await geocode(toAddr);

      if (p1 && p2) {
        const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${p1.lon},${p1.lat};${p2.lon},${p2.lat}?access_token=${mapboxToken}&overview=false`;
        const routeRes = await fetch(routeUrl);
        if (routeRes.ok) {
          const routeData = await routeRes.json();
          if (routeData.routes && routeData.routes.length > 0) {
            const distanceMeters = routeData.routes[0].distance;
            const durationSeconds = routeData.routes[0].duration;
            const milesVal = Math.max(1, Math.round((distanceMeters * 0.000621371) * 10) / 10);
            const minsVal = Math.max(5, Math.round(durationSeconds / 60));
            setMiles(milesVal);
            setDriveTimeMins(minsVal);
          }
        }
      }
    } catch (err) {
      console.error('Distance calculation error:', err);
      setRouteError('Could not calculate exact distance automatically. Enter estimated miles manually.');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Autocomplete fetcher
  const fetchAddressSuggestions = async (val, setFn) => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || DEFAULT_MAPBOX_TOKEN;
    if (!token || !val || val.length < 3) {
      setFn([]);
      return;
    }
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${token}&limit=4&autocomplete=true&country=us`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setFn(data.features || []);
      }
    } catch (err) {
      setFn([]);
    }
  };

  // Vehicle Capacity Evaluator
  const vehicleEval = useMemo(() => {
    return recommendVehicle(items, vehicle, pricingConfig);
  }, [items, vehicle, pricingConfig]);

  // Live Price Calculation
  const quoteCalculation = useMemo(() => {
    return calculateQuote({
      service,
      miles,
      driveTimeMinutes: driveTimeMins,
      vehicle,
      deliveryTeam,
      items,
      additionalServices,
      pickupFloor,
      pickupElevator,
      deliveryFloor,
      deliveryElevator
    }, pricingConfig);
  }, [service, miles, driveTimeMins, vehicle, deliveryTeam, items, additionalServices, pickupFloor, pickupElevator, deliveryFloor, deliveryElevator, pricingConfig]);

  // Item list handlers
  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now(), type: 'Additional Item', quantity: 1, weight: 50, requiresTwoPeople: false, over300lbs: false, photo: null }
    ]);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handlePhotoUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleUpdateItem(id, 'photo', reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submission handler
  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerEmail || !pickupAddress || !deliveryAddress) {
      alert('Please fill out all required contact and address fields.');
      return;
    }

    setSubmitStatus('sending');

    // Process photo uploads to Supabase Storage if present
    const processedItems = await Promise.all(
      items.map(async (item) => {
        if (item.photo && (item.photo.startsWith('data:') || item.photo instanceof File)) {
          const publicPhotoUrl = await uploadQuotePhoto(item.photo, 'temp');
          return { ...item, photo: publicPhotoUrl };
        }
        return item;
      })
    );

    const fullQuoteData = {
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        preferredDate,
        preferredTime,
        instructions: specialInstructions,
        extraHelpersNote
      },
      pickup: {
        address: pickupAddress,
        city: pickupCity,
        zip: pickupZip,
        locationType: pickupLocationType,
        floor: pickupFloor,
        elevator: pickupElevator,
        gateCode: pickupGateCode
      },
      delivery: {
        address: deliveryAddress,
        city: deliveryCity,
        zip: deliveryZip,
        locationType: deliveryLocationType,
        floor: deliveryFloor,
        elevator: deliveryElevator,
        gateCode: deliveryGateCode
      },
      service,
      vehicle,
      deliveryTeam,
      items: processedItems,
      additionalServices,
      pricingBreakdown: quoteCalculation
    };

    // Save to local quote storage & generate Quote ID
    const savedRecord = saveQuote(fullQuoteData);

    // Save to Supabase Cloud Database (if configured)
    await saveQuoteToSupabase(savedRecord);

    const uploadedPhotoUrls = processedItems.map(i => i.photo).filter(p => p && p.startsWith('http'));

    // Format WhatsApp & Telegram Direct Chat Message
    const itemsSummary = processedItems.map(i => `• ${i.quantity}x ${i.type} (${i.weight} lbs${i.over300lbs ? ' - Heavy' : ''})`).join('\n');
    const addonsSummary = quoteCalculation.itemizedAddons?.map(a => a.name).join(', ') || 'None';

    const waText = `
🚛 *NEW 12 NATIONWIDE LOAD REQUEST*
🆔 *Quote #:* ${savedRecord.quoteNumber}

👤 *Customer:* ${customerName}
📞 *Phone:* ${customerPhone}
✉️ *Email:* ${customerEmail}

📍 *Pickup:* ${pickupAddress}, ${pickupCity} ${pickupZip} (Type: ${pickupLocationType}, Floor ${pickupFloor}, Elevator: ${pickupElevator ? 'Yes' : 'No'}${pickupGateCode ? `, Gate: ${pickupGateCode}` : ''})
🏁 *Drop-off:* ${deliveryAddress}, ${deliveryCity} ${deliveryZip} (Type: ${deliveryLocationType}, Floor ${deliveryFloor}, Elevator: ${deliveryElevator ? 'Yes' : 'No'}${deliveryGateCode ? `, Gate: ${deliveryGateCode}` : ''})

📦 *Service:* ${service}
🚚 *Vehicle:* ${vehicle}
👥 *Team:* ${deliveryTeam}

📋 *Items (${items.length}):*
${itemsSummary}

🛠️ *Addons:* ${addonsSummary}
📏 *Est. Distance:* ${miles} Miles (~${driveTimeMins} mins)

💰 *ESTIMATED TOTAL:* $${quoteCalculation.estimatedTotal.toFixed(2)}

🗓️ *Preferred Date:* ${preferredDate || 'Flexible'} (${preferredTime})
📝 *Notes:* ${specialInstructions || 'None'}
    `.trim();

    // Also dispatch payload to serverless endpoint in background
    try {
      await fetch('/api/request-load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteNumber: savedRecord.quoteNumber,
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          pickupAddress: `${pickupAddress}, ${pickupCity}`,
          dropoffAddress: `${deliveryAddress}, ${deliveryCity}`,
          deliveryDistanceMiles: `${miles} miles`,
          service,
          vehicle,
          deliveryTeam,
          estimatedQuote: `$${quoteCalculation.estimatedTotal.toFixed(2)}`,
          laborSummary: `${deliveryTeam} (${processedItems.length} items)`,
          photoUrls: uploadedPhotoUrls
        })
      });
    } catch (err) {
      console.warn('Backend API background log skipped.');
    }

    setConfirmedQuote(savedRecord);
    setSubmitStatus('success');

    // Launch Direct WhatsApp Chat to 13862155963
    const targetPhone = '13862155963';
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;
    
    // Open in new window or redirect
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 600);
  };

  return (
    <div id="smart-calculator" className="w-full max-w-6xl mx-auto my-8">
      {/* Header & Step Wizard Bar */}
      <div className="bg-brand-card border border-brand-border p-6 rounded-2xl mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="text-brand-accent font-mono text-xs uppercase tracking-widest font-bold">12 Nationwide Logistics</span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-wider">
              Smart Delivery <span className="text-brand-accent">Quote Calculator</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs font-mono">STEP {activeStep} OF 7</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map(stepNum => (
                <div
                  key={stepNum}
                  onClick={() => setActiveStep(stepNum)}
                  className={`w-8 h-2 rounded-full cursor-pointer transition-all ${
                    activeStep === stepNum
                      ? 'bg-brand-accent scale-105'
                      : stepNum < activeStep
                      ? 'bg-white/40'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step Tabs Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 border-t border-white/5 pt-4 text-xs font-display font-bold">
          {[
            { num: 1, label: '1. Service' },
            { num: 2, label: '2. Pickup' },
            { num: 3, label: '3. Delivery' },
            { num: 4, label: '4. Items' },
            { num: 5, label: '5. Services' },
            { num: 6, label: '6. Vehicle' },
            { num: 7, label: '7. Team & Info' }
          ].map(t => (
            <button
              key={t.num}
              onClick={() => setActiveStep(t.num)}
              className={`py-2 px-3 rounded-lg text-left transition-all ${
                activeStep === t.num
                  ? 'bg-brand-accent text-brand-bg shadow-md'
                  : t.num < activeStep
                  ? 'bg-white/5 text-white/80 hover:bg-white/10'
                  : 'bg-white/5 text-white/30 hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Step Content Area (Cols 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: SERVICE SELECTION */}
          {activeStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-card border border-brand-border p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl font-display font-black text-white uppercase mb-2">Step 1 — Choose Service Type</h3>
              <p className="text-white/50 text-xs mb-6">Select the service that best describes your delivery or move.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SERVICES_LIST.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setService(item.id)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      service === item.id
                        ? 'bg-brand-accent/10 border-brand-accent text-white scale-[1.02] shadow-lg'
                        : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <h4 className="font-display font-bold text-sm text-white uppercase">{item.title}</h4>
                      <p className="text-xs text-white/50 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="mt-4 text-xs font-mono text-brand-accent font-bold">
                      Base: ${pricingConfig.serviceBasePrices[item.id] || 49}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
                  className="bg-brand-accent text-brand-bg font-display font-bold px-8 py-3 rounded-lg uppercase tracking-wider text-sm hover:brightness-110"
                >
                  Continue to Pickup Info →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PICKUP INFORMATION */}
          {activeStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-card border border-brand-border p-6 md:p-8 rounded-2xl space-y-6">
              <div>
                <h3 className="text-xl font-display font-black text-white uppercase mb-1">Step 2 — Pickup Information</h3>
                <p className="text-white/50 text-xs">Enter address details and accessibility information for the pickup location.</p>
              </div>

              <div className="relative">
                <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Pickup Street Address *</label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => {
                    setPickupAddress(e.target.value);
                    fetchAddressSuggestions(e.target.value, setPickupSuggestions);
                  }}
                  placeholder="e.g. 1400 S Orange Ave, Suite 100"
                  className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-brand-accent"
                />

                {pickupSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-brand-card border border-brand-border rounded-lg shadow-2xl z-30 overflow-hidden">
                    {pickupSuggestions.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setPickupAddress(s.place_name);
                          setPickupSuggestions([]);
                        }}
                        className="p-3 text-xs text-white/80 hover:bg-brand-accent/20 cursor-pointer border-b border-white/5"
                      >
                        {s.place_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">City</label>
                  <input
                    type="text"
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    placeholder="Orlando"
                    className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={pickupZip}
                    onChange={(e) => setPickupZip(e.target.value)}
                    placeholder="32801"
                    className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Pickup Location Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {LOCATION_TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPickupLocationType(t)}
                      className={`py-2 px-3 text-xs rounded border uppercase font-display font-bold transition-all ${
                        pickupLocationType === t ? 'bg-brand-accent text-brand-bg border-brand-accent' : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Pickup Floor</label>
                  <select
                    value={pickupFloor}
                    onChange={(e) => setPickupFloor(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-brand-accent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(f => (
                      <option key={f} value={f} className="bg-brand-card text-white">Floor {f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Elevator Available?</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPickupElevator(true)}
                      className={`flex-1 py-3 text-xs rounded border uppercase font-display font-bold ${
                        pickupElevator ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-white/50'
                      }`}
                    >
                      Yes (Elevator)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickupElevator(false)}
                      className={`flex-1 py-3 text-xs rounded border uppercase font-display font-bold ${
                        !pickupElevator ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/50'
                      }`}
                    >
                      No (Stairs)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Gate Code (Optional)</label>
                  <input
                    type="text"
                    value={pickupGateCode}
                    onChange={(e) => setPickupGateCode(e.target.value)}
                    placeholder="#1234"
                    className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setActiveStep(1)} className="text-white/60 text-xs uppercase font-display font-bold px-4 py-3">← Back</button>
                <button onClick={() => setActiveStep(3)} className="bg-brand-accent text-brand-bg font-display font-bold px-8 py-3 rounded-lg uppercase tracking-wider text-sm hover:brightness-110">
                  Continue to Delivery Info →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DELIVERY INFORMATION */}
          {activeStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-card border border-brand-border p-6 md:p-8 rounded-2xl space-y-6">
              <div>
                <h3 className="text-xl font-display font-black text-white uppercase mb-1">Step 3 — Delivery Information</h3>
                <p className="text-white/50 text-xs">Enter destination address and location accessibility details.</p>
              </div>

              <div className="relative">
                <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Delivery Street Address *</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => {
                    setDeliveryAddress(e.target.value);
                    fetchAddressSuggestions(e.target.value, setDeliverySuggestions);
                  }}
                  placeholder="e.g. 450 S Kirkman Rd"
                  className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-brand-accent"
                />

                {deliverySuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-brand-card border border-brand-border rounded-lg shadow-2xl z-30 overflow-hidden">
                    {deliverySuggestions.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setDeliveryAddress(s.place_name);
                          setDeliverySuggestions([]);
                        }}
                        className="p-3 text-xs text-white/80 hover:bg-brand-accent/20 cursor-pointer border-b border-white/5"
                      >
                        {s.place_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">City</label>
                  <input
                    type="text"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    placeholder="Orlando"
                    className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={deliveryZip}
                    onChange={(e) => setDeliveryZip(e.target.value)}
                    placeholder="32811"
                    className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Delivery Location Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {LOCATION_TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDeliveryLocationType(t)}
                      className={`py-2 px-3 text-xs rounded border uppercase font-display font-bold transition-all ${
                        deliveryLocationType === t ? 'bg-brand-accent text-brand-bg border-brand-accent' : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Delivery Floor</label>
                  <select
                    value={deliveryFloor}
                    onChange={(e) => setDeliveryFloor(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-brand-accent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(f => (
                      <option key={f} value={f} className="bg-brand-card text-white">Floor {f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Elevator Available?</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryElevator(true)}
                      className={`flex-1 py-3 text-xs rounded border uppercase font-display font-bold ${
                        deliveryElevator ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-white/50'
                      }`}
                    >
                      Yes (Elevator)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryElevator(false)}
                      className={`flex-1 py-3 text-xs rounded border uppercase font-display font-bold ${
                        !deliveryElevator ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/50'
                      }`}
                    >
                      No (Stairs)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Gate Code (Optional)</label>
                  <input
                    type="text"
                    value={deliveryGateCode}
                    onChange={(e) => setDeliveryGateCode(e.target.value)}
                    placeholder="#5678"
                    className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              {/* Distance Display Badge */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🗺️</span>
                  <div>
                    <span className="text-white/60 uppercase font-mono">Distance & Drive Time</span>
                    <div className="text-white font-bold font-mono">
                      {isCalculatingRoute ? 'Calculating Mapbox route...' : `${miles} Miles • ~${driveTimeMins} mins drive`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-white/40 text-[11px] font-mono">Override Miles:</label>
                  <input
                    type="number"
                    value={miles}
                    onChange={(e) => setMiles(parseFloat(e.target.value) || 1)}
                    className="w-16 bg-white/10 border border-white/20 px-2 py-1 rounded text-white text-center font-mono"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setActiveStep(2)} className="text-white/60 text-xs uppercase font-display font-bold px-4 py-3">← Back</button>
                <button onClick={() => setActiveStep(4)} className="bg-brand-accent text-brand-bg font-display font-bold px-8 py-3 rounded-lg uppercase tracking-wider text-sm hover:brightness-110">
                  Continue to Items →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: ITEMS BEING DELIVERED */}
          {activeStep === 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-card border border-brand-border p-6 md:p-8 rounded-2xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-display font-black text-white uppercase mb-1">Step 4 — Items Being Delivered</h3>
                  <p className="text-white/50 text-xs">Add all items included in this load.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-brand-accent/10 border border-brand-accent/40 text-brand-accent hover:bg-brand-accent hover:text-brand-bg font-display font-bold text-xs px-4 py-2 rounded-lg uppercase tracking-wider transition-all"
                >
                  + Add Item
                </button>
              </div>

              {/* Automatic Vehicle Recommendation Warning if Payload Exceeded */}
              {vehicleEval.exceedsCapacity && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h5 className="text-yellow-400 font-display font-bold text-xs uppercase tracking-wider">Payload Recommendation Alert</h5>
                    <p className="text-white/70 text-xs mt-1">
                      Your total estimated payload weight ({vehicleEval.totalWeight} lbs) exceeds the capacity of your currently selected <strong>{vehicle}</strong>.
                      We automatically recommend upgrading to the <strong>{vehicleEval.recommendedVehicle}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setVehicle(vehicleEval.recommendedVehicle)}
                      className="mt-3 bg-yellow-400 text-brand-bg font-display font-bold text-xs px-4 py-1.5 rounded uppercase tracking-wider hover:brightness-110"
                    >
                      Switch to {vehicleEval.recommendedVehicle} Now
                    </button>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 relative">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-mono text-brand-accent font-bold uppercase">Item #{idx + 1}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 text-xs hover:text-red-300 font-bold"
                        >
                          Remove ×
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-white/50 text-[11px] font-display font-bold uppercase mb-1">Item Description / Type</label>
                        <input
                          type="text"
                          value={item.type}
                          onChange={(e) => handleUpdateItem(item.id, 'type', e.target.value)}
                          placeholder="e.g. Sofa, Washer, Pallet"
                          className="w-full bg-white/5 border border-brand-border px-3 py-2 rounded text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-[11px] font-display font-bold uppercase mb-1">Quantity</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full bg-white/5 border border-brand-border px-3 py-2 rounded text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-[11px] font-display font-bold uppercase mb-1">Est. Weight per Item (lbs)</label>
                        <input
                          type="number"
                          value={item.weight}
                          onChange={(e) => handleUpdateItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white/5 border border-brand-border px-3 py-2 rounded text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.requiresTwoPeople}
                            onChange={(e) => handleUpdateItem(item.id, 'requiresTwoPeople', e.target.checked)}
                            className="rounded accent-brand-accent"
                          />
                          Requires 2 People
                        </label>
                        <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.over300lbs || item.weight > 300}
                            onChange={(e) => handleUpdateItem(item.id, 'over300lbs', e.target.checked)}
                            className="rounded accent-brand-accent"
                          />
                          Over 300 lbs (Heavy)
                        </label>
                      </div>

                      {/* Photo Upload */}
                      <div>
                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white text-[11px] px-3 py-1.5 rounded inline-flex items-center gap-2">
                          📷 {item.photo ? 'Photo Attached' : 'Attach Photo'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(item.id, e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setActiveStep(3)} className="text-white/60 text-xs uppercase font-display font-bold px-4 py-3">← Back</button>
                <button onClick={() => setActiveStep(5)} className="bg-brand-accent text-brand-bg font-display font-bold px-8 py-3 rounded-lg uppercase tracking-wider text-sm hover:brightness-110">
                  Continue to Additional Services →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: ADDITIONAL SERVICES */}
          {activeStep === 5 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-card border border-brand-border p-6 md:p-8 rounded-2xl space-y-6">
              <div>
                <h3 className="text-xl font-display font-black text-white uppercase mb-1">Step 5 — Additional Services</h3>
                <p className="text-white/50 text-xs">Select any optional handling services or rush surcharges required.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'insidePickup', label: 'Inside Pickup', price: pricingConfig.additionalServicePrices.insidePickup, desc: 'Pick up items from inside room/office' },
                  { key: 'insideDelivery', label: 'Inside Delivery', price: pricingConfig.additionalServicePrices.insideDelivery, desc: 'Deliver items directly inside designated room' },
                  { key: 'assembly', label: 'Furniture Assembly', price: pricingConfig.additionalServicePrices.assembly, desc: 'Professional assembly of furniture/tables' },
                  { key: 'disassembly', label: 'Furniture Disassembly', price: pricingConfig.additionalServicePrices.disassembly, desc: 'Disassemble items prior to loading' },
                  { key: 'wrapping', label: 'Protective Wrapping', price: pricingConfig.additionalServicePrices.wrapping, desc: 'Heavy pad & shrink wrap protection' },
                  { key: 'sameDay', label: 'Same-Day Service', price: pricingConfig.additionalServicePrices.sameDaySurcharge, desc: 'Priority dispatch for today' },
                  { key: 'rushService', label: 'Immediate / Rush Service', price: pricingConfig.additionalServicePrices.rushSurcharge, desc: 'Urgent immediate pickup within 2 hours' }
                ].map(srv => (
                  <div
                    key={srv.key}
                    onClick={() => setAdditionalServices(prev => ({ ...prev, [srv.key]: !prev[srv.key] }))}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-start ${
                      additionalServices[srv.key]
                        ? 'bg-brand-accent/10 border-brand-accent text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="font-display font-bold text-sm text-white uppercase">{srv.label}</div>
                      <p className="text-xs text-white/50 mt-1">{srv.desc}</p>
                    </div>
                    <div className="text-brand-accent font-mono text-xs font-bold whitespace-nowrap">
                      +${srv.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setActiveStep(4)} className="text-white/60 text-xs uppercase font-display font-bold px-4 py-3">← Back</button>
                <button onClick={() => setActiveStep(6)} className="bg-brand-accent text-brand-bg font-display font-bold px-8 py-3 rounded-lg uppercase tracking-wider text-sm hover:brightness-110">
                  Continue to Vehicle Selection →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: VEHICLE SELECTION */}
          {activeStep === 6 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-card border border-brand-border p-6 md:p-8 rounded-2xl space-y-6">
              <div>
                <h3 className="text-xl font-display font-black text-white uppercase mb-1">Step 6 — Vehicle Selection</h3>
                <p className="text-white/50 text-xs">Select your fleet vehicle. We recommend the best fit for your payload.</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: 'Cargo Van',
                    capacity: '1,500 lbs max',
                    icon: '🚐',
                    desc: 'Ideal for boxes, single appliances, mattresses, small furniture & store pickups.',
                    price: pricingConfig.vehiclePrices['Cargo Van'] || 0
                  },
                  {
                    name: 'Sprinter Van',
                    capacity: '3,500 lbs max',
                    icon: '🚚',
                    desc: 'High roof & long wheelbase. Ideal for multi-item furniture, living room sets & medium loads.',
                    price: pricingConfig.vehiclePrices['Sprinter Van'] || 45
                  },
                  {
                    name: '26-Foot Box Truck',
                    capacity: '10,000 lbs max',
                    icon: '🚛',
                    desc: 'Full size box truck with hydraulic liftgate. Ideal for small moves, office relocations & pallet loads.',
                    price: pricingConfig.vehiclePrices['26-Foot Box Truck'] || 120
                  }
                ].map(v => {
                  const isSelected = vehicle === v.name;
                  const isRecommended = vehicleEval.recommendedVehicle === v.name;

                  return (
                    <div
                      key={v.name}
                      onClick={() => setVehicle(v.name)}
                      className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col md:flex-row justify-between md:items-center gap-4 relative ${
                        isSelected
                          ? 'bg-brand-accent/10 border-brand-accent text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {isRecommended && (
                        <span className="absolute -top-2.5 right-4 bg-brand-accent text-brand-bg text-[10px] font-display font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                          ⭐ Recommended Fit
                        </span>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{v.icon}</div>
                        <div>
                          <h4 className="font-display font-bold text-base text-white uppercase">{v.name}</h4>
                          <span className="text-xs font-mono text-white/50 block mb-1">Capacity: {v.capacity}</span>
                          <p className="text-xs text-white/60">{v.desc}</p>
                        </div>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <div className="text-brand-accent font-mono font-bold text-sm">
                          {v.price === 0 ? 'Standard Rate' : `+$${v.price}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setActiveStep(5)} className="text-white/60 text-xs uppercase font-display font-bold px-4 py-3">← Back</button>
                <button onClick={() => setActiveStep(7)} className="bg-brand-accent text-brand-bg font-display font-bold px-8 py-3 rounded-lg uppercase tracking-wider text-sm hover:brightness-110">
                  Continue to Delivery Team →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: DELIVERY TEAM & CUSTOMER INFO */}
          {activeStep === 7 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-card border border-brand-border p-6 md:p-8 rounded-2xl space-y-6">
              <div>
                <h3 className="text-xl font-display font-black text-white uppercase mb-1">Step 7 — Delivery Team & Contact Details</h3>
                <p className="text-white/50 text-xs">Choose your helper crew and enter contact info to finalize your estimate.</p>
              </div>

              {/* Delivery Team Selection */}
              <div>
                <label className="block text-white/70 text-xs font-display font-bold uppercase mb-2">Delivery Team Options</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'Driver Only',
                      desc: 'Recommended for small boxed items & customers assisting with loading/unloading.',
                      price: 0
                    },
                    {
                      name: 'Driver + One Helper',
                      desc: 'Recommended for furniture, appliances & customers needing full-service assistance.',
                      price: pricingConfig.teamPrices['Driver + One Helper'] || 65
                    }
                  ].map(t => (
                    <div
                      key={t.name}
                      onClick={() => setDeliveryTeam(t.name)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        deliveryTeam === t.name
                          ? 'bg-brand-accent/10 border-brand-accent text-white'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      <div className="font-display font-bold text-sm text-white uppercase">{t.name}</div>
                      <p className="text-xs text-white/50 mt-1">{t.desc}</p>
                      <div className="mt-3 text-xs font-mono text-brand-accent font-bold">
                        {t.price === 0 ? 'Included' : `+$${t.price}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-xs font-display font-bold uppercase mb-1">Additional Helpers Request (Optional)</label>
                <input
                  type="text"
                  value={extraHelpersNote}
                  onChange={(e) => setExtraHelpersNote(e.target.value)}
                  placeholder="e.g. Requesting 2 additional helpers for heavy stairs"
                  className="w-full bg-white/5 border border-brand-border px-4 py-2.5 rounded text-white text-xs"
                />
              </div>

              <hr className="border-white/10" />

              {/* Customer Contact Details */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Customer Contact Details</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-brand-border px-3 py-2.5 rounded text-white text-xs focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(407) 555-0199"
                      className="w-full bg-white/5 border border-brand-border px-3 py-2.5 rounded text-white text-xs focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-brand-border px-3 py-2.5 rounded text-white text-xs focus:border-brand-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">Preferred Delivery Date</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-white/5 border border-brand-border px-3 py-2.5 rounded text-white text-xs focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">Preferred Delivery Time Window</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-white/5 border border-brand-border px-3 py-2.5 rounded text-white text-xs focus:border-brand-accent"
                    >
                      <option value="Morning (8am - 12pm)" className="bg-brand-card text-white">Morning (8am - 12pm)</option>
                      <option value="Afternoon (12pm - 4pm)" className="bg-brand-card text-white">Afternoon (12pm - 4pm)</option>
                      <option value="Evening (4pm - 8pm)" className="bg-brand-card text-white">Evening (4pm - 8pm)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-display font-bold uppercase mb-1">Special Instructions / Accessibility Notes</label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Provide gate codes, parking instructions, or specific handling notes..."
                    className="w-full bg-white/5 border border-brand-border px-3 py-2.5 rounded text-white text-xs focus:border-brand-accent"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button onClick={() => setActiveStep(6)} className="text-white/60 text-xs uppercase font-display font-bold px-4 py-3">← Back</button>
                <button
                  type="button"
                  onClick={handleSubmitQuote}
                  disabled={submitStatus === 'sending'}
                  className="bg-brand-accent text-brand-bg font-display font-bold px-8 py-3.5 rounded-lg uppercase tracking-wider text-sm hover:brightness-110 shadow-lg active:scale-95 transition-all"
                >
                  {submitStatus === 'sending' ? 'Submitting Quote...' : 'Submit & Receive Official Quote →'}
                </button>
              </div>
            </motion.div>
          )}

          {/* SUCCESS MODAL / CONFIRMATION */}
          {submitStatus === 'success' && confirmedQuote && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-brand-card border border-brand-accent p-8 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h3 className="font-display font-black text-2xl text-white uppercase">Quote Request Submitted!</h3>
              <p className="text-xs text-white/70 max-w-md mx-auto">
                Thank you, <strong>{confirmedQuote.customer?.name}</strong>. Your estimate has been recorded under Quote Number:
              </p>
              <div className="text-2xl font-mono font-bold text-brand-accent tracking-widest bg-white/5 border border-brand-border py-2 px-4 rounded-lg inline-block">
                {confirmedQuote.quoteNumber}
              </div>

              <p className="text-xs text-white/50">
                Our dispatch team will review your items and accessibility details and contact you via phone or email to confirm your scheduled time slot.
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <a
                  href={`https://wa.me/13862155963`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-brand-bg font-display font-bold text-xs px-6 py-2.5 rounded uppercase hover:brightness-110 shadow-lg flex items-center gap-2"
                >
                  💬 Open WhatsApp Chat
                </a>
                <button
                  onClick={() => window.print()}
                  className="bg-white/10 border border-white/20 text-white font-display font-bold text-xs px-6 py-2.5 rounded uppercase hover:bg-white/20"
                >
                  🖨️ Print Quote
                </button>
                <button
                  onClick={() => {
                    setSubmitStatus('idle');
                    setActiveStep(1);
                  }}
                  className="bg-brand-accent text-brand-bg font-display font-bold text-xs px-6 py-2.5 rounded uppercase hover:brightness-110"
                >
                  Create New Quote
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Sticky Quote Summary Card (Col 1) */}
        <div className="lg:col-span-1">
          <div className="bg-brand-card border border-brand-border p-6 rounded-2xl sticky top-[100px] space-y-5 shadow-2xl">
            <h4 className="font-display font-black text-base text-white uppercase tracking-wider border-b border-white/10 pb-3 flex justify-between items-center">
              <span>Estimated Quote</span>
              <span className="text-xs font-mono text-brand-accent font-normal">Real-Time</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Selected Service:</span>
                <span className="text-white font-bold">{quoteCalculation.selectedService}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Vehicle:</span>
                <span className="text-white font-bold">{quoteCalculation.vehicle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Delivery Team:</span>
                <span className="text-white font-bold">{quoteCalculation.deliveryTeam}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Est. Distance:</span>
                <span className="text-white font-bold font-mono">{quoteCalculation.estimatedDistanceMiles} Miles (~{quoteCalculation.estimatedDriveTimeMins} mins)</span>
              </div>

              {/* Price Breakdown */}
              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-white/70">
                  <span>Base Service Charge:</span>
                  <span className="font-mono">${quoteCalculation.basePrice.toFixed(2)}</span>
                </div>
                {quoteCalculation.mileageCharge > 0 && (
                  <div className="flex justify-between text-white/70">
                    <span>Mileage Charge:</span>
                    <span className="font-mono">${quoteCalculation.mileageCharge.toFixed(2)}</span>
                  </div>
                )}
                {quoteCalculation.vehicleCharge > 0 && (
                  <div className="flex justify-between text-white/70">
                    <span>Vehicle Upgrade:</span>
                    <span className="font-mono">${quoteCalculation.vehicleCharge.toFixed(2)}</span>
                  </div>
                )}
                {quoteCalculation.laborCharges > 0 && (
                  <div className="flex justify-between text-white/70">
                    <span>Labor & Stairs:</span>
                    <span className="font-mono">${quoteCalculation.laborCharges.toFixed(2)}</span>
                  </div>
                )}
                {quoteCalculation.surcharges > 0 && (
                  <div className="flex justify-between text-white/70">
                    <span>Addons & Surcharges:</span>
                    <span className="font-mono">${quoteCalculation.surcharges.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total Display */}
              <div className="border-t border-brand-accent/40 pt-3 flex justify-between items-baseline">
                <span className="font-display font-black text-sm uppercase text-white">Estimated Total</span>
                <span className="text-2xl font-display font-black text-brand-accent">
                  ${quoteCalculation.estimatedTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Disclaimer Notice */}
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-[11px] text-white/40 leading-tight">
              ⚠️ <em>This estimate is provided for planning purposes only. Final pricing will be confirmed after reviewing your items, accessibility, distance, and requested services.</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
