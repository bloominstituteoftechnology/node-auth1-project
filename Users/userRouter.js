const express = require('express');

const User = require('./userSchema.js');

const router = express.Router();

router
  .route('/')
  .post((req, res) => {
    const user = new User(req.body);
    user.save() 
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json({ error: err.message }));
  });

module.exports = router;