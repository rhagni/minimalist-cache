'use strict';

const DriverInterface = require('./driver/interface.js');

const MemoryDriver = require('./driver/memory.js');

const FSDriver = require('./driver/fs.js');

const MinimalistCache = function (options) {
	this.driver = false;

	this.expires = 0;

	this.replicate = true;

	const solveData = (data, resolve, reject) => {
		if (data instanceof Promise) {
			data.then(data => {
				solveData(data, resolve, reject);
			}).catch(err => {
				reject(err);
			});
		} else {
			resolve(data);
		}
	};

	const solveCallback = callback => {
		return new Promise((resolve, reject) => {
			let data;

			try {
				data = callback();
			} catch (err) {
				reject(err);

				return;
			}

			solveData(data, resolve, reject);
		});
	};

	const minimalistCacheSingle = (identifier, callback, options = null) => {
		options = Object.create(options);

		const expires = options.expires || this.expires;

		return new Promise((resolve, reject) => {
			this.driver.get(identifier, expires).then((data, createdAt) => {
				console.log(data, createdAt);
				resolve(data, createdAt);
			}).catch(err => {
				solveCallback(callback).then(data => {
					this.driver.set(identifier, data).then(() => {
						resolve(data);
					}).catch(err => {
						reject(err);
					});
				}).catch(err => {
					reject(err);
				});
			});
		});
	};

	let useDefaults = true;

	if (options instanceof DriverInterface) {
		this.driver = options;
	} else if (typeof options === 'object') {
		if (typeof options.driver === 'object') {
			this.driver = options.driver;
		}

		useDefaults = false;
	}

	if (!(this.driver instanceof DriverInterface)) {
		throw new TypeError('Driver doesn\'t extends driver interface');
	}

	if (useDefaults === false) {
		if (typeof options.expires !== 'undefined') {
			this.expires = Number(options.expires);
		}

		if (typeof options.replicate !== 'undefined') {
			this.replicate = Boolean(options.replicate);
		}
	}

	return minimalistCacheSingle;
};

MinimalistCache.driver = Object.create(null);

MinimalistCache.driver.memory = MemoryDriver;

MinimalistCache.driver.fs = FSDriver;

module.exports = MinimalistCache;
