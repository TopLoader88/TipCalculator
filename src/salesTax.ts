export type TaxMode = 'add' | 'included';

export function parseTaxRate(text: string): number | null {
  const normalized = text.trim().replace(',', '.');
  if (!/^(?:\d{1,3}(?:\.\d{0,4})?|\.\d{1,4})$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
}

export function calculateSalesTax(amount: number, rate: number, mode: TaxMode) {
  if (!Number.isSafeInteger(amount) || amount < 0 || amount > 99999999) throw new Error('Invalid purchase amount');
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) throw new Error('Invalid tax rate');
  if (mode !== 'add' && mode !== 'included') throw new Error('Invalid tax mode');
  const rateUnits = Math.round(rate * 10000);
  const denominator = 1000000;
  const tax = mode === 'add'
    ? Math.round(amount * rateUnits / denominator)
    : Math.round(amount * rateUnits / (denominator + rateUnits));
  return {
    subtotal: mode === 'add' ? amount : amount - tax,
    tax,
    total: mode === 'add' ? amount + tax : amount,
  };
}