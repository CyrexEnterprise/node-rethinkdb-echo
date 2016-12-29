const
    express = require('express'),
    router = express.Router();
const
    models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Echo blaster!' });
});

module.exports = router;
