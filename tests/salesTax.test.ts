import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateSalesTax, parseTaxRate } from '../src/salesTax';
import { countryTaxGuides, findTaxGuide, stateRates } from '../src/taxGuidance';

test('sales tax can be added to a private-party purchase using a confirmed rate', () => {
  assert.deepEqual(calculateSalesTax(10000, 8.25, 'add'), { subtotal: 10000, tax: 825, total: 10825 });
});

test('included VAT is extracted rather than charged a second time', () => {
  assert.deepEqual(calculateSalesTax(12000, 20, 'included'), { subtotal: 10000, tax: 2000, total: 12000 });
});

test('zero tax is supported only as an explicit entered rate', () => {
  assert.deepEqual(calculateSalesTax(12345, 0, 'add'), { subtotal: 12345, tax: 0, total: 12345 });
  assert.equal(parseTaxRate(''), null);
  assert.equal(parseTaxRate('0'), 0);
});

test('tax rates allow four decimals for local combined rates', () => {
  assert.equal(parseTaxRate('8.875'), 8.875);
  assert.equal(parseTaxRate('4,7125'), 4.7125);
  for (const text of ['-1', '101', 'abc', '7.12345']) assert.equal(parseTaxRate(text), null);
});

test('all modes preserve exact subtotal plus tax equals total', () => {
  for (const amount of [0, 1, 99, 12345, 99999999]) {
    for (const rate of [0, 4.7125, 8.875, 20, 100]) {
      for (const mode of ['add', 'included'] as const) {
        const result = calculateSalesTax(amount, rate, mode);
        assert.equal(result.subtotal + result.tax, result.total);
        assert.ok(Number.isSafeInteger(result.tax));
      }
    }
  }
  assert.throws(() => calculateSalesTax(-1, 5, 'add'));
  assert.throws(() => calculateSalesTax(100, Number.NaN, 'add'));
});

test('dated tax reference covers all states/DC and every EU member without inventing unsupported guidance', () => {
  assert.equal(stateRates.length, 51);
  assert.equal(new Set(stateRates.map(([code]) => code)).size, 51);
  assert.equal(stateRates.find(([code]) => code === 'TX')?.[2], 6.25);
  assert.equal(stateRates.find(([code]) => code === 'MN')?.[2], 6.875);
  assert.equal(countryTaxGuides.filter(guide => guide.url.includes('europa.eu') && guide.code !== 'OTHER').length, 27);
  assert.equal(findTaxGuide('unknown').code, 'OTHER');
  assert.equal(findTaxGuide('GB').currency, 'GBP');
});