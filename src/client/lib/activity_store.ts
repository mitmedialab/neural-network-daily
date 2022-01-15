import { createPersistentStore } from '$lib/store'

export const room = createPersistentStore<string>('room');
export const role = createPersistentStore<string>('role');
export const inputs = createPersistentStore<string[]>('inputs');