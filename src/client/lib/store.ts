import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export function createPersistentStore<T>(key: string, startValue: T | null = null): Writable<T> {
  const getStoredData = (): T => {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : startValue;
  }

  const setStoreData = (value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const { subscribe, set, update } = writable(getStoredData());
  subscribe(current => setStoreData(current)); // is this a memory leak?
  return { subscribe, update, set };
}

export function getCurrentValue<T>(store: Writable<T>): T {
  let val
  store.subscribe(current => val = current)()
  return val
}