import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  // Customer Info State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [serviceDate, setServiceDate] = useState('');

  // Auto-calculated / Manual Mileage
  const [miles, setMiles] = useState(1);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [isManualDistance, setIsManualDistance] = useState(false);

  // Autocomplete Suggestions State
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);

  // Rate Inputs
  const [weightRange, setWeightRange] = useState('0-25'); // '0-25', '26-50', '51-100', '101-200', '201-300', '301-500', '501-1000', 'over-1000'
  const [serviceLevel, setServiceLevel] = useState('scheduled'); // 'scheduled', 'priority', 'after-hours'
  const [driverAssistance, setDriverAssistance] = useState('none'); // 'none', 'assist', 'full'
  const [heavyHandling, setHeavyHandling] = useState('none'); // 'none', 'light', 'medium', 'heavy'
  const [stairsCount, setStairsCount] = useState(0);
  const [waitTimeMinutes, setWaitTimeMinutes] = useState(0);

  // White-Glove State
  const [whiteGloveBasic, setWhiteGloveBasic] = useState(false);
  const [whiteGloveRoomPlacement, setWhiteGloveRoomPlacement] = useState(false);
  const [whiteGloveHeavyBulky, setWhiteGloveHeavyBulky] = useState(false);
  const [whiteGloveTwoPerson, setWhiteGloveTwoPerson] = useState(false);
  const [whiteGloveStairsCount, setWhiteGloveStairsCount] = useState(0);
  const [whiteGlovePackagingRemoval, setWhiteGlovePackagingRemoval] = useState(false);
  const [whiteGloveAssembly, setWhiteGloveAssembly] = useState(false);

  // Form Submission Status
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  // Accordion Toggle
  const [openSection, setOpenSection] = useState('handling'); // 'handling' | 'whiteglove'



  // Debounced auto-distance calculation
  useEffect(() => {
    if (!pickupAddress || !dropoffAddress || isManualDistance) return;

    const timer = setTimeout(() => {
      calculateDistance(pickupAddress, dropoffAddress);
    }, 1200); // Trigger 1.2s after user stops typing

    return () => clearTimeout(timer);
  }, [pickupAddress, dropoffAddress, isManualDistance]);

  const calculateDistance = async (fromAddr, toAddr) => {
    setIsCalculatingRoute(true);
    setRouteError('');

    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    // Helper: Remove apartment/suite details which throw off the Nominatim geocoder
    const cleanAddress = (addr) => {
      let cleaned = addr;
      // Remove prefixes like Apt, Ste, Suite, Unit, Bldg, # followed by numbers/letters/hyphens
      cleaned = cleaned.replace(/(?:apt|apartment|suite|ste|unit|bldg|building|floor|fl|#)\s*[\w\d\-]+/gi, '');
      // Clean double commas, extra spaces, and spaces before commas
      cleaned = cleaned.replace(/,\s*,/g, ',');
      cleaned = cleaned.replace(/\s+,\s*/g, ', ');
      cleaned = cleaned.replace(/\s+/g, ' ');
      cleaned = cleaned.trim().replace(/,\s*$/, '');
      return cleaned;
    };

    const formatAddress = (addr) => {
      const cleaned = cleanAddress(addr);
      const lowercase = cleaned.toLowerCase();
      if (
        !lowercase.includes('orlando') && 
        !lowercase.includes('fl') && 
        !lowercase.includes('florida') &&
        !lowercase.includes('winter park') &&
        !lowercase.includes('kissimmee') &&
        !lowercase.includes('sanford') &&
        !lowercase.includes('oviedo') &&
        !lowercase.includes('apopka') &&
        !lowercase.includes('altamonte')
      ) {
        return `${cleaned}, Orlando, FL`;
      }
      return cleaned;
    };

    // 1. Mapbox Geocoding & Routing Flow (Fully Reliable client-side)
    if (mapboxToken) {
      try {
        const geocode = async (addr) => {
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(formatAddress(addr))}.json?access_token=${mapboxToken}&limit=1`;
          const response = await fetch(url);
          if (!response.ok) throw new Error('Mapbox geocoding failed');
          const data = await response.json();
          if (!data.features || data.features.length === 0) return null;
          const [lon, lat] = data.features[0].center;
          return { lat, lon };
        };

        const p1 = await geocode(fromAddr);
        if (!p1) {
          setRouteError('Could not geocode pickup address.');
          setIsCalculatingRoute(false);
          return;
        }

        const p2 = await geocode(toAddr);
        if (!p2) {
          setRouteError('Could not geocode drop-off address.');
          setIsCalculatingRoute(false);
          return;
        }

        const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${p1.lon},${p1.lat};${p2.lon},${p2.lat}?access_token=${mapboxToken}&overview=false`;
        const routeResponse = await fetch(routeUrl);
        if (!routeResponse.ok) throw new Error('Mapbox directions failed');
        const routeData = await routeResponse.json();

        if (!routeData.routes || routeData.routes.length === 0) {
          setRouteError('No route found.');
          setIsCalculatingRoute(false);
          return;
        }

        const distanceMeters = routeData.routes[0].distance;
        const distanceMiles = distanceMeters * 0.000621371;
        const roundedMiles = Math.max(1, Math.round(distanceMiles * 10) / 10);
        setMiles(roundedMiles);
      } catch (err) {
        console.error('Mapbox API Error:', err);
        setRouteError('Mapbox calculation failed. Enter distance manually.');
      } finally {
        setIsCalculatingRoute(false);
      }
      return;
    }

    // 2. Fallback: OpenStreetMap (Nominatim + OSRM)
    try {
      const geocode = async (addr) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(formatAddress(addr))}`;
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Geocoding search failed');
        const data = await response.json();
        if (!data || data.length === 0) return null;
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      };

      const p1 = await geocode(fromAddr);
      if (!p1) {
        setRouteError('Could not geocode pickup address.');
        setIsCalculatingRoute(false);
        return;
      }

      const p2 = await geocode(toAddr);
      if (!p2) {
        setRouteError('Could not geocode drop-off address.');
        setIsCalculatingRoute(false);
        return;
      }

      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${p1.lon},${p1.lat};${p2.lon},${p2.lat}?overview=false`;
      const routeResponse = await fetch(routeUrl);
      if (!routeResponse.ok) throw new Error('Routing call failed');
      const routeData = await routeResponse.json();

      if (!routeData.routes || routeData.routes.length === 0) {
        setRouteError('No drivable path found.');
        setIsCalculatingRoute(false);
        return;
      }

      const distanceMeters = routeData.routes[0].distance;
      const distanceMiles = distanceMeters * 0.000621371;
      const roundedMiles = Math.max(1, Math.round(distanceMiles * 10) / 10);
      setMiles(roundedMiles);
    } catch (err) {
      console.warn('Distance calculation error:', err.message);
      setRouteError('Could not calculate mileage. Please enter manually.');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Autocomplete Suggestions Fetcher & Event Handlers
  const fetchSuggestions = async (val, setSuggestions) => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!token || !val || val.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      // Primary: query Mapbox with US country bounds
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${token}&limit=5&autocomplete=true&country=us&bbox=-87.6,24.3,-79.9,31.0`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const items = data.features.map(f => f.place_name);
          setSuggestions(items);
          return;
        }
      }

      // Fallback: nationwide US geocoding without bounding box restriction
      const fallbackUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${token}&limit=5&autocomplete=true&country=us`;
      const fallbackRes = await fetch(fallbackUrl);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (fallbackData.features) {
          setSuggestions(fallbackData.features.map(f => f.place_name));
        }
      }
    } catch (err) {
      console.warn('Mapbox suggestions error:', err);
    }
  };

  const handlePickupChange = (e) => {
    const val = e.target.value;
    setPickupAddress(val);
    fetchSuggestions(val, setPickupSuggestions);
  };

  const handleDropoffChange = (e) => {
    const val = e.target.value;
    setDropoffAddress(val);
    fetchSuggestions(val, setDropoffSuggestions);
  };



  // Pricing Logic Calculation
  const quoteResult = useMemo(() => {
    // 1. Mileage Base Rate
    let mileageCost = 0;
    if (miles <= 5) mileageCost = 35;
    else if (miles <= 10) mileageCost = 45;
    else if (miles <= 15) mileageCost = 55;
    else if (miles <= 20) mileageCost = 65;
    else if (miles <= 30) mileageCost = 80;
    else if (miles <= 40) mileageCost = 100;
    else if (miles <= 50) mileageCost = 120;
    else mileageCost = Math.max(120, miles * 1.75);

    // 2. Weight Surcharge
    let weightCost = 0;
    let customWeight = false;
    if (weightRange === 'over-1000') {
      customWeight = true;
    } else {
      const weightMap = {
        '0-25': 0,
        '26-50': 10,
        '51-100': 20,
        '101-200': 35,
        '201-300': 50,
        '301-500': 75,
        '501-1000': 125,
      };
      weightCost = weightMap[weightRange] ?? 0;
    }

    // 3. Handling & Labor
    let laborCost = 0;
    if (driverAssistance === 'assist') laborCost += 25;
    if (driverAssistance === 'full') laborCost += 50;

    if (heavyHandling === 'light') laborCost += 25;
    if (heavyHandling === 'medium') laborCost += 50;
    if (heavyHandling === 'heavy') laborCost += 75;

    if (stairsCount > 0) laborCost += stairsCount * 15;

    if (waitTimeMinutes > 15) {
      const extraTime = waitTimeMinutes - 15;
      laborCost += Math.ceil(extraTime / 15) * 15;
    }

    // 4. White Glove Add-ons
    let whiteGloveCost = 0;
    let customAssembly = false;

    if (whiteGloveBasic) whiteGloveCost += 50;
    if (whiteGloveRoomPlacement) whiteGloveCost += 75;
    if (whiteGloveHeavyBulky) whiteGloveCost += 100;
    if (whiteGloveTwoPerson) whiteGloveCost += 150;
    if (whiteGloveStairsCount > 0) whiteGloveCost += whiteGloveStairsCount * 20;
    if (whiteGlovePackagingRemoval) whiteGloveCost += 25;
    if (whiteGloveAssembly) {
      customAssembly = true;
    }

    const subtotal = mileageCost + weightCost + laborCost + whiteGloveCost;

    // Calculate Service Level Surcharges
    let serviceSurcharge = 0;
    if (serviceLevel === 'priority') {
      serviceSurcharge = Math.max(25, subtotal * 0.25);
    } else if (serviceLevel === 'after-hours') {
      serviceSurcharge = subtotal * 0.40;
    }

    const isCustom = customWeight || customAssembly;
    const total = isCustom ? null : subtotal + serviceSurcharge;

    return {
      total: total !== null ? Math.round(total) : null,
      isCustom,
      breakdown: {
        mileage: mileageCost,
        weight: weightCost,
        labor: laborCost,
        whiteGlove: whiteGloveCost,
        serviceSurcharge: Math.round(serviceSurcharge)
      }
    };
  }, [
    miles, weightRange, serviceLevel, driverAssistance, heavyHandling, stairsCount,
    waitTimeMinutes, whiteGloveBasic,
    whiteGloveRoomPlacement, whiteGloveHeavyBulky, whiteGloveTwoPerson,
    whiteGloveStairsCount, whiteGlovePackagingRemoval, whiteGloveAssembly
  ]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log('handleSubmit: Triggered');
      setSubmitStatus('sending');

      const formattedWeight = {
        '0-25': '0-25 lb (Included)',
        '26-50': '26-50 lb (+$10)',
        '51-100': '51-100 lb (+$20)',
        '101-200': '101-200 lb (+$35)',
        '201-300': '201-300 lb (+$50)',
        '301-500': '301-500 lb (+$75)',
        '501-1000': '501-1,000 lb (+$125)',
        'over-1000': 'Over 1,000 lb (Custom Quote)',
      }[weightRange];

      // Build text payload for Formspree to bypass free tier file upload restrictions
      const textPayload = {
        name,
        email,
        phone,
        pickupAddress,
        dropoffAddress,
        serviceDate,
        deliveryDistanceMiles: `${miles} miles`,
        weightCategory: formattedWeight,
        serviceLevel,
        driverAssistance,
        heavyHandling,
        stairsFlights: stairsCount,
        waitTimeAfter15Mins: `${waitTimeMinutes} mins`,
        whiteGloveBasic: whiteGloveBasic ? 'Yes' : 'No',
        whiteGloveRoomPlacement: whiteGloveRoomPlacement ? 'Yes' : 'No',
        whiteGloveHeavyBulky: whiteGloveHeavyBulky ? 'Yes' : 'No',
        whiteGloveTwoPerson: whiteGloveTwoPerson ? 'Yes' : 'No',
        whiteGloveStairsFlights: whiteGloveStairsCount,
        whiteGlovePackagingRemoval: whiteGlovePackagingRemoval ? 'Yes' : 'No',
        whiteGloveAssemblySetup: whiteGloveAssembly ? 'Yes (Custom Quote)' : 'No',
        estimatedQuote: quoteResult.isCustom ? 'Custom Quote Required' : `$${quoteResult.total}`
      };

      console.log('handleSubmit: Payload prepared', textPayload);

      // 4-second AbortController timeout for Formspree requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      try {
        console.log('handleSubmit: Fetching Formspree...');
        const res = await fetch("https://formspree.io/f/xojrlgll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(textPayload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        console.log('handleSubmit: Formspree response status', res.status);
        
        if (!res.ok) console.warn('Formspree returned status error, proceeding to WhatsApp anyway.');
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn('Formspree log timed out or was blocked. Redirecting client to WhatsApp:', err.message);
      }

      // Always succeed and redirect to WhatsApp
      setSubmitStatus('success');

      // WhatsApp Direct Redirect
      const waPhone = "13862155963";
      const laborSummary = [];
      if (driverAssistance !== 'none') laborSummary.push(`Assistance: ${driverAssistance}`);
      if (heavyHandling !== 'none') laborSummary.push(`Heavy handling: ${heavyHandling}`);
      if (stairsCount > 0) laborSummary.push(`Stairs: ${stairsCount} flights`);
      if (waitTimeMinutes > 0) laborSummary.push(`Wait: ${waitTimeMinutes}m`);

      const wgSummary = [];
      if (whiteGloveBasic) wgSummary.push('Basic WG');
      if (whiteGloveRoomPlacement) wgSummary.push('Room placement');
      if (whiteGloveHeavyBulky) wgSummary.push('Heavy/bulky');
      if (whiteGloveTwoPerson) wgSummary.push('2-man WG');
      if (whiteGloveStairsCount > 0) wgSummary.push(`Stairs (WG): ${whiteGloveStairsCount} fl`);
      if (whiteGlovePackagingRemoval) wgSummary.push('Trash removal');
      if (whiteGloveAssembly) wgSummary.push('Assembly');

      const waText = encodeURIComponent(
        `🚛 *NEW DELIVERY QUOTE REQUEST — 12 NATIONWIDE*\n\n` +
        `👤 *Client Name:* ${name}\n` +
        `📅 *Service Date:* ${serviceDate}\n` +
        `📞 *Phone:* ${phone}\n` +
        `✉️ *Email:* ${email}\n\n` +
        `📍 *Pickup:* ${pickupAddress}\n` +
        `🏁 *Drop-off:* ${dropoffAddress}\n\n` +
        `📏 *Computed Distance:* ${miles} miles\n` +
        `📦 *Weight Category:* ${formattedWeight}\n` +
        `${laborSummary.length > 0 ? `🛠️ *Handling:* ${laborSummary.join(', ')}\n` : ''}` +
        `${wgSummary.length > 0 ? `👑 *White-Glove:* ${wgSummary.join(', ')}\n` : ''}\n` +
        `⚡ *Service Level:* ${serviceLevel === 'after-hours' ? 'After-Hours / Emergency (+40%)' : serviceLevel === 'priority' ? 'Priority Delivery (+25%)' : 'Scheduled Delivery'}\n\n` +
        `💰 *ESTIMATED PRICE:* ${quoteResult.isCustom ? 'Custom Quote Required' : `$${quoteResult.total}`}\n\n` +
        `_Note: Price is estimated and subject to review of cargo specifications._`
      );

      console.log('handleSubmit: Redirecting to WhatsApp...');
      // Reset button after 3.5 seconds
      setTimeout(() => setSubmitStatus('idle'), 3500);

      // Use window.location.href to guarantee redirect works inside asynchronous callbacks without popup-blocker issues
      window.location.href = `https://wa.me/${waPhone}?text=${waText}`;
    } catch (fatalErr) {
      alert('SUBMISSION FATAL ERROR: ' + fatalErr.message);
      console.error('Fatal submission error:', fatalErr);
      setSubmitStatus('error');
    }
  };

  return (
    <section id="contact" className="bg-linear-to-br from-brand-bg to-[#12141a] px-6 md:px-[60px] py-[100px] border-t border-brand-card-border">
      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* Section Header (Full width on all screens) */}
        <div className="text-left max-w-2xl">
          <div className="font-display font-bold text-[12px] tracking-[3px] uppercase text-brand-cyan mb-3.5">
            Instant Quote Engine
          </div>
          <h2 className="font-display font-black text-[clamp(32px,4vw,54px)] uppercase text-brand-white mb-5 leading-none">
            Calculate Your <em className="not-italic text-brand-accent">Delivery Rate</em>
          </h2>
          <p className="text-[14px] leading-[1.8] text-white/55">
            Enter your route locations. Distance and rates calculate automatically. Complete the form to submit email records and message dispatch directly.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-12 lg:gap-20 items-start">
          
          {/* LEFT COLUMN: LIVE ESTIMATOR CARD */}
          <div className="lg:sticky lg:top-24 order-2 lg:order-1">
            {/* DYNAMIC CALCULATION CARD */}
            <div className="bg-brand-card border border-brand-card-border p-8 rounded-xl shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="border-b border-white/5 pb-4">
              <span className="text-white/40 text-[10px] font-display font-bold uppercase tracking-widest block mb-1">Estimated Route Rate</span>
              <div className="flex items-baseline gap-2">
                {quoteResult.isCustom ? (
                  <span className="text-2xl md:text-3xl font-display font-black text-brand-cyan uppercase">Custom Quote Required</span>
                ) : (
                  <>
                    <span className="text-5xl md:text-6xl font-display font-black text-brand-accent">${quoteResult.total}</span>
                    <span className="text-white/30 text-xs font-semibold">Est. Total</span>
                  </>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            {!quoteResult.isCustom && (
              <div className="space-y-3.5 text-sm border-b border-white/5 pb-6">
                <div className="flex justify-between items-center text-white/60">
                  <span>Base Mileage ({miles} mi):</span>
                  <span className="font-mono text-brand-white">${quoteResult.breakdown.mileage}</span>
                </div>
                <div className="flex justify-between items-center text-white/60">
                  <span>Weight Surcharge:</span>
                  <span className="font-mono text-brand-white">${quoteResult.breakdown.weight}</span>
                </div>
                <div className="flex justify-between items-center text-white/60">
                  <span>Handling & Labor:</span>
                  <span className="font-mono text-brand-white">${quoteResult.breakdown.labor}</span>
                </div>
                <div className="flex justify-between items-center text-white/60">
                  <span>White-Glove Add-ons:</span>
                  <span className="font-mono text-brand-white">${quoteResult.breakdown.whiteGlove}</span>
                </div>
                {quoteResult.breakdown.serviceSurcharge > 0 && (
                  <div className="flex justify-between items-center text-brand-accent font-semibold">
                    <span>{serviceLevel === 'priority' ? 'Priority Fee (+25%):' : 'After-Hours Fee (+40%):'}</span>
                    <span className="font-mono">${quoteResult.breakdown.serviceSurcharge}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quick Summary Badges */}
            <div className="space-y-2">
              <span className="text-white/30 text-[10px] font-display font-bold uppercase tracking-widest block font-mono">Route Manifest Details</span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-white/5 border border-white/10 px-2.5 py-1 text-white/70 rounded-full font-medium">
                  {miles} miles
                </span>
                <span className="bg-white/5 border border-white/10 px-2.5 py-1 text-white/70 rounded-full font-medium font-mono">
                  Weight: {weightRange} lbs
                </span>
                <span className="bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-1 text-brand-accent rounded-full font-medium capitalize">
                  {serviceLevel === 'after-hours' ? '🌙 After Hours' : serviceLevel === 'priority' ? '⭐ Priority' : '🚚 Scheduled'}
                </span>
                {driverAssistance !== 'none' && (
                  <span className="bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-1 text-brand-cyan rounded-full font-medium font-mono">
                    Assistance: {driverAssistance}
                  </span>
                )}
                {whiteGloveBasic && (
                  <span className="bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-1 text-brand-accent rounded-full font-medium">
                    White Glove Active
                  </span>
                )}
                {whiteGloveAssembly && (
                  <span className="bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-red-400 rounded-full font-medium">
                    Custom Assembly Needed
                  </span>
                )}
              </div>
            </div>

            <div className="text-[11px] text-white/30 italic space-y-2 text-left">
              <p>*Tolls, parking, and multi-point stops will be confirmed upon pickup. Rates cover curbside logistics unless white-glove is requested.</p>
              <p className="border-t border-white/5 pt-2 text-white/40">
                <strong className="text-brand-accent uppercase text-[9px] tracking-wider block font-display mb-0.5 font-bold">Availability Disclaimer:</strong>
                Priority and After-Hours services are subject to driver availability. We will always provide the earliest available pickup time before confirming your order.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE FORM & CALCULATOR CONTROLS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-card border border-brand-card-border rounded-2xl p-6 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.4)] text-left order-1 lg:order-2"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: CONTACT DETAILS */}
            <div className="space-y-4">
              <h3 className="font-display font-black text-lg uppercase tracking-wider text-brand-cyan border-b border-white/5 pb-2">
                1. Customer & Cargo Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55">Name *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} type="text" required placeholder="Your full name" className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55">Email *</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="your@email.com" className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55">Phone Number *</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required placeholder="(555) 000-0000" className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" />
                </div>
                
                {/* Datepicker */}
                <div className="space-y-2">
                  <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55">Delivery Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={serviceDate} 
                    onChange={(e) => setServiceDate(e.target.value)} 
                    className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pickup Autocomplete */}
                <div className="space-y-2 relative z-30">
                  <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55">Pickup Address *</label>
                  <input 
                    value={pickupAddress} 
                    onChange={handlePickupChange} 
                    onFocus={() => {
                      if (pickupAddress.trim().length >= 2) fetchSuggestions(pickupAddress, setPickupSuggestions);
                    }}
                    onBlur={() => setTimeout(() => setPickupSuggestions([]), 350)}
                    type="text" 
                    required 
                    placeholder="Street, City, State" 
                    className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" 
                  />
                  <AnimatePresence>
                    {pickupSuggestions.length > 0 && (
                      <motion.ul 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute left-0 right-0 z-[999] mt-1 bg-[#2E3440] border border-white/20 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden divide-y divide-white/10 max-h-[220px] overflow-y-auto"
                      >
                        {pickupSuggestions.map((item, idx) => (
                          <li 
                            key={idx} 
                            onMouseDown={(e) => e.preventDefault()}
                            onTouchStart={(e) => {
                              e.preventDefault();
                              setPickupAddress(item);
                              setPickupSuggestions([]);
                              calculateDistance(item, dropoffAddress);
                            }}
                            onClick={() => {
                              setPickupAddress(item);
                              setPickupSuggestions([]);
                              calculateDistance(item, dropoffAddress);
                            }}
                            className="p-[12px_16px] text-xs text-white hover:bg-brand-accent hover:text-brand-bg active:bg-brand-accent active:text-brand-bg font-medium cursor-pointer transition-colors text-left"
                          >
                            {item}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Drop-off Autocomplete */}
                <div className="space-y-2 relative z-20">
                  <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55">Drop-off Address *</label>
                  <input 
                    value={dropoffAddress} 
                    onChange={handleDropoffChange} 
                    onFocus={() => {
                      if (dropoffAddress.trim().length >= 2) fetchSuggestions(dropoffAddress, setDropoffSuggestions);
                    }}
                    onBlur={() => setTimeout(() => setDropoffSuggestions([]), 350)}
                    type="text" 
                    required 
                    placeholder="Street, City, State" 
                    className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent focus:shadow-[0_0_12px_rgba(255,215,0,0.15)] transition-all" 
                  />
                  <AnimatePresence>
                    {dropoffSuggestions.length > 0 && (
                      <motion.ul 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute left-0 right-0 z-[999] mt-1 bg-[#2E3440] border border-white/20 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden divide-y divide-white/10 max-h-[220px] overflow-y-auto"
                      >
                        {dropoffSuggestions.map((item, idx) => (
                          <li 
                            key={idx} 
                            onMouseDown={(e) => e.preventDefault()}
                            onTouchStart={(e) => {
                              e.preventDefault();
                              setDropoffAddress(item);
                              setDropoffSuggestions([]);
                              calculateDistance(pickupAddress, item);
                            }}
                            onClick={() => {
                              setDropoffAddress(item);
                              setDropoffSuggestions([]);
                              calculateDistance(pickupAddress, item);
                            }}
                            className="p-[12px_16px] text-xs text-white hover:bg-brand-accent hover:text-brand-bg active:bg-brand-accent active:text-brand-bg font-medium cursor-pointer transition-colors text-left"
                          >
                            {item}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* STEP 2: ROUTE METRICS */}
            <div className="space-y-6">
              <h3 className="font-display font-black text-lg uppercase tracking-wider text-brand-cyan border-b border-white/5 pb-2">
                2. Route & Weight Matrix
              </h3>

              {/* Distance Auto-Calculation Status */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-display font-bold uppercase tracking-wider text-white/70">
                  <span>Delivery Distance:</span>
                  <div className="flex items-center gap-2">
                    {isCalculatingRoute ? (
                      <span className="text-brand-cyan text-xs animate-pulse font-semibold">Calculating route...</span>
                    ) : routeError ? (
                      <span className="text-red-400 text-[10px] font-semibold">{routeError}</span>
                    ) : (
                      <span className="text-brand-accent text-lg font-mono">{miles} Miles</span>
                    )}
                  </div>
                </div>

                {isManualDistance ? (
                  <div className="space-y-2">
                    <input 
                      type="number" 
                      min="1"
                      value={miles}
                      onChange={(e) => setMiles(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-brand-bg/70 border border-white/12 p-[12px_14px] text-sm text-brand-white outline-none rounded-lg focus:border-brand-accent transition-all font-mono"
                    />
                    <button 
                      type="button" 
                      onClick={() => setIsManualDistance(false)}
                      className="text-[10px] text-brand-cyan font-bold uppercase tracking-wider hover:underline"
                    >
                      Use Auto-Calculator
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-3.5 rounded-lg text-xs">
                    <span className="text-white/40">Computed automatically from addresses.</span>
                    <button 
                      type="button" 
                      onClick={() => setIsManualDistance(true)}
                      className="text-brand-accent font-bold uppercase tracking-wider hover:underline font-mono"
                    >
                      ✏️ Edit Manually
                    </button>
                  </div>
                )}
              </div>

              {/* Weight Selector */}
              <div className="space-y-2">
                <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Shipment Weight *</label>
                <select 
                  value={weightRange} 
                  onChange={(e) => setWeightRange(e.target.value)}
                  className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent transition-all"
                >
                  <option value="0-25">0–25 lb (Included)</option>
                  <option value="26-50">26–50 lb (+$10)</option>
                  <option value="51-100">51–100 lb (+$20)</option>
                  <option value="101-200">101–200 lb (+$35)</option>
                  <option value="201-300">201–300 lb (+$50)</option>
                  <option value="301-500">301–500 lb (+$75)</option>
                  <option value="501-1000">501–1,000 lb (+$125)</option>
                  <option value="over-1000">Over 1,000 lb (Custom Quote)</option>
                </select>
              </div>

              {/* Service Level Selector */}
              <div className="space-y-2">
                <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Service Level *</label>
                <select 
                  value={serviceLevel} 
                  onChange={(e) => setServiceLevel(e.target.value)}
                  className="w-full bg-brand-bg/70 border border-white/12 p-[14px_16px] font-body text-[14px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent transition-all"
                >
                  <option value="scheduled">🚚 Scheduled Delivery (Best Value)</option>
                  <option value="priority">⭐ Priority Delivery (+25% Priority Fee)</option>
                  <option value="after-hours">🌙 After-Hours / Emergency (+40% Fee)</option>
                </select>
              </div>
            </div>

            {/* STEP 3: ACCORDION EXTRA LOGISTICS */}
            <div className="space-y-3">
              <h3 className="font-display font-black text-lg uppercase tracking-wider text-brand-cyan border-b border-white/5 pb-2">
                3. Premium Handling & Options
              </h3>

              {/* ACCORDION TRIGGER TABS */}
              <div className="flex border-b border-white/5 text-sm font-display font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setOpenSection('handling')}
                  className={`flex-1 py-3 text-center border-b-2 transition-all ${openSection === 'handling' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-white/40'}`}
                >
                  Handling & Labor
                </button>
                <button
                  type="button"
                  onClick={() => setOpenSection('whiteglove')}
                  className={`flex-1 py-3 text-center border-b-2 transition-all ${openSection === 'whiteglove' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-white/40'}`}
                >
                  White-Glove Services
                </button>
              </div>

              {/* SECTION: HANDLING & LABOR */}
              <div className="pt-4">
                {openSection === 'handling' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Driver Assistance Level */}
                    <div className="space-y-2">
                      <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Assistance Required</label>
                      <select 
                        value={driverAssistance} 
                        onChange={(e) => setDriverAssistance(e.target.value)}
                        className="w-full bg-brand-bg/70 border border-white/12 p-[12px_14px] font-body text-[13px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent transition-all"
                      >
                        <option value="none">Customer Loads & Unloads (Included)</option>
                        <option value="assist">Driver Assists at One Location (+$25)</option>
                        <option value="full">Driver Fully Loads/Unloads One Location (+$50)</option>
                      </select>
                    </div>

                    {/* Heavy/Awkward Item Handling */}
                    <div className="space-y-2">
                      <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Item Bulkiness</label>
                      <select 
                        value={heavyHandling} 
                        onChange={(e) => setHeavyHandling(e.target.value)}
                        className="w-full bg-brand-bg/70 border border-white/12 p-[12px_14px] font-body text-[13px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent transition-all"
                      >
                        <option value="none">Standard Packaging (Included)</option>
                        <option value="light">Light Awkward Item (+$25)</option>
                        <option value="medium">Medium / Large Awkward Item (+$50)</option>
                        <option value="heavy">Heavy / Difficult Item (+$75)</option>
                      </select>
                    </div>



                    {/* Numerical Inputs (Stairs & Wait Time) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Flights of Stairs</label>
                        <input 
                          type="number" 
                          min="0" 
                          value={stairsCount} 
                          onChange={(e) => setStairsCount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-brand-bg/70 border border-white/12 p-[12px_14px] font-body text-[13px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent transition-all font-mono"
                        />
                        <span className="text-[10px] text-white/30 font-semibold font-mono block">+ $15 per flight</span>
                      </div>
                      <div className="space-y-2">
                        <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono">Wait Time (Minutes)</label>
                        <input 
                          type="number" 
                          min="0" 
                          step="15" 
                          value={waitTimeMinutes} 
                          onChange={(e) => setWaitTimeMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-brand-bg/70 border border-white/12 p-[12px_14px] font-body text-[13px] text-brand-white outline-none rounded-[6px] focus:border-brand-accent transition-all font-mono"
                        />
                        <span className="text-[10px] text-white/30 font-semibold font-mono block">+ $15 per 15 mins (first 15m free)</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SECTION: WHITE-GLOVE SERVICES */}
                {openSection === 'whiteglove' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Basic White Glove */}
                      <label className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-lg cursor-pointer hover:bg-white/10 transition-all select-none">
                        <input 
                          type="checkbox" 
                          checked={whiteGloveBasic} 
                          onChange={(e) => setWhiteGloveBasic(e.target.checked)}
                          className="accent-brand-cyan w-4 h-4 cursor-pointer"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-brand-white font-display uppercase tracking-wider">Basic White-Glove Care</span>
                          <span className="text-[10px] text-white/40">+$50 · Premium packaging inspection & soft wrapping</span>
                        </div>
                      </label>

                      {/* Inside Delivery & Room placement */}
                      <label className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-lg cursor-pointer hover:bg-white/10 transition-all select-none">
                        <input 
                          type="checkbox" 
                          checked={whiteGloveRoomPlacement} 
                          onChange={(e) => setWhiteGloveRoomPlacement(e.target.checked)}
                          className="accent-brand-cyan w-4 h-4 cursor-pointer"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-brand-white font-display uppercase tracking-wider">Room Placement Inside</span>
                          <span className="text-[10px] text-white/40">+$75 · Placement of choice inside room / building</span>
                        </div>
                      </label>

                      {/* Heavy bulky item WG */}
                      <label className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-lg cursor-pointer hover:bg-white/10 transition-all select-none">
                        <input 
                          type="checkbox" 
                          checked={whiteGloveHeavyBulky} 
                          onChange={(e) => setWhiteGloveHeavyBulky(e.target.checked)}
                          className="accent-brand-cyan w-4 h-4 cursor-pointer"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-brand-white font-display uppercase tracking-wider">Heavy / Bulky Handling</span>
                          <span className="text-[10px] text-white/40">+$100 · Oversized machinery, safes, heavy furniture</span>
                        </div>
                      </label>

                      {/* Two person WG */}
                      <label className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-lg cursor-pointer hover:bg-white/10 transition-all select-none">
                        <input 
                          type="checkbox" 
                          checked={whiteGloveTwoPerson} 
                          onChange={(e) => setWhiteGloveTwoPerson(e.target.checked)}
                          className="accent-brand-cyan w-4 h-4 cursor-pointer"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-brand-white font-display uppercase tracking-wider">Two-Person White-Glove Team</span>
                          <span className="text-[10px] text-white/40">+$150 · Professional two-man team setup</span>
                        </div>
                      </label>

                      {/* Packaging removal */}
                      <label className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-lg cursor-pointer hover:bg-white/10 transition-all select-none">
                        <input 
                          type="checkbox" 
                          checked={whiteGlovePackagingRemoval} 
                          onChange={(e) => setWhiteGlovePackagingRemoval(e.target.checked)}
                          className="accent-brand-cyan w-4 h-4 cursor-pointer"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-brand-white font-display uppercase tracking-wider">Debris / Packaging Removal</span>
                          <span className="text-[10px] text-white/40">+$25 · Debris haul-away after unboxing</span>
                        </div>
                      </label>

                      {/* Assembly / setup - Triggers Custom */}
                      <label className="flex items-center gap-3 bg-white/5 border border-red-500/20 p-3.5 rounded-lg cursor-pointer hover:bg-red-500/10 transition-all select-none">
                        <input 
                          type="checkbox" 
                          checked={whiteGloveAssembly} 
                          onChange={(e) => setWhiteGloveAssembly(e.target.checked)}
                          className="accent-red-500 w-4 h-4 cursor-pointer"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-red-400 font-display uppercase tracking-wider">Assembly & Technical Setup</span>
                          <span className="text-[10px] text-red-400/60 font-mono">Requires Custom Quote · Assembly of office furniture/gym equipment</span>
                        </div>
                      </label>
                    </div>

                    {/* WG Stairs Count */}
                    <div className="space-y-2">
                      <label className="block font-display font-bold text-[11px] tracking-[1.5px] uppercase text-white/55 font-mono font-mono">White-Glove Stairs Flight Count</label>
                      <input 
                        type="number" 
                        min="0" 
                        value={whiteGloveStairsCount} 
                        onChange={(e) => setWhiteGloveStairsCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-brand-bg/70 border border-white/12 p-[12px_14px] font-body text-[13px] text-brand-white outline-none rounded-[6px] focus:border-brand-cyan transition-all font-mono"
                      />
                      <span className="text-[10px] text-white/30 font-semibold font-mono block">+ $20 per flight</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* STATUS AND SUBMIT */}
            <div className="space-y-4 pt-4 border-t border-white/5 font-display font-bold">
              <button 
                type="submit" 
                disabled={submitStatus === 'sending' || isCalculatingRoute}
                className="w-full bg-brand-accent text-brand-bg font-black text-base tracking-[2.5px] uppercase py-[20px] rounded-lg shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:bg-[#ffe44d] hover:shadow-[0_0_36px_rgba(255,215,0,0.5)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {submitStatus === 'sending' ? 'Registering Route...' : 'Request Delivery (Submit & WhatsApp)'}
              </button>

              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="text-brand-cyan font-bold text-center text-xs tracking-wider uppercase"
                  >
                    ✓ Quote request logged. Launching WhatsApp...
                  </motion.p>
                )}
                {submitStatus === 'error' && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="text-red-400 font-bold text-center text-xs tracking-wider uppercase"
                  >
                    ⚠️ Submit error. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  </section>
  );
}
