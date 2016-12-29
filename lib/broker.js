const
    EventEmitter = require('events').EventEmitter,
    inherits     = require('util').inherits;

function Broker() {
  var self = this;
  EventEmitter.call(self);
}

inherits(Broker, EventEmitter);

Broker.prototype.send = (event, room, data) => {
  var self = this;

  if( !event )
    event = "news";
  if( !room )
    room = "global"
  if( !data )
    return;

  setImmediate( () => {
      self.emit(event, { room: room, data: data });
  });
};

module.exports = new Broker();
