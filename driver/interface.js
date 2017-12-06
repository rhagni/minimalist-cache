'use strict';

/* eslint-disable no-unused-vars */

/**
 * Driver interface
 */
class DriverInterface {
	/**
	 * @param {string} identifer
	 * @param {mixed} data
	 * @param {date} [createdAt=false]
	 * @return {promise}
	 */
	set(identifer, data, createdAt = false) {
		throw new Error('this.set must be implemented');
	}

	/**
	 * @param {string} identifer
	 * @param {number} [expires=0]
	 * @return {promise}
	 */
	get(identifier, expires = 0) {
		throw new Error('this.get must be implemented');
	}
}

module.exports = DriverInterface;
