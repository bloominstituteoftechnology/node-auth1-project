const express = require('express');
const router = express.Router();
const middleware = require('../middleware');

router.get('/page', middleware.isLoggedIn, (req, res) => {
  res.send('Blah blah blah');
});

module.exports = router;
