import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { initialPreferences, readPreferences, STORAGE_KEY, type Preferences } from './preferences';

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const changed = useRef(false);
  const alive = useRef(true);
  const writes = useRef(Promise.resolve());

  useEffect(() => {
    alive.current = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (alive.current && !changed.current) setPreferences(readPreferences(raw));
      })
      .catch(() => {
        if (alive.current) setStorageError('Saved preferences are unavailable. You can still calculate.');
      })
      .finally(() => {
        if (alive.current) setReady(true);
      });
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)))
      .then(() => { if (alive.current) setStorageError(''); })
      .catch(() => { if (alive.current) setStorageError('Could not save your preference on this device.'); });
  }, [preferences, ready]);

  function updatePreferences(patch: Partial<Preferences>) {
    changed.current = true;
    setPreferences(previous => ({ ...previous, ...patch }));
  }

  return { preferences, updatePreferences, storageError };
}