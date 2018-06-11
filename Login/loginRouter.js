const express = require('express');

const Session = require('./loginSchema.js');

const router = express.Router();

router
  .route('/')
  .post((req, res) => {
    const session = new Session(req.body);
    session.save() 
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json({ error: err.message }));
  });

module.exports = router;