const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const server = express();
server.use(express.json());
server.use(cors());

server.use(
  session({
      name: 'session1',
      secret: 'lambda secret',
      cookie: {
          maxAge: 1*24*60*60*1000,
          secure: false,
      },
      httpOnly: true,
      resave: false,
      saveUninitialized: false,
      store: new KnexSessionStore({
          tablename: 'sessions',
          sidfieldname: 'sid',
          knex: db,
          createtable: true,
          clearInterval: 60*60*1000,
      })
  })
);

const protected = (req, res, next) => {
  if (req.session && req.session.username) {
      next();
  } else {
      res.status(401).json({ message: 'You must be logged in to access this page.' });
  }
}

server.get('/', (req, res) => {
  res.send("Hello!");
})

server.listen(3000, () => {
  console.log("Server started on port 3000.");
})

server.post('/api/register', (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;
  db('users').insert(user)
    .then(ids => {
      res.status(201).json(ids)
    })
    .catch(err => {
      res.status(400).json({ message: 'Registration failed.', error: err })
    })
})

server.get('/api/users', protected, (req, res) => {
  db('users')
      .select('id', 'username', 'password')
      .then(users => {
          res.status(200).json(users);
      })
      .catch(err => {
          res.status(500).json({ error: 'There was an error fetching the users', err });
      });
});

server.post('/api/login', (req, res) => {
  const credentials = req.body;
  db('users')
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ message: "You have successfully logged in." })
      } else {
        res.status(400).json({ message: "Incorrect credentials." })
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

server.get('/api/logout', protected, (req, res) => {
  if (req.session) {
      req.session.destroy(err => {
          if (err) {
              res.status(500).json({ error: 'Error logging out', err });
          } else {
              res.status(200).json({ message: 'Logout successful.' });
          }
      });
  }
});