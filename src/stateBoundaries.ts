import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import statesData from 'us-atlas/states-10m.json';
import { resolveTaxAddress } from './taxLocation';

const topology = statesData as unknown as Topology<{ states: GeometryCollection<{ name: string }> }>;
const boundaries = feature(topology, topology.objects.states);

export function findStateAtCoordinates(latitude: number, longitude: number) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    throw new Error('Invalid location coordinates');
  }
  const boundary = boundaries.features.find(state => geoContains(state, [longitude, latitude]));
  const name: unknown = boundary?.properties?.name;
  return typeof name === 'string' ? resolveTaxAddress({ countryCode: 'US', state: name }).state : null;
}