const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const server = express();
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

// additional session requirements

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex');

// session configuration

const sessionConfig = {
  store: new KnexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 30000
  }),
  secret: "this.isMy-Secret",
  name: "Evan",
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // maybe test this as a true value too?
    maxAge: 1000 * 60 * 1
  }
};

server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

// server functions

// test GET function

server.get('/api', (req, res) => {
  res.send('Server test.');
});

// GET users information

server.get('/api/users', protected, (req, res) => {
  const credentials = req.body;
  // console.log(req.session);

  db('users')
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
});

// additional protection function

function protected(req, res, next) {
  if (req.session && req.session.userId) {
    console.log(req.session.userId);
    next();
  } else res.status(400).json({ error: "You are not authorized to view this resource. "});
}
// POST a user via register

server.post('/api/register', (req, res) => {
const credentials = req.body;
// console.log(credentials);
const hash = bcrypt.hashSync(credentials.password, 14);
credentials.password = hash;
// console.log(credentials); <- check if there is a change

db('users')
  .insert(credentials)
  .then(sessionID => {
    const id = sessionID[0];
    req.sessionID = id;
    res.json({ userId: id });
  })
  .catch(err => res.status(500).json(err.message));
});

// authenticate login via POST

server.post('/api/login', (req, res) => {
  const credentials = req.body;
  db('users')
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        req.session.userId = user.id;
        res.status(200).json({ message: "Login successful!" });
      } else res.status(401).json({ message: "Access denied. Please try again. "});
    })
    .catch(err => res.status(500).send(err));
  });

// logout function

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('The system encountered an error. Please try again.');
      } else res.json({ message: "You have been successfully logged out. "});
    });
  }
});

// server instantiation

const port = 8000;
server.listen(port, () => console.log('Server listening on port 8000.'));
