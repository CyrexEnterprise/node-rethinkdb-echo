'use strict';

const log = require('./logger').log('broker');
const EventEmitter = require('events').EventEmitter;

// create and extends from the EventEmitter
class Broker extends EventEmitter {

  // ensure format and send messages to the listeners.
  send (event = 'unknown', room = 'public', message) {
    if (!message) {
      log.error('Nothing to send, aborting the event emit!');
      return;
    }
    // just to ensure that the event looper is healthy.
    setImmediate(() => {
      this.emit(event, { room, message });
    });
  }
}

module.exports = new Broker();
