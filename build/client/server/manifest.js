export const manifest = {
	appDir: "_app",
	assets: new Set([]),
	_: {
		mime: {},
		entry: {"file":"start-814720fe.js","js":["start-814720fe.js","chunks/vendor-cf4817b6.js"],"css":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/4.js')
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
				pattern: /^\/room-([^/]+?)-([^/]+?)\/?$/,
				params: (m) => ({ id: m[1], capacity: m[2]}),
				path: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/test\/?$/,
				params: null,
				path: "/test",
				a: [0,4],
				b: [1]
			}
		]
	}
};
