/* eslint-disable prefer-const */
const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  Users.add(user)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Registration error!', error: err });
    });
});

// router.post('/login', authorize, (req, res) => {
//   const { username } = req.headers;
//   res.status(200).json({ message: `Welcome ${username}!` });
// });
router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = username;
        res.status(200).json({ message: `Welcome to the app ${username} !` });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    })
    .catch((err) => { res.status(500).json({ message: 'Problem with the db', error: err }); });
});

router.delete('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({ message: 'error logging out:', error: err });
      } else {
        res.json({ message: 'logged out' });
      }
    });
  } else {
    res.end();
  }
});
module.exports = router;
