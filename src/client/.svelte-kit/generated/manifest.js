const c = [
	() => import("../runtime/components/layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../routes/index.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];