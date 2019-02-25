const express = require('express');

const router = express.Router();

const Users = require('../users/users-module');
router.use(express.json());

router.get('/', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
