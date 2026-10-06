import { DEFAULT_TIP } from './calculator';
import { findRegion, type RegionCode } from './regions';

export type Preferences = { percentage: number; region: RegionCode | null };
export const initialPreferences: Preferences = { percentage: DEFAULT_TIP, region: null };
export const STORAGE_KEY = 'tipcalculator.preferences.v1';

export function readPreferences(raw: string | null): Preferences {
  if (!raw) return { ...initialPreferences };
  try {
    const stored: unknown = JSON.parse(raw);
    if (!stored || typeof stored !== 'object') return { ...initialPreferences };
    const value = stored as Record<string, unknown>;
    return {
      percentage: typeof value.percentage === 'number' && Number.isFinite(value.percentage) && value.percentage >= 0 && value.percentage <= 100
        ? Math.round(value.percentage * 100) / 100 : DEFAULT_TIP,
      region: typeof value.region === 'string' ? findRegion(value.region)?.code ?? null : null,
    };
  } catch {
    return { ...initialPreferences };
  }
}