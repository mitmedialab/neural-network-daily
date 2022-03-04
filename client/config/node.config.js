import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		files: {
			assets: './src/static',
			lib: './src/lib',
			routes: './src/routes',
			template: './src/app.html'
		},
		adapter: adapter({
			out: '../build/client',
			precompress: false
		}),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

export default config;