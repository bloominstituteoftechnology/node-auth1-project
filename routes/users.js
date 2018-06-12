const router = require('express').Router();
const User = require('../models/user');

router
  .get('/', (req, res) => {
    User.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(error => {
        res.status(500).json({ error: error });
      });
  })

module.exports = router;