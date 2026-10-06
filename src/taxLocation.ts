import { stateRates } from './taxGuidance';

export type TaxAddress = {
  countryCode?: string | null;
  state?: string | null;
  stateCode?: string | null;
};

export function resolveTaxAddress(address: TaxAddress) {
  const countryCode = address.countryCode?.trim().toUpperCase() || null;
  const normalizedCountry = countryCode === 'USA' ? 'US' : countryCode;
  const state = normalizedCountry === 'US'
    ? stateRates.find(([code, name]) => [address.stateCode, address.state].some(value => {
      const normalized = value?.trim().toUpperCase().replace(/^US-/, '');
      return normalized === code || normalized === name.toUpperCase();
    })) ?? null
    : null;
  return { countryCode: normalizedCountry, state };
}

