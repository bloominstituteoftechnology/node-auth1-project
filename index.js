const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// server requirements
const server = express();
const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);
const PORT = 3636;

// configure express-session middleware
server.use(
  session({
    name: 'mysession',
    secret: 'this is my lil secret yo',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);

server.use(express.json());

// endpoints

// REGISTER POST:
server.post('/api/register', (req, res) => {
  const newUser = req.body;
  if (newUser.name && newUser.password) {
    newUser.password = bcrypt.hashSync(newUser.password, 12);
    db('users').insert(newUser)
      .then(newId => {
        res.status(201).json(newId);
      })
      .catch(err => {
        res.status(500).json({ error: "Could not register a new user." });
      })
  } else {
    res.status(400).json({ error: "Please provide a name and a password." })
  }
});

// LOG IN POST:
server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users').where('name', creds.name)
    .then(user => {
      if (user.length && bcrypt.compareSync(creds.password, user[0].password)) {
        req.session.userId = user[0].id;
        res.json({ info: "You have succesfully logged in" });
      } else {
        res.status(201).json({ error: "Wrong username or password" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to log in' });
    });
});

// GET:
server.get('/api/users', (req, res) => {
  if (req.session && req.session.userId) {
    db('users').select('id', 'name')
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    res.status(400).send('access denied')
  }
});

server.listen(PORT, () => {
  console.log(`\n=== Web API listening on http://localhost:${PORT} ===\n`);
});