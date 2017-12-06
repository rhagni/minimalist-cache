'use strict';

const UndefinedError = require('../error/undefined.js');

const ExpiredError = require('../error/expired.js');

const DriverInterface = require('./interface.js');

/**
 * @param {string} identifier
 * @param {mixed} data
 * @return {promise}
 */
class MemoryDriver extends DriverInterface {
	constructor(options) {
		super();

		options = Object.create(options);

		this.container = options.container || Object.create(null);
	}

	/**
	 * @inheritdoc
	 */
	set(identifier, data, createdAt) {
		return new Promise(resolve => {
			const content = {
				createdAt: createdAt || new Date(),
				data
			};

			this.container[identifier] = content;

			return resolve();
		});
	}

	/**
	 * @inheritdoc
	 */
	get(identifier, expires) {
		return new Promise((resolve, reject) => {
			if (typeof this.container[identifier] === 'undefined') {
				return reject(new UndefinedError());
			}

			const content = this.container[identifier];

			if (expires) {
				const expiration = content.createdAt.getTime() + (expires * 1000);

				if ((new Date()).getTime() > expiration) {
					return reject(new ExpiredError());
				}
			}

			return resolve(content.data, content.createdAt);
		});
	}
}

module.exports = MemoryDriver;
