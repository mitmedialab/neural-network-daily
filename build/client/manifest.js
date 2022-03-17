export const manifest = {
	appDir: "_app",
	assets: new Set([]),
	_: {
		mime: {},
		entry: {"file":"start-bf303b57.js","js":["start-bf303b57.js","chunks/vendor-212bf475.js","chunks/singletons-4a680913.js"],"css":[]},
		nodes: [
			() => import('./server/nodes/0.js'),
			() => import('./server/nodes/1.js'),
			() => import('./server/nodes/2.js'),
			() => import('./server/nodes/3.js')
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/([^/]+?)\/?$/,
				params: (m) => ({ id: m[1]}),
				path: null,
				a: [0,3],
				b: [1]
			}
		]
	}
};
