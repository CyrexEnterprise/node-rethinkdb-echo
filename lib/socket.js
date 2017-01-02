const
    _       = require('lodash'),
    log     = require('./logger').log("socket.io"),
    models  = require('./models'),
    broker  = require('./broker');

module.exports = (server, callback) => {

    let io;
    try {
        // init socket.io
        io = require('socket.io').listen(server);
    } catch(e){

        log.error(e);
        return callback(e);
    }

    io.on('connection', function(socket){

        socket.join('public');

        log.info( socket.id, "connected");
        models.messages.list(function(err, messages){
            if( err ){
                log.error(err);
                return;
            }
            let messagesByGroup = _.groupBy(messages, "Room");
            for( let room in messagesByGroup ){
                io.to(room).emit("messages", messagesByGroup[room].map((m) => { return m; }));
            }
        });
    });

    broker.on("message", (data) => {
        log.info(`message to ${data.room} channel: ${data.message.Text}`);
        io.to(data.room).emit("messages", data.message);
    });

    return callback(null, io);
}
