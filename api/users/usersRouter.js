const router = require('express').Router();
const Users = require('./usersModel');

router.get('/', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
})

router.get('/:id', (req, res) => {
  Users.findById(req.params.id)
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
})

module.exports = router;