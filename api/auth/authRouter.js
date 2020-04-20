const router = require('express').Router();
const bcrypt = require('bcrypt');
const Users = require('../users/usersModel');

router.post('/register', (req, res) => {
  const user = req.body;
  const rounds = process.env.HASH_ROUNDS || 10
  const hash = bcrypt.hashSync(user.password, rounds)
  const pass = hash

  Users.add(user)
    .then(([addedUser]) => {
      console.log(addedUser)
      res.status(201).json(addedUser)
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal server error`, err }))
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if(user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true
        res.status(200).json({ message: `Permitted Access.` });
      } else {
        res.status(401).json({ message: `Unauthorized Access, please login.` })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal server error`, err }))
});

module.exports = router;
