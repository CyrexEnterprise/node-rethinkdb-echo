const
    log     = require('./logger').log("socket.io"),
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
    });

    broker.on("message", (data) => {
        log.info(`message to ${data.room} channel: ${data.message}`);
        io.to(data.room).emit("messages", data.message);
    });

    return callback(null, io);
}
