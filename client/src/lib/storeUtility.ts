import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';

const appNamePrefix = "Contours2Classification_";

export function createPersistentStore<T>(key: string, startValue: T | null = null): Writable<T> {
  const prefixedKey = appNamePrefix + key;
  const browser = typeof (localStorage) != 'undefined'

  const getStoredData = (): T => {
    if (browser) {
      const json = localStorage.getItem(prefixedKey);
      return json ? JSON.parse(json) : startValue;
    }

    return startValue;
  }

  const setStoreData = (value: T): void => {
    if (browser) {
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    }
  }

  const { subscribe, set, update } = writable(getStoredData());
  subscribe(current => setStoreData(current)); // is this a memory leak?
  return { subscribe, update, set };
}

export function getCurrentValue<T>(store: Writable<T>): T {
  return get(store);
}