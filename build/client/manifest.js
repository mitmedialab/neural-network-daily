export const manifest = {
	appDir: "_app",
	assets: new Set([]),
	_: {
		mime: {},
		entry: {"file":"start-99917dae.js","js":["start-99917dae.js","chunks/vendor-296f84ed.js"],"css":[]},
		nodes: [
			() => import('./server/nodes/0.js'),
			() => import('./server/nodes/1.js'),
			() => import('./server/nodes/2.js'),
			() => import('./server/nodes/3.js'),
			() => import('./server/nodes/4.js')
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
				pattern: /^\/room\/?$/,
				params: null,
				path: "/room",
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
