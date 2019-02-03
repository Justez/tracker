var express = require('express');
var router = express.Router();

/* GET new page. */
router.get('/', function(req, res, next) {
  res.render('accounts', { title: 'Tracker' });
});

module.exports = router;
