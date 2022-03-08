import { createPersistentStore } from '$lib/storeUtility'
import { readable } from 'svelte/store';
import GraphFactory from './shared/graph/GraphFactory';

export const graphFactory = readable<GraphFactory>(new GraphFactory());
export const room = createPersistentStore<string>('room', undefined);
export const role = createPersistentStore<string>('role', undefined);
export const inputs = createPersistentStore<string[]>('inputs', undefined);