const
    winston = require('winston'),
    thinky  = require('../db').thinky,
    type    = thinky.type,
    r       = thinky.r;

const Message = thinky.createModel("messages", {
    Text: type.string().required(),
    CreateDate: type.date().default(r.now())
});

exports.list = (callback) => {

    return callback();
};

exports.insert = (text, callback) => {

    return callback();
};
