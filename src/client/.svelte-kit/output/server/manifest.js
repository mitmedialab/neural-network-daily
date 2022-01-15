export const manifest = {
	appDir: "_app",
	assets: new Set([]),
	_: {
		mime: {},
		entry: {"file":"start-b2a83d01.js","js":["start-b2a83d01.js","chunks/vendor-f0095a1c.js"],"css":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				a: [0,2],
				b: [1]
			}
		]
	}
};
