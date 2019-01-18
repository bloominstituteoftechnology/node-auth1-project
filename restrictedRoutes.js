const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Access granted!');
});

router.get('/something', (req, res) => {
  res.send('Access granted!');
});

router.get('/another', (req, res) => {
  res.send('Access granted!');
});

router.post('/lastone', (req, res) => {
  res.send('Access granted!');
});

module.exports = router;
