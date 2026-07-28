// 12 Nationwide LLC Quote Storage & Admin Data Service
import { DEFAULT_PRICING_CONFIG } from './pricingEngine';

const QUOTES_STORAGE_KEY = '12NW_QUOTES_LIST';
const PRICING_CONFIG_KEY = '12NW_PRICING_CONFIG';
const ADMIN_PIN_KEY = '12NW_ADMIN_PIN';

const DEFAULT_ADMIN_PIN = '212789';

// Initial Mock/Sample Quotes for Admin Dashboard demonstration
const SAMPLE_QUOTES = [
  {
    quoteNumber: '12N-20260728-9041',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    customer: {
      name: 'Marcus Vance',
      phone: '(407) 555-0192',
      email: 'm.vance@example.com',
      preferredDate: '2026-07-30',
      preferredTime: 'Morning (8am - 12pm)',
      instructions: 'Gate code #4921. Call on arrival.'
    },
    pickup: {
      address: '1400 Orange Ave',
      city: 'Orlando',
      zip: '32801',
      locationType: 'Apartment',
      floor: 3,
      elevator: true,
      gateCode: '4921'
    },
    delivery: {
      address: '450 S Kirkman Rd',
      city: 'Orlando',
      zip: '32811',
      locationType: 'House',
      floor: 1,
      elevator: false
    },
    service: 'Furniture Delivery',
    vehicle: 'Sprinter Van',
    deliveryTeam: 'Driver + One Helper',
    items: [
      { type: '3-Seater Leather Sofa', quantity: 1, weight: 210, requiresTwoPeople: true, over300lbs: false }
    ],
    pricingBreakdown: {
      estimatedDistanceMiles: 8.4,
      estimatedDriveTimeMins: 22,
      basePrice: 89,
      mileageCharge: 0,
      vehicleCharge: 45,
      laborCharges: 65,
      surcharges: 0,
      estimatedTotal: 199.00
    },
    status: 'New'
  },
  {
    quoteNumber: '12N-20260727-8103',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    customer: {
      name: 'Sarah Jenkins',
      phone: '(321) 555-0842',
      email: 'sjenkins@corporate.com',
      preferredDate: '2026-08-01',
      preferredTime: 'Afternoon (12pm - 4pm)',
      instructions: 'Loading dock in the rear.'
    },
    pickup: {
      address: '7000 Universal Blvd',
      city: 'Orlando',
      zip: '32819',
      locationType: 'Warehouse',
      floor: 1,
      elevator: false
    },
    delivery: {
      address: '1200 International Dr',
      city: 'Orlando',
      zip: '32819',
      locationType: 'Business',
      floor: 2,
      elevator: true
    },
    service: 'Commercial Delivery',
    vehicle: '26-Foot Box Truck',
    deliveryTeam: 'Driver + One Helper',
    items: [
      { type: 'Palletized Displays', quantity: 4, weight: 1400, requiresTwoPeople: true, over300lbs: true }
    ],
    pricingBreakdown: {
      estimatedDistanceMiles: 14.2,
      estimatedDriveTimeMins: 28,
      basePrice: 179,
      mileageCharge: 11.55,
      vehicleCharge: 120,
      laborCharges: 115,
      surcharges: 50,
      estimatedTotal: 475.55
    },
    status: 'Scheduled'
  }
];

/**
 * Gets all saved quotes from storage.
 */
export function getAllQuotes() {
  if (typeof window === 'undefined') return SAMPLE_QUOTES;
  try {
    const raw = localStorage.getItem(QUOTES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(SAMPLE_QUOTES));
      return SAMPLE_QUOTES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read quotes from localStorage:', err);
    return SAMPLE_QUOTES;
  }
}

/**
 * Saves a new quote to storage and returns the generated quote record.
 */
export function saveQuote(quoteData) {
  const quotes = getAllQuotes();
  
  // Generate unique Quote Number: 12N-YYYYMMDD-XXXX
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const quoteNumber = `12N-${todayStr}-${randomSuffix}`;

  const newRecord = {
    ...quoteData,
    quoteNumber,
    timestamp: new Date().toISOString(),
    status: 'New'
  };

  const updated = [newRecord, ...quotes];
  try {
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save quote to localStorage:', err);
  }

  return newRecord;
}

/**
 * Updates the status of a quote.
 */
export function updateQuoteStatus(quoteNumber, newStatus) {
  const quotes = getAllQuotes();
  const updated = quotes.map(q => q.quoteNumber === quoteNumber ? { ...q, status: newStatus } : q);
  try {
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update quote status:', err);
  }
  return updated;
}

/**
 * Retrieves the current Admin Pricing Configuration.
 */
export function getPricingConfig() {
  if (typeof window === 'undefined') return DEFAULT_PRICING_CONFIG;
  try {
    const raw = localStorage.getItem(PRICING_CONFIG_KEY);
    if (!raw) return DEFAULT_PRICING_CONFIG;
    return { ...DEFAULT_PRICING_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_PRICING_CONFIG;
  }
}

/**
 * Saves updated pricing configuration.
 */
export function savePricingConfig(newConfig) {
  try {
    localStorage.setItem(PRICING_CONFIG_KEY, JSON.stringify(newConfig));
  } catch (err) {
    console.error('Failed to save pricing config:', err);
  }
}

/**
 * Resets pricing configuration to system defaults.
 */
export function resetPricingConfig() {
  try {
    localStorage.removeItem(PRICING_CONFIG_KEY);
  } catch (err) {}
  return DEFAULT_PRICING_CONFIG;
}

/**
 * Gets active Admin PIN passcode.
 */
export function getAdminPin() {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PIN;
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_ADMIN_PIN;
}

/**
 * Updates Admin PIN passcode.
 */
export function setAdminPin(newPin) {
  try {
    localStorage.setItem(ADMIN_PIN_KEY, newPin);
  } catch (err) {}
}

/**
 * Exports quotes array to CSV format.
 */
export function exportQuotesToCSV(quotesList) {
  if (!quotesList || quotesList.length === 0) return;

  const headers = [
    'Quote Number',
    'Date & Time',
    'Customer Name',
    'Phone',
    'Email',
    'Service',
    'Vehicle',
    'Delivery Team',
    'Pickup Address',
    'Delivery Address',
    'Est. Distance (mi)',
    'Est. Total ($)',
    'Status'
  ];

  const rows = quotesList.map(q => [
    `"${q.quoteNumber || ''}"`,
    `"${new Date(q.timestamp).toLocaleString()}"`,
    `"${q.customer?.name || ''}"`,
    `"${q.customer?.phone || ''}"`,
    `"${q.customer?.email || ''}"`,
    `"${q.service || ''}"`,
    `"${q.vehicle || ''}"`,
    `"${q.deliveryTeam || ''}"`,
    `"${q.pickup?.address || ''}, ${q.pickup?.city || ''}"`,
    `"${q.delivery?.address || ''}, ${q.delivery?.city || ''}"`,
    `"${q.pricingBreakdown?.estimatedDistanceMiles || 0}"`,
    `"${q.pricingBreakdown?.estimatedTotal || 0}"`,
    `"${q.status || 'New'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `12_Nationwide_Quotes_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
