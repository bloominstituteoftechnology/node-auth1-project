const express = require('express');
const router = express.Router();
const users = require('../models/usersModels');

router.get('/', (req, res) => { // api user list endpoint
  users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get('/:id', (req, res) => { // view one user based off id and related actions

  const { id } = req.params;

  users.find(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'ERROR: User not found.' });
      }
    })
    .catch(err => res.json(err));
})

module.exports = router;