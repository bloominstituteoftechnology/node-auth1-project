const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'This should only be viewable if logged in.' });
});

router.get('/a', (req, res) => {
  res.status(200).json({ message: 'This should ALSO only be viewable if logged in' });
});

module.exports = router;
