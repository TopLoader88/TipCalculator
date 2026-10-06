export const regions = [
  {
    code: 'US', name: 'United States', currency: 'USD', digits: 2,
    headline: 'Tipping is customary',
    guidance: 'For table service, 15-20% is a common starting point. Check the receipt for any included gratuity or service charge.',
    tax: 'Sales tax varies by state and city. Use the tax printed on your receipt, not a location-based estimate.',
    source: 'Calculator.net tipping guide', url: 'https://www.calculator.net/tip-calculator.html',
  },
  {
    code: 'GB', name: 'United Kingdom', currency: 'GBP', digits: 2,
    headline: 'Check the service charge',
    guidance: 'London guidance: 10-15% for restaurant table service when no service charge is included. Extra tipping is usually unnecessary when service is included. Customs elsewhere may vary.',
    tax: 'Use the actual tax on your receipt if you want to exclude it. A service charge is not the same thing as tax.',
    source: 'Visit London restaurant tipping guide', url: 'https://www.visitlondon.com/traveller-information/essential-information/money/tipping',
  },
  {
    code: 'JP', name: 'Japan', currency: 'JPY', digits: 0,
    headline: 'Tipping is generally not expected',
    guidance: 'Ordinary restaurant tipping is generally not customary and may be unwelcome. Follow the establishment\'s guidance. Your saved tip percentage is not changed automatically.',
    tax: 'Use your receipt for the actual tax amount. Yen amounts are calculated in whole yen.',
    source: 'Calculator.net international tipping guide', url: 'https://www.calculator.net/tip-calculator.html',
  },
] as const;

export type RegionCode = typeof regions[number]['code'];
export const REVIEWED_DATE = '2026-10-06';
export function findRegion(code: string | null | undefined) {
  return regions.find(region => region.code === code) ?? null;
}