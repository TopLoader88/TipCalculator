export const TAX_REVIEWED = '2026-10-06';
export const STATE_RATE_DATE = '2026-07-01';
export const STATE_SOURCE = 'https://taxfoundation.org/data/all/state/2026-sales-tax-rates-midyear/';
export const EU_SOURCE = 'https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm';

export const stateRates = [
  ['AL', 'Alabama', 4], ['AK', 'Alaska', 0], ['AZ', 'Arizona', 5.6], ['AR', 'Arkansas', 6.5],
  ['CA', 'California', 7.25], ['CO', 'Colorado', 2.9], ['CT', 'Connecticut', 6.35], ['DE', 'Delaware', 0],
  ['DC', 'District of Columbia', 6], ['FL', 'Florida', 6], ['GA', 'Georgia', 4], ['HI', 'Hawaii', 4],
  ['ID', 'Idaho', 6], ['IL', 'Illinois', 6.25], ['IN', 'Indiana', 7], ['IA', 'Iowa', 6],
  ['KS', 'Kansas', 6.5], ['KY', 'Kentucky', 6], ['LA', 'Louisiana', 5], ['ME', 'Maine', 5.5],
  ['MD', 'Maryland', 6], ['MA', 'Massachusetts', 6.25], ['MI', 'Michigan', 6], ['MN', 'Minnesota', 6.875],
  ['MS', 'Mississippi', 7], ['MO', 'Missouri', 4.225], ['MT', 'Montana', 0], ['NE', 'Nebraska', 5.5],
  ['NV', 'Nevada', 6.85], ['NH', 'New Hampshire', 0], ['NJ', 'New Jersey', 6.625], ['NM', 'New Mexico', 4.875],
  ['NY', 'New York', 4], ['NC', 'North Carolina', 4.75], ['ND', 'North Dakota', 5], ['OH', 'Ohio', 5.75],
  ['OK', 'Oklahoma', 4.5], ['OR', 'Oregon', 0], ['PA', 'Pennsylvania', 6], ['RI', 'Rhode Island', 7],
  ['SC', 'South Carolina', 6], ['SD', 'South Dakota', 4.2], ['TN', 'Tennessee', 7], ['TX', 'Texas', 6.25],
  ['UT', 'Utah', 6.1], ['VT', 'Vermont', 6], ['VA', 'Virginia', 5.3], ['WA', 'Washington', 6.5],
  ['WV', 'West Virginia', 6], ['WI', 'Wisconsin', 5], ['WY', 'Wyoming', 4],
] as const;

export const STATE_CAVEAT = 'General statewide reference, not the combined rate for your purchase. Local, district, meal, vehicle and other special taxes may apply. A 0% general state rate does not mean every transaction is tax-free. California includes its mandatory local minimum; Virginia and Utah include mandatory local components. Hawaii and New Mexico have broader business-tax systems.';
export const PRIVATE_CAVEAT = 'A private seller does not automatically make a purchase tax-free. Casual-sale exemptions, seller status, item type, registration address and use-tax rules vary. Enter the confirmed taxable amount and applicable rate. This estimate excludes registration fees, special valuation rules, credits and exemptions.';

export const privateVehicleSources = [
  {
    name: 'California private vehicle purchases',
    note: 'Private-party vehicles for use in California generally owe use tax unless an exemption applies. The rate depends on the registration address, including district taxes.',
    url: 'https://www.cdtfa.ca.gov/industry/vehicles-vessels-aircraft/vehicles.htm',
  },
  {
    name: 'Texas private vehicle purchases',
    note: 'Motor vehicle tax is generally 6.25%. For many private used-vehicle sales, the taxable value is the greater of price or 80% of standard presumptive value, with exceptions. Do not use the ordinary local retail rate.',
    url: 'https://comptroller.texas.gov/taxes/motor-vehicle/private-party-spv.php',
  },
];

export type CountryTaxGuide = {
  code: string; name: string; currency: string; digits: number; reference: string; note: string; url: string;
};

const euRates = [
  ['AT', 'Austria', 20, 'EUR'], ['BE', 'Belgium', 21, 'EUR'], ['BG', 'Bulgaria', 20, 'EUR'],
  ['HR', 'Croatia', 25, 'EUR'], ['CY', 'Cyprus', 19, 'EUR'], ['CZ', 'Czechia', 21, 'CZK'],
  ['DK', 'Denmark', 25, 'DKK'], ['EE', 'Estonia', 24, 'EUR'], ['FI', 'Finland', 25.5, 'EUR'],
  ['FR', 'France', 20, 'EUR'], ['DE', 'Germany', 19, 'EUR'], ['GR', 'Greece', 24, 'EUR'],
  ['HU', 'Hungary', 27, 'HUF'], ['IE', 'Ireland', 23, 'EUR'], ['IT', 'Italy', 22, 'EUR'],
  ['LV', 'Latvia', 21, 'EUR'], ['LT', 'Lithuania', 21, 'EUR'], ['LU', 'Luxembourg', 17, 'EUR'],
  ['MT', 'Malta', 18, 'EUR'], ['NL', 'Netherlands', 21, 'EUR'], ['PL', 'Poland', 23, 'PLN'],
  ['PT', 'Portugal', 23, 'EUR'], ['RO', 'Romania', 21, 'RON'], ['SK', 'Slovakia', 23, 'EUR'],
  ['SI', 'Slovenia', 22, 'EUR'], ['ES', 'Spain', 21, 'EUR'], ['SE', 'Sweden', 25, 'SEK'],
] as const;

export const countryTaxGuides: CountryTaxGuide[] = [
  { code: 'US', name: 'United States', currency: 'USD', digits: 2, reference: 'State and local sales/use tax', note: STATE_CAVEAT, url: STATE_SOURCE },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', digits: 2, reference: '20% standard VAT', note: 'Reduced 5%, zero and exempt categories exist. The rate depends on the goods or service. Check the receipt before extracting included VAT.', url: 'https://www.gov.uk/vat-rates' },
  { code: 'JP', name: 'Japan', currency: 'JPY', digits: 0, reference: '10% standard consumption tax', note: '8% reduced rate applies to qualifying food and drink, excluding alcohol and dining out. Whole-yen rounding may differ by invoice.', url: 'https://www.nta.go.jp/english/taxes/consumption_tax/01.htm' },
  { code: 'AU', name: 'Australia', currency: 'AUD', digits: 2, reference: '10% GST', note: 'GST-free categories exist. GST-registered businesses generally include GST in taxable prices; private seller status needs separate checking.', url: 'https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/how-gst-works' },
  { code: 'CA', name: 'Canada', currency: 'CAD', digits: 2, reference: 'GST/HST and provincial taxes', note: 'GST is 5% where HST does not apply, with separate provincial taxes where applicable. HST: Ontario 13%, Nova Scotia 14%, New Brunswick, Newfoundland and Labrador, and PEI 15%. Provincial taxability can differ; verify the full applicable rate.', url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate.html' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', digits: 2, reference: '15% GST', note: 'Zero-rated, exempt and special supplies exist. Confirm seller registration and the tax treatment of the purchase.', url: 'https://www.ird.govt.nz/gst' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', digits: 2, reference: '9% GST', note: 'GST-registered businesses charge GST on taxable supplies. Zero-rated and exempt supplies exist. Service charges are separate from GST.', url: 'https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/basics-of-gst/current-gst-rates' },
  ...euRates.map(([code, name, rate, currency]) => ({
    code, name, currency, digits: 2, reference: `${rate}% standard VAT`,
    note: 'EU table reviewed by Your Europe on 2026-07-13. Reduced restaurant and product rates may apply; overseas and special-region rates are not covered. Verify the actual rate with the national authority. Private-sale treatment is not inferred.',
    url: EU_SOURCE,
  })),
  { code: 'OTHER', name: 'Other / no researched guide', currency: 'USD', digits: 2, reference: 'No verified tax guidance for this selection', note: 'Choose a currency and enter a confirmed rate manually. No local tax or exemption is assumed.', url: EU_SOURCE },
];

export function findTaxGuide(code: string | null | undefined) {
  return countryTaxGuides.find(guide => guide.code === code) ?? countryTaxGuides.find(guide => guide.code === 'OTHER')!;
}