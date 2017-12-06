'use strict';

/* eslint-disable no-eval */

const fs = require('fs');

const path = require('path');

const os = require('os');

const serialize = require('serialize-javascript');

const UndefinedError = require('../error/undefined.js');

const ExpiredError = require('../error/expired.js');

const DriverInterface = require('./interface.js');

const deserialize = data => {
	return eval('(' + data + ')');
};

const defaultPath = path.join(os.tmpdir(), 'minimalist-cache');

const fsOptions = {
	encoding: 'latin1'
};

const safeFilename = filename => {
	return String(filename || '').replace(/[^A-Za-z0-9 _\-.]/g, match => {
		return '%' + match.charCodeAt(0).toString(16);
	});
};

const filename = (folder, file) => {
	return path.join(folder, safeFilename(file));
};

/**
 * @param {string} identifier
 * @param {mixed} data
 * @return {promise}
 */
class FSDriver extends DriverInterface {
	/**
	 * @inheritdoc
	 */
	constructor(options) {
		super(options);

		options = Object.create(options || null);

		this.path = String(options.path || defaultPath);

		try {
			fs.mkdirSync(this.path);
		} catch (err) {
		}
	}

	/**
	 * @inheritdoc
	 */
	set(identifier, data, createdAt) {
		return new Promise((resolve, reject) => {
			const file = filename(this.path, identifier);

			const content = {
				createdAt: createdAt || new Date(),
				data
			};

			const serialized = serialize(content);

			fs.writeFile(file, serialized, fsOptions, err => {
				if (err) {
					return reject(err);
				}

				return resolve();
			});
		});
	}

	/**
	 * @inheritdoc
	 */
	get(identifier, expires) {
		return new Promise((resolve, reject) => {
			const file = filename(this.path, identifier);

			fs.readFile(file, fsOptions, (err, serialized) => {
				if (err) {
					return reject(new UndefinedError());
				}

				const content = deserialize(serialized);

				if (expires) {
					const expiration = content.createdAt.getTime() + (expires * 1000);

					if ((new Date()).getTime() > expiration) {
						return reject(new ExpiredError());
					}
				}

				console.log(content.data, content.createdAt);

				return resolve(content.data, content.createdAt);
			});
		});
	}
}

module.exports = FSDriver;
