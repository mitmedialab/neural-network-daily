import GraphFactory from "$lib/shared/graph/GraphFactory";
import { readable } from "svelte/store";
import type { Readable } from "svelte/store";

export const graphFactory: Readable<GraphFactory> = readable<GraphFactory>(new GraphFactory());
