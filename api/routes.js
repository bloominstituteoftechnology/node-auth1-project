const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'api' });
})

const echo = (req, res) => {
  res.status(200).json({
    message: 'hey this endpoint work!',
    params: req.params,
    query: (req.query ? req.query : ''),
    body: req.body
  });
}

router.post('/login', echo)
router.post('/register', echo)
router.get('/users', echo)

module.exports = router;