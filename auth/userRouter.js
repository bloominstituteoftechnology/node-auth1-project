const express = require('express');
const bcrypt = require("bcrypt");
const User = require("./UserModel");
const router = express.Router();

router
  .route('/')
  .post((req, res) => {
    const user = new User(req.body);
    user.save()
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json({
        error: err.message
      }));
  });
router
  .route
  .post('/api/register', (req, res) => {
    const user = new User(req.body);

    user.save().then(savedUser => res.status(200).json(savedUser))
      .then(err => res.status(500).json(err));
  });

module.exports = router;