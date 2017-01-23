'use strict';

const log = require('./logger').log('db');
const config = require('config');
const thinky = require('thinky')(config.get('rethinkdb'));

// expose the Thinky instance.
exports.thinky = thinky;

// use close to dispose the database connections properly (aka: gracefully shutdown).
exports.close = (callback) => {
  thinky.r.getPoolMaster().on('log', log.info);
  thinky.r.getPoolMaster().drain();
};
