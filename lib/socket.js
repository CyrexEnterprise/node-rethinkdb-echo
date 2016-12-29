const
    log = require('winston');

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

        log.info( socket.id, "connected");

    });

    return callback(null, io);
}
