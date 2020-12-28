let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).send('');
});

/* GET Availability of service. Result contains timestamp  */
router.get('/test', function(req, res, next) {
    res.status(200).send({availableAt: Date.now()});
});

module.exports = router;
