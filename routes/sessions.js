var express = require('express');
var router = express.Router();

router.post('/new', function(req, res, next) {
    const today = new Date;
    // todo create session OR return code "already logged in"
    res.json({ token: 'djhbadiKSNADBHJASDA53S21D5AS', name: 'Guest', expiry: '' + today.setDate(today.getDate() + 1) });
  });

module.exports = router;
  