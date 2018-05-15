const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/logout', async (req, res) => {
  if (req.session) {
    req.session.destroy( err => {
      err ? res.send('error') : res.send("you're logged out");
    });
  }
});

router.get('/users', async (req, res) => {
  const users = await User.find({});

  res.status(200).json(users);
});

module.exports = router;
