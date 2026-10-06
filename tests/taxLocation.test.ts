import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveTaxAddress } from '../src/taxLocation';
import { findStateAtCoordinates } from '../src/stateBoundaries';

test('native state names and abbreviations select the correct reference', () => {
  for (const state of ['Virginia', 'VA', ' va ', 'US-VA']) {
    assert.deepEqual(resolveTaxAddress({ countryCode: 'us', state }).state, ['VA', 'Virginia', 5.3]);
  }
  assert.deepEqual(resolveTaxAddress({ countryCode: 'USA', stateCode: 'TX' }).state, ['TX', 'Texas', 6.25]);
});

test('offline browser boundaries locate US states including Alaska and Hawaii', () => {
  for (const [latitude, longitude, code] of [
    [37.5407, -77.436, 'VA'], [30.2672, -97.7431, 'TX'], [34.0522, -118.2437, 'CA'],
    [61.2181, -149.9003, 'AK'], [21.3099, -157.8581, 'HI'], [38.9072, -77.0369, 'DC'],
  ] as const) {
    assert.equal(findStateAtCoordinates(latitude, longitude)?.[0], code);
  }
  assert.equal(findStateAtCoordinates(51.5074, -0.1278), null);
});

test('non-US or missing countries never infer a US state from a matching name', () => {
  assert.equal(resolveTaxAddress({ countryCode: 'GE', state: 'Georgia' }).state, null);
  assert.equal(resolveTaxAddress({ state: 'Georgia' }).state, null);
  assert.equal(resolveTaxAddress({ countryCode: 'US', state: 'Unknown' }).state, null);
  assert.equal(resolveTaxAddress({ countryCode: 'GB', state: 'Washington' }).countryCode, 'GB');
});

test('invalid coordinate values fail explicitly', () => {
  assert.throws(() => findStateAtCoordinates(Number.NaN, 0));
  assert.throws(() => findStateAtCoordinates(91, 0));
  assert.throws(() => findStateAtCoordinates(0, 181));
});