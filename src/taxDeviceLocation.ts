import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { resolveTaxAddress } from './taxLocation';

function abortable<Value>(operation: Promise<Value>, signal: AbortSignal): Promise<Value> {
  if (signal.aborted) return Promise.reject(new Error('Location lookup canceled'));
  return new Promise((resolve, reject) => {
    const cancel = () => reject(new Error('Location lookup canceled'));
    signal.addEventListener('abort', cancel, { once: true });
    operation.then(resolve, reject).finally(() => signal.removeEventListener('abort', cancel));
  });
}

export async function getTaxDeviceLocation(signal: AbortSignal) {
  if (Platform.OS === 'web') {
    if (!globalThis.isSecureContext || !navigator.geolocation) {
      throw new Error('Browser location requires HTTPS or localhost. You can search states manually below.');
    }
    const position = await abortable(new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, error => {
        reject(new Error(error.code === 1
          ? 'Location was blocked. Allow location for this site in your browser settings, or search states manually below.'
          : 'Your browser could not find a location. Check device location services or search states manually below.'));
      }, { enableHighAccuracy: false, maximumAge: 60000, timeout: 12000 });
    }), signal);
    const { findStateAtCoordinates } = await import('./stateBoundaries');
    if (signal.aborted) throw new Error('Location lookup canceled');
    const state = findStateAtCoordinates(position.coords.latitude, position.coords.longitude);
    return { countryCode: state ? 'US' : null, state };
  }

  const permission = await abortable(Location.requestForegroundPermissionsAsync(), signal);
  if (permission.status !== 'granted') {
    throw new Error('Location was not allowed. Enable it in app settings, or search states manually below.');
  }
  if (!await abortable(Location.hasServicesEnabledAsync(), signal)) {
    throw new Error('Device location services are off. Enable them or search states manually below.');
  }
  const position = await abortable(Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }), signal);
  const addresses = await abortable(Location.reverseGeocodeAsync(position.coords), signal);
  if (!addresses[0]) throw new Error('No country or state was found. Search states manually below.');
  return resolveTaxAddress({ countryCode: addresses[0].isoCountryCode, state: addresses[0].region });
}