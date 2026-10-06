import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculate, divideUnits, formatMoney, parseAmount, parsePercentage } from '../src/calculator';
import { readPreferences } from '../src/preferences';

test('first launch uses 15%, saved presets and custom percentages restore', () => {
  assert.equal(readPreferences(null).percentage, 15);
  assert.equal(readPreferences('{"percentage":20}').percentage, 20);
  assert.equal(readPreferences('{"percentage":17.25}').percentage, 17.25);
  assert.equal(readPreferences('{"percentage":0}').percentage, 0);
});

test('bad storage recovers without crashing or changing first-launch default', () => {
  for (const raw of ['bad JSON', 'null', '[]', '{"percentage":-2}', '{"percentage":101}', '{"percentage":"20"}']) {
    assert.equal(readPreferences(raw).percentage, 15);
  }
  assert.equal(readPreferences('{"region":"unknown"}').region, null);
});

test('changing country never overrides saved percentage', () => {
  assert.deepEqual(readPreferences('{"percentage":18,"region":"JP"}'), { percentage: 18, region: 'JP' });
});

test('currency input is converted to exact minor units and rejects malformed amounts', () => {
  assert.equal(parseAmount('32.45'), 3245);
  assert.equal(parseAmount('32,45'), 3245);
  assert.equal(parseAmount('.50'), 50);
  assert.equal(parseAmount('12.'), 1200);
  assert.equal(parseAmount(''), 0);
  for (const input of ['1.234', '-12', 'NaN', '12abc', '1.2.3', '1000000']) assert.equal(parseAmount(input), null);
  assert.equal(parseAmount('1200', 0), 1200);
  assert.equal(parseAmount('12.50', 0), null);
});

test('custom percentages support zero and decimals but reject invalid values', () => {
  assert.equal(parsePercentage('17.25'), 17.25);
  assert.equal(parsePercentage('0'), 0);
  assert.equal(parsePercentage('18,5'), 18.5);
  for (const input of ['', '-1', '101', 'abc', '12.345']) assert.equal(parsePercentage(input), null);
});

test('receipt tip and total at 15%', () => {
  const result = calculate(5000, 15);
  assert.equal(result.tip, 750);
  assert.equal(result.total, 5750);
  assert.deepEqual(result.shares, [{ bill: 5000, tip: 750, total: 5750 }]);
});

test('tax exclusion reduces only the tip base, not the bill total', () => {
  const result = calculate(11000, 15, 2, 1000);
  assert.equal(result.tip, 1500);
  assert.equal(result.total, 12500);
  assert.equal(result.base, 10000);
  assert.throws(() => calculate(100, 15, 1, 101));
});

test('penny-exact bill and tip splits always sum back to the receipt', () => {
  for (const people of [1, 2, 3, 7, 50]) {
    for (const amount of [0, 1, 99, 1001, 99999999]) {
      const result = calculate(amount, 17.25, people);
      assert.equal(result.shares.reduce((sum, share) => sum + share.bill, 0), amount);
      assert.equal(result.shares.reduce((sum, share) => sum + share.tip, 0), result.tip);
      assert.equal(result.shares.reduce((sum, share) => sum + share.total, 0), result.total);
      assert.ok(Math.max(...result.shares.map(share => share.total)) - Math.min(...result.shares.map(share => share.total)) <= 2);
    }
  }
});

test('invalid people and amounts cannot produce a misleading result', () => {
  for (const count of [0, -1, 1.5, 51]) assert.throws(() => divideUnits(100, count));
  assert.throws(() => calculate(-1, 15));
  assert.throws(() => calculate(100, Number.NaN));
});

test('whole yen and cents are formatted in the correct unit', () => {
  assert.equal(formatMoney(5750), '$57.50');
  assert.equal(formatMoney(1150, 'JPY', 0), '\u00a51,150');
});