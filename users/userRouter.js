const express = require('express');
const User = require('./userModel');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    User
      .find()
      .then(users => res.status(200).json("here are some users"))
      .catch(err => res.status(500).json("error fetching users"))
  })

module.exports = router;