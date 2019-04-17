const router = require('express').Router();

const userModel = require('./users-model.js')
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, (req, res) => {
    userModel.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
});

  module.exports = router;