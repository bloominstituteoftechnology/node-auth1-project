const router = require('express').Router();
const User = require('./users-model');
const { restricted } = require('../auth/auth-middleware');

router.get('/', restricted, (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(next);
});

module.exports = router;
