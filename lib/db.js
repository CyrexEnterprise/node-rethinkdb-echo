"use strict"

const
    log     = require('./logger').log("db"),
    config  = require('config'),
    thinky  = require('thinky')(config.get('rethinkdb'));

exports.thinky = thinky;

exports.close = (callback) => {
  thinky.r.getPoolMaster().on('log', log.info);
  thinky.r.getPoolMaster().drain();
};
