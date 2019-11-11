const router = require('express').Router();
const bcrypt = require('bcryptjs')

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let userInformation = req.body;

  bcrypt.hash(userInformation.password, 12, (err, hashedPasswod) => {
    userInformation.password = hashedPasswod;

    Users.add(userInformation)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
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


router.post('/hash', (req, res) => {
  //read password
  const password = req.body.password;
  // hash
  const hash = bcrypt.hashSync(password, 8)
  //return to user in an ob
  res.status(200).json({ password, hash })
})
module.exports = router;