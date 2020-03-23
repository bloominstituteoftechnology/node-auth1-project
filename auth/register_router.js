const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../users/users_model');

const router = express.Router();

router.post('/', (req, res) => {
  const userInfo = req.body;

  const ROUNDS = process.env.HASING_ROUNDS || 8;
  const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

  userInfo.password = hash;

  User.add(userInfo)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({message: 'Error registering', error: err.message});
    });
});

module.exports = router;
