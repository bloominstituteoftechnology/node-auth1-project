const express = require('express');

const router = express.Router();

const db = require('./model')

router.get('/', (req, res) => {
    res.json({ api: "It's alive" });
  });


  router.get('/user', (req, res) => {
    db.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(500).json({message: "You shall not pass!"})
      });
  });

module.exports = router;