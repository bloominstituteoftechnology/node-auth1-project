const router = require('express').Router();
const User = require('../models/user');

router
  .post('/', (req, res) => {
    const { username, password } = req.body;
    User.create({ username, password })
      .then(user => {
        res.status(201).json(user);
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  })

module.exports = router;