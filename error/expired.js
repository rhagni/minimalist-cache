'use strict';

/**
 * Expired error
 */
class ExpiredError extends Error {
	constructor() {
		super('expired');

		this.name = 'ExpiredError';

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = ExpiredError;
