const router = require('express').Router();
const User = require('../models/user');

const restrictAccess = (req, res, next) => {
  (req.session && req.session.userId)
    ? next()
    : res.status(401).json({ error: 'You shall not pass!' });
};

router
  .get('/', restrictAccess, (req, res) => {
    User.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(error => {
        res.status(500).json({ error: error });
      });
  })

module.exports = router;