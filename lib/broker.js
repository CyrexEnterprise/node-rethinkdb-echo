'use strict';

const log = require('./logger').log('broker');
const EventEmitter = require('events').EventEmitter;

class Broker extends EventEmitter {

  send (event = 'unknown', room = 'public', message) {
    if (!message) {
      log.error('Nothing to send, aborting the event emit!');
      return;
    }

    setImmediate(() => {
      this.emit(event, { room, message });
    });
  }
}

module.exports = new Broker();
