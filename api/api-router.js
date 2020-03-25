const bcrypt = require('bcryptjs');
const router = require('express').Router();
const restricted = require('../auth/restricted-middleware.js');

const Users = require('../users/user-model.js');

router.get('/hash', (req, res) => {
  const authentication = req.headers.authentication;
  const hash = bcrypt.hashSync(authentication, 10);
  res.json({ originalValue: authentication, hashedValue: hash })
})

router.get('/' , restricted, (req, res) => {
  res.json({ api: "It's alive" });
});

router.get('/users', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
})

router.post('/register', (req, res) => {
  let user = req.body;
  
  const hash = bcrypt.hashSync(user.password, 8)

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
      user && bcrypt.compareSync(password, user.password)
      ? res.status(200).json({ message: `Welcome ${user.username}!` })
      : res.status(401).json({ message: 'Invalid Credentials' });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;