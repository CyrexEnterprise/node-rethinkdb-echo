const should = require('should');

describe('Check if there is a RethinkDB running and could do the ORM read and write operations.', function () {
  it('Connect to the configured DB.', function (done) {
    try {
      let db = require('../lib/db');
      return done(db.thinky.r == null ? new Error('No Connection') : null);
    } catch (e) {
      return done(e);
    }
  });

  it('Insert a new message into the BD.', function (done) {
    try {
      let messages = require('../lib/models/messages');

      messages.insert('MrTester', 'test', 'A message from the tester', done);
    } catch (e) {
      return done(e);
    }
  });

  it('Get a list of messages in the DB.', function (done) {
    try {
      let messages = require('../lib/models/messages');

      messages.list((err, messages) => {
        if (err) {
          return done(err);
        }
        should(messages).be.ok();
        should(messages.length).be.above(-1);
        should(messages.length).be.below(51);
        done();
      });
    } catch (e) {
      return done(e);
    }
  });
});
