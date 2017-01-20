'use strict';

const _ = require('lodash');
const log = require('./logger').log('socket.io');
const models = require('./models');
const broker = require('./broker');

module.exports = (server, callback) => {
  let io;
  try {
    // init socket.io
    io = require('socket.io').listen(server);
  } catch (e) {
    log.error(e);
    return callback(e);
  }

  io.on('connection', (socket) => {
    socket.join('public');
    log.info(socket.id, 'connected');
    models.messages.list((err, messages) => {
      if (err) {
        log.error(err);
        return;
      }
      let messagesByGroup = _.groupBy(messages, 'Room');
      for (let room in messagesByGroup) {
        io.to(socket.id).emit('messages', messagesByGroup[room].map((m) => { return m }));
      }
    });
  });

  broker.on('message', (data) => {
    log.info(`message to ${data.room} channel: ${data.message.Text}`);
    io.to(data.room).emit('messages', data.message);
  });

  return callback(null, io);
};
