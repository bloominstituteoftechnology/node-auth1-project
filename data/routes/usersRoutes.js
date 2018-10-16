const express = require('express');
const router = express.Router();
const users = require('../models/usersModels');
const session = require('express-session'); // session library
const server = express(); // needed for sessions

const sessionConfig = {
  secret: 'its.a.secret.to.everybody',
  name: 'lambda', // defaults to connect.sid
  httpOnly: true, // JS cannot access this session
  resave: false,
  saveUninitialized: false, // Legally obligated!
  cookie: {
    secure: false, // over https false
    maxAge: 1000 * 60 * 1 // 1000 ms * 60 seconds * 1 minute 
  }
}
server.use(session(sessionConfig))
router.get('/', (req, res) => { // api user list endpoint
  users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get('/:id', (req, res) => { // view one user based off id and related actions
  const { id } = req.params;
  if (req.session && req.session.username) { // check if user is on session
    users.find(id)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: 'ERROR: User not found.' });
        }
      })
      .catch(err => res.json(err));
  } else {
    res.status(401).send('Not authorized')
  }
})

module.exports = router;