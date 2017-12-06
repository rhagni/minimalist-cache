'use strict';

const MinimalistCache = require('../index.js');

const mcac = new MinimalistCache({
	expires: 60,
	/* eslint-disable new-cap */
	driver: new MinimalistCache.driver.fs()
	/* eslint-enable new-cap */
});

console.log(mcac);

(async () => {
	console.log('start');

	let tags;

	try {
		tags = await mcac('tags', () => {
			return new Promise(resolve => {
				resolve(new Promise(resolve => {
					resolve([
						'yolo',
						'sup',
						'modafoca'
					]);
				}));
			});
		});
	} catch (err) {
		console.log(err);
	}

	console.log(tags);

	console.log('end');
})();
