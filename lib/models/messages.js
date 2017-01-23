'use strict';

const log = require('../logger').log('models.messages');
const broker = require('../broker');
const thinky = require('../db').thinky;
const type = thinky.type;
const r = thinky.r;

// Define the Message model
const Message = thinky.createModel('messages', {
  // non optional string field with maximum 1024 caracthers.
  Text: type.string().max(1024).required(),
  Room: type.string().default('public'),
  CreateDate: type.date().default(r.now())
});

// Ensure the secondary indexes
// optional, to get all messages form a user, its nice to have the proper index.
Message.ensureIndex('Author');
// mandatory to list the messages of a room.
Message.ensureIndex('Room');
// mandatory to order the results chronologically.
Message.ensureIndex('CreateDate');

// Message change feed registration and handling
// Here is where the magic happens, every change in the message colletion will end up here.
// this implementation is based on the Thinky syntax: https://thinky.io/documentation/feeds/
Message.changes().then((changes) => {
  // just in case...
  if (changes == null) {
    return;
  }

  // the changes argument cames in a list of changes.
  return changes.each((err, message) => {
    if (err) {
      log.error(err);
      return;
    }

    // Message was deleted, skip
    if (message.isSaved() === false) {
      return;
    }

    log.info(message);
    // send the message throught the intra-process message broker
    broker.send('message', message.Room, message);
  });
}).error((error) => {
  // if there is an error at this stage, it doesn't manner, just log it.
  log.error(error);
});

// List messages by room.
exports.list = (room = 'public', callback) => {
  // implememed using the Thinky model and the standard ReQL syntax to:
  // Order, spefic room, limit to the last 50 (first step to pagination)
  Message
    // Order by CreateDate descendently.
    .orderBy({index: r.desc('CreateDate')})
    // Filter the results by the Room index
    .filter(r.row('Room').eq(room))
    // Slice for the first 50 results. (use slice and skip to pagination)
    .slice(0, 50)
    // ask for execute
    .run()
    // after the promise is resolved
    .then((objects) => {
      return callback(null, objects);
    })
    // if its rejected!
    .error((err) => {
      log.error(err);
      return callback(err);
    });
};

// insert new messages.
exports.insert = (user = 'Blaster', room = 'public', text, callback) => {
  // with the Message model, save a new message
  Message
    // I just use a list, because I can. It could save a single object or a list of objects
    .save([
      { Author: user, Room: room, Text: text }
      // after the promise is resolved
    ]).then((result) => {
      return callback(null, result);
      // if its rejected!
    }).error((err) => {
      log.error(err);
      return callback(err);
    });
};
