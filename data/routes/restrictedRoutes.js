const express = require('express');

const router = express.Router();

router.use(function protect(req, res, next) {
  if (req.session && req.session.userId) next();
  else res.status(401).json({ error: 'You shall not pass!' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Welcome' });
});

module.exports = router;
