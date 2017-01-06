'use strict';

const async = require('sonic-async');
const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET home page. */
router.post('/', function (req, res, next) {
  var objects = req.body || null;

  if (objects == null) {
    res.status(400);
    return res.json({error: 'Invalid POST format.'});
  }

  var items = typeof objects === 'object' && objects instanceof Array ? objects : [objects];

  async.each(items,
    function (item, next) {
      // enforce author to be a string without spaces
      if (typeof item.Author === 'string' && !item.Author.match(/^\w+$/)) {
        return next('Invalid nickname!');
      }
      // enforce room to be a string without spaces
      if (typeof item.Room === 'string' && !item.Room.match(/^\w+$/)) {
        return next('Invalid room name!');
      }
      models.messages.insert(item.Author, item.Room, item.Text, next);
    },
    function (err) {
      if (err) {
        res.status(400);
        return res.json({success: false, error: err});
      }
      return res.json({ success: true, messages: items });
    });
});

router.get('/', function (req, res, next) {
  // the channel is hardcoded to the public channel. Change this to support multiple channel listing
  models.messages.list('public', (err, messages) => {
    if (err) {
      return res.json({error: err});
    }
    return res.json(messages);
  });
});

module.exports = router;
