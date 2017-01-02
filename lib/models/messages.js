const
    _       = require('lodash'),
    log     = require('../logger').log("models.messages"),
    broker  = require('../broker'),
    thinky  = require('../db').thinky,
    type    = thinky.type,
    r       = thinky.r;

// Define the Message model
const Message = thinky.createModel("messages", {
    // Author: type.string().required(),
    Text: type.string().max(1024).required(),
    Room: type.string().default("public"),
    CreateDate: type.date().default(r.now())
});

// Ensure the secondary indexes
Message.ensureIndex("Author");
Message.ensureIndex("Room");
Message.ensureIndex("CreateDate");

// Message change feed registration and handling
Message.changes().then((changes) => {

    if( changes ==  null)
        return;
    return changes.each((err, message) => {

        if( err ){
            log.error(err);
            return;
        }

        // Message was deleted, skip
        if (message.isSaved() === false)
            return;

        log.info(message);
        broker.send('message', message.Room, message);
    });
}).error((error) => {
    log.error(error);
});

exports.list = (callback) => {

    Message
        .orderBy({index: r.desc("CreateDate")})
        .slice(0, 50)
        .run()
        .then((objects) => {
            return callback(null, objects);
        })
        .error((err) => {
            log.error(err);
            return callback(err);
        });
};

/*
    TODO:
    Check the room authorization
*/
exports.insert = (user = "Blaster", room = "public", text, callback) => {

    Message.save([
        { Author: user, Room: room, Text: text }
    ]).then((result) => {
        return callback(null, result);
    }).error((err) => {
        log.error(err);
        return callback(err);
    });
};
