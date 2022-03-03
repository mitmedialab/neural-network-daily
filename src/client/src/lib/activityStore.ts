import { createPersistentStore } from '$lib/storeUtility'

export const room = createPersistentStore<string>('room', undefined);
export const role = createPersistentStore<string>('role', undefined);
export const inputs = createPersistentStore<string[]>('inputs', undefined);