const express = require('express');
const bcrypt = require('bcryptjs'); 

const Users = require('./users-model.js');
const authenticate = require('../auth/authenticate-middleware.js');

const router = express.Router();



router.get('/', (req, res) => {
  res.send("It's alive!");
});

router.post('/register', (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8); 
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// protect /api/users so only clients that provide valid credentials can see the list of users
// read the username and password from the headers instead of the body (can't send a body on a GET request)
router.get('/users', authenticate, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;