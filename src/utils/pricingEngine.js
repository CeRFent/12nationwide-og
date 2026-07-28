// 12 Nationwide LLC Pricing Engine & Capacity Evaluator

export const DEFAULT_PRICING_CONFIG = {
  // Service Base Prices ($)
  serviceBasePrices: {
    'Small Item Delivery': 49,
    'Furniture Delivery': 89,
    'Appliance Delivery': 99,
    'Store Pickup & Delivery': 79,
    'Facebook Marketplace Pickup': 69,
    'White Glove Delivery': 149,
    'Small Move': 199,
    'Commercial Delivery': 179,
    'Long-Distance Delivery': 299
  },

  // Distance / Mileage Rates ($)
  baseMilesIncluded: 10,
  ratePerMile: 2.75,
  minimumBaseCharge: 49,

  // Vehicle Pricing Addons ($)
  vehiclePrices: {
    'Cargo Van': 0,
    'Sprinter Van': 45,
    '26-Foot Box Truck': 120
  },

  // Vehicle Payload Capacity (lbs)
  vehiclePayloads: {
    'Cargo Van': 1500,
    'Sprinter Van': 3500,
    '26-Foot Box Truck': 10000
  },

  // Delivery Team Pricing ($)
  teamPrices: {
    'Driver Only': 0,
    'Driver + One Helper': 65
  },

  // Additional Services Pricing ($)
  additionalServicePrices: {
    insidePickup: 25,
    insideDelivery: 25,
    assembly: 45,
    disassembly: 35,
    wrapping: 20,
    additionalStop: 35,
    stairCarryPerFlight: 15,
    waitingTimePerHour: 40,
    sameDaySurcharge: 50,
    rushSurcharge: 95,
    heavyItemFee: 50 // items over 300 lbs
  },

  // Tax Settings (%)
  taxRatePercent: 0
};

/**
 * Recommends appropriate vehicle based on total item weight and special flags.
 */
export function recommendVehicle(items = [], currentVehicle = 'Cargo Van', config = DEFAULT_PRICING_CONFIG) {
  const totalWeight = items.reduce((sum, item) => sum + ((parseFloat(item.weight) || 0) * (parseInt(item.quantity) || 1)), 0);
  const hasHeavyItem = items.some(item => item.over300lbs || (parseFloat(item.weight) || 0) > 300);
  const totalItemCount = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);

  let recommended = 'Cargo Van';

  if (totalWeight > 3500 || totalItemCount > 15) {
    recommended = '26-Foot Box Truck';
  } else if (totalWeight > 1500 || hasHeavyItem || totalItemCount > 6) {
    recommended = 'Sprinter Van';
  }

  const isCurrentUndersized = (config.vehiclePayloads[currentVehicle] || 1500) < totalWeight;

  return {
    recommendedVehicle: recommended,
    totalWeight,
    isCurrentUndersized,
    exceedsCapacity: isCurrentUndersized
  };
}

/**
 * Calculates complete itemized quote details.
 */
export function calculateQuote(formState, config = DEFAULT_PRICING_CONFIG) {
  const {
    service = 'Small Item Delivery',
    miles = 1,
    driveTimeMinutes = 0,
    vehicle = 'Cargo Van',
    deliveryTeam = 'Driver Only',
    items = [],
    additionalServices = {},
    pickupFloor = 1,
    pickupElevator = false,
    deliveryFloor = 1,
    deliveryElevator = false
  } = formState;

  // 1. Base Service Price
  const baseServicePrice = config.serviceBasePrices[service] || config.minimumBaseCharge || 49;

  // 2. Mileage Calculation
  const distance = Math.max(0, parseFloat(miles) || 0);
  const extraMiles = Math.max(0, distance - (config.baseMilesIncluded || 10));
  const mileageCharge = Math.round(extraMiles * (config.ratePerMile || 2.75) * 100) / 100;

  // 3. Vehicle Upgrade Fee
  const vehicleCharge = config.vehiclePrices[vehicle] || 0;

  // 4. Labor / Team Fee
  const teamCharge = config.teamPrices[deliveryTeam] || 0;

  // 5. Stair Carry Fee
  const pickupStairFlights = (!pickupElevator && parseInt(pickupFloor) > 1) ? (parseInt(pickupFloor) - 1) : 0;
  const deliveryStairFlights = (!deliveryElevator && parseInt(deliveryFloor) > 1) ? (parseInt(deliveryFloor) - 1) : 0;
  const totalStairFlights = pickupStairFlights + deliveryStairFlights;
  const stairCarryCharge = totalStairFlights * (config.additionalServicePrices.stairCarryPerFlight || 15);

  // 6. Heavy Item Surcharges
  const heavyItemCount = items.filter(i => i.over300lbs || (parseFloat(i.weight) || 0) > 300).length;
  const heavyItemCharge = heavyItemCount * (config.additionalServicePrices.heavyItemFee || 50);

  // 7. Additional Services & Addons
  let addOnsTotal = 0;
  const itemizedAddons = [];

  if (additionalServices.insidePickup) {
    addOnsTotal += config.additionalServicePrices.insidePickup || 25;
    itemizedAddons.push({ name: 'Inside Pickup', cost: config.additionalServicePrices.insidePickup || 25 });
  }
  if (additionalServices.insideDelivery) {
    addOnsTotal += config.additionalServicePrices.insideDelivery || 25;
    itemizedAddons.push({ name: 'Inside Delivery', cost: config.additionalServicePrices.insideDelivery || 25 });
  }
  if (additionalServices.assembly) {
    addOnsTotal += config.additionalServicePrices.assembly || 45;
    itemizedAddons.push({ name: 'Furniture Assembly', cost: config.additionalServicePrices.assembly || 45 });
  }
  if (additionalServices.disassembly) {
    addOnsTotal += config.additionalServicePrices.disassembly || 35;
    itemizedAddons.push({ name: 'Furniture Disassembly', cost: config.additionalServicePrices.disassembly || 35 });
  }
  if (additionalServices.wrapping) {
    addOnsTotal += config.additionalServicePrices.wrapping || 20;
    itemizedAddons.push({ name: 'Protective Wrapping', cost: config.additionalServicePrices.wrapping || 20 });
  }
  if (additionalServices.additionalStop) {
    const stopsCount = parseInt(additionalServices.additionalStopCount) || 1;
    const stopCost = stopsCount * (config.additionalServicePrices.additionalStop || 35);
    addOnsTotal += stopCost;
    itemizedAddons.push({ name: `Additional Stop (${stopsCount})`, cost: stopCost });
  }
  if (additionalServices.waitingTime) {
    const hours = (parseFloat(additionalServices.waitingTimeMins) || 30) / 60;
    const waitCost = Math.round(hours * (config.additionalServicePrices.waitingTimePerHour || 40));
    addOnsTotal += waitCost;
    itemizedAddons.push({ name: 'Waiting Time Charge', cost: waitCost });
  }
  if (additionalServices.sameDay) {
    addOnsTotal += config.additionalServicePrices.sameDaySurcharge || 50;
    itemizedAddons.push({ name: 'Same-Day Service', cost: config.additionalServicePrices.sameDaySurcharge || 50 });
  }
  if (additionalServices.rushService) {
    addOnsTotal += config.additionalServicePrices.rushSurcharge || 95;
    itemizedAddons.push({ name: 'Rush / Immediate Service', cost: config.additionalServicePrices.rushSurcharge || 95 });
  }

  // Combine totals
  const laborTotal = teamCharge + stairCarryCharge + (heavyItemCount > 0 ? heavyItemCharge : 0);
  const surchargesTotal = addOnsTotal;

  const subtotal = Math.max(config.minimumBaseCharge || 49, baseServicePrice + mileageCharge + vehicleCharge + laborTotal + surchargesTotal);
  const tax = config.taxRatePercent ? Math.round(subtotal * (config.taxRatePercent / 100) * 100) / 100 : 0;
  const estimatedTotal = Math.round((subtotal + tax) * 100) / 100;

  return {
    selectedService: service,
    vehicle,
    deliveryTeam,
    estimatedDistanceMiles: distance,
    estimatedDriveTimeMins: driveTimeMinutes || Math.round(distance * 2.2 + 15),
    basePrice: baseServicePrice,
    mileageCharge,
    vehicleCharge,
    laborCharges: laborTotal,
    stairCarryCharge,
    heavyItemCharge,
    itemizedAddons,
    surcharges: surchargesTotal,
    subtotal,
    tax,
    estimatedTotal
  };
}
