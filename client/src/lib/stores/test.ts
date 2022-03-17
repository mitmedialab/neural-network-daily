import { writable } from "svelte/store";

export const testStore = writable<string>('hi');