export const DEFAULT_TIP = 15;
export const MAX_PEOPLE = 50;

export function parseAmount(text: string, digits = 2): number | null {
  const normalized = text.trim().replace(',', '.');
  if (!normalized) return 0;
  const pattern = digits === 0 ? /^\d{1,6}$/ : /^(?:\d{1,6}(?:\.\d{0,2})?|\.\d{1,2})$/;
  if (!pattern.test(normalized)) return null;
  const [whole = '0', fraction = ''] = normalized.split('.');
  return Number(whole) * 10 ** digits + Number(fraction.padEnd(digits, '0'));
}

export function parsePercentage(text: string): number | null {
  const normalized = text.trim().replace(',', '.');
  if (!/^(?:\d{1,3}(?:\.\d{0,2})?|\.\d{1,2})$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
}

export function divideUnits(amount: number, people: number): number[] {
  if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Invalid amount');
  if (!Number.isInteger(people) || people < 1 || people > MAX_PEOPLE) throw new Error('Invalid people count');
  const share = Math.floor(amount / people);
  const remainder = amount % people;
  return Array.from({ length: people }, (_, index) => share + (index < remainder ? 1 : 0));
}

export function calculate(bill: number, percentage: number, people = 1, excludedTax = 0) {
  if (!Number.isSafeInteger(bill) || bill < 0 || !Number.isSafeInteger(excludedTax) || excludedTax < 0 || excludedTax > bill) {
    throw new Error('Tax must be between zero and the bill amount');
  }
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) throw new Error('Invalid percentage');
  const base = bill - excludedTax;
  const tip = Math.round(base * Math.round(percentage * 100) / 10000);
  const bills = divideUnits(bill, people);
  const tips = divideUnits(tip, people);
  return {
    base,
    tip,
    total: bill + tip,
    shares: bills.map((amount, index) => ({ bill: amount, tip: tips[index], total: amount + tips[index] })),
  };
}

export function formatMoney(units: number, currency = 'USD', digits = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits,
  }).format(units / 10 ** digits);
}