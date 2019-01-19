const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./database/dbHelpers.js');

const server = express();

function protectMiddleware(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(400).send('You shall not pass!')
  }
}

server.use(express.json());
server.use(cors());
server.use(session({
  name: 'notsession', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
}))

server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 15);
  db.insert(user)
    .then(ids => {
      res.status(201).json({ id: ids[0] });
    })
    .catch(err => {
      res.status(500).send(err);
    })
})

server.post('/api/login', (req, res) => {
  const user = req.body;
  db.findByUsername(user.username)
    .then(users => {
      if (users.length && bcrypt.compareSync(user.password, users[0].password)) {
        res.json({ message: "Logged in" })
      } else {
        res.status(404).json({ err: "Invalid username or password" });
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

server.get('/api/users', protectMiddleware, (req, res) => {
  db.getUsers()
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      res.status(500).json({ error: 'Server go boom' });
    })
})

const PORT = 3300;
server.listen(3300, () => {
  console.log(`\nServer is running on PORT ${PORT}\n`);
})