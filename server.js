const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const db = require('./data/db');

const server = express();

server.use(
  session({
    name: 'notsession',
    secret: 'shhh do not tell',
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    httpOnly: true,
    secure: false,
    resave: false,
    saveUninitialized: true,
  })
)

server.use(express.json());

const protected = (req, res, next) => {
  if(req.session && req.session.name) {
    next();
  } else {
    res
      .status(401)
      .json({ error: 'You shall not pass!' })
      .end();
  }
}

// Not fully implemented, only here to test that passwords have been hashed
server.get('/api/users', protected, (req, res) => {
  db('users')
    .then(response => {
      res
        .status(200)
        .json(response)
        .end()
    })
    .catch(err => {
      res
        .status(500)
        .json(err)
        .end()
    })
})

server.post('/api/register', (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  if(!(credentials.user || credentials.password)) {
    res
      .status(401)
      .json({ error: 'Please enter a username and password.' })
      .end()
  } else {
    db('users')
      .insert(credentials)
      .then(response => {
        res
          .status(200)
          .json(response)
          .end()
      })
      .catch(err => {
        res
          .status(500)
          .json(err)
          .end()
      })
  }
})

server.post('/api/login', (req, res) => {
  const credentials = req.body;
  const username = credentials.username;
  db('users')
    .where({ username })
    .first()
    .then(response => {
      const password = response.password;
      const passwordMatch = bcrypt.compareSync(credentials.password, password);
      if (!passwordMatch) {
        res
          .status(401)
          .json({ error: 'Please enter valid credentials' })
          .end()
      } else {
        req.session.name = response.username;
        res
          .status(200)
          .json({ success: true })
          .end()
      }
    })
    .catch(err => {
      res
        .status(401)
        .json({ error: 'Please enter valid credentials' })
        .end()
    })
})

server.listen(8000, () => console.log('API running on Port 8000'));