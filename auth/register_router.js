const express = require('express');
const User = require('../users/users_model');

const router = express.Router();

router.post('/', (req, res) => {
  const userInfo = req.body;

  User.add(userInfo)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({message: 'Error registering', error: err.message});
    });
});

module.exports = router;
