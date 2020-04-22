const bcrypt = require('bcryptjs');

const router = require('express').Router();

const authorize = require('../middleweare');
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

router.post('/login', authorize, (req, res) => {
  const { username } = req.headers;
  res.status(200).json({ message: `Welcome ${username}!` });
});
// router.post('/login', authorize (req, res) => {
//   const { username, password } = req.body;

//   Users.findBy({ username })
//     .then(([user]) => {
//       if (user && bcrypt.compareSync(password, user.password)) {
//         req.session.user = username;
//         res.status(200).json({ message: `Welcome to the app ${username} !` });
//       } else {
//         res.status(401).json({ message: 'Invalid credentials' });
//       }
//     })
//     .catch((err) => { res.status(500).json({ message: 'Problem with the db', error: err }); });
// });

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});
module.exports = router;
