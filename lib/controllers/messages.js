const   express = require('express'),
        router = express.Router();

const   models = require('../models');

/* GET home page. */
router.post('/', function(req, res, next) {
    res.render('index', { title: 'Echo blaster!',  });
});

router.get('/', function(req, res, next) {
    models.messages.list((err, messages) => {
        if( err )
            return res.json({error: err});

        return res.json(messages);
    });
});

module.exports = router;
