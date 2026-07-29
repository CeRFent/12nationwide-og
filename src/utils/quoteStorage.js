// 12 Nationwide LLC Quote Storage & Admin Data Service
import { DEFAULT_PRICING_CONFIG } from './pricingEngine';

const QUOTES_STORAGE_KEY = '12NW_QUOTES_LIST';
const PRICING_CONFIG_KEY = '12NW_PRICING_CONFIG';
const ADMIN_PIN_KEY = '12NW_ADMIN_PIN';

const DEFAULT_ADMIN_PIN = '212789';

// Empty initial array (no mock data)
const SAMPLE_QUOTES = [];

/**
 * Gets all saved quotes from storage.
 */
export function getAllQuotes() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUOTES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    // Filter out old sample mock quotes if present
    const cleaned = parsed.filter(q => q.customer?.name !== 'Marcus Vance' && q.customer?.name !== 'Sarah Jenkins');
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (err) {
    console.error('Failed to read quotes from localStorage:', err);
    return [];
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
 * Clears all quotes from storage.
 */
export function clearAllQuotes() {
  try {
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify([]));
  } catch (err) {}
  return [];
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
