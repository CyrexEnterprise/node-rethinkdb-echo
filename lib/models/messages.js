const
    log     = require('../logger').log("models.messages"),
    broker  = require('../broker'),
    thinky  = require('../db').thinky,
    type    = thinky.type,
    r       = thinky.r;

const Message = thinky.createModel("messages", {
    Text: type.string().required(),
    CreateDate: type.date().default(r.now())
});

Message.changes().then((changes) => {

    if( changes ==  null)
        return;
    return changes.each((err, message) => {

        if( err ){
            log.error(err);
            return;
        }

        log.info(message);
        broker.send('message', message.Room, message.Text);
    });
}).error((error) => {
    log.error(error);
});

exports.list = (callback) => {

    return callback();
};

exports.insert = (user, text, callback) => {

    return callback();
};
