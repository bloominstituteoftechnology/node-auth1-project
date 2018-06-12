const router = require('express').Router();
const restrictedRouter = require('express').Router();
const User = require('../models/user');

router
  .get('/', (req, res) => {
    res.redirect('/api/restricted/users');
  });

restrictedRouter
  .get('/', (req, res) => {
    User.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(error => {
        res.status(500).json({ error: error });
      });
  })

module.exports = {
  v1: router,
  v2: restrictedRouter
};