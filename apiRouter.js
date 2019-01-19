const express = require('express');
const router = express.Router();
const db = require('./database/dbHelpers');
const middleWare = require('./middleware.js')
const bcrypt = require('bcryptjs');

// basic get request to test if

router.get('/', (req, res) => {
  res.send("It's alive");
});

//this route should be protected, only authenticated users should be able to see it
router.get('/users', middleWare.protect, (req, res) => {
  db.getUsers()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err))
});

router.post('/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 16) // 16 denotes how many times its hashes
  db.insertUser(user)
    .then(id => {
      res.status(201).json({ id: id[0] })
    })
    .catch(err => {
      res.status(500).json({ error: 'Please Try Again' })
    });
});

router.post('/login', (req, res) => {
  const creds = req.body;
  db.findByUsername(creds.username)
    .then(users => {
      if (users.length && bcrypt.compareSync(creds.password, users[0].password)) {
        req.session.userId = users[0].id
        res.json({ info: 'Success' })
      } else {
        res.status(404).json({ err: 'invalid password or username' })
      }
    })
    .catch(err => {
      res.status(404).json(err)
    });
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send('not logged out');
    } else {
      res.send('logout successful');
    };
  });
});

module.exports = router;