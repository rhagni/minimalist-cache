'use strict';

/**
 * Undefined error
 */
class UndefinedError extends Error {
	constructor() {
		super('undefined');

		this.name = 'UndefinedError';

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = UndefinedError;
