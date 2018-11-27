const express = require('express');
const cors = require('cors');
const knex = require('knex');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const bcrypt = require('bcryptjs');

const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

const server = express();

const sessionConfig = { 
  name: 'anyName',  // when left blank it was connect.sid
  secret: 'somerandom(*&*&#$#$)',
  cookie: {
    maxAge: 1000 * 60 * 10,  // in seconds
    secure: false   // only set it over https (in production you want this true)
  },
  httpOnly: true, // no js can touch this cookie
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfilename: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60,  // clear once an hour
  })
}

const protected = require('../middleware/protected.js');


server.use(session(sessionConfig)); // wires up session management
server.use(express.json());
server.use(cors());

// TABLE SCHEMA


// endpoints here

server.post('/api/register', (req, res) => {
  // 1. grab username and password from body
  // 2. generate the hash from the user's password
  // 3. override the user.password with the hash
  // 4. save the user to the database
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14)
  creds.password = hash;
  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json({ id: ids[0]});
    })
    .catch(err => {
      res.status(500).json({ message: 'Error inserting', err })
    })
})


server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password) ) {
        // user exists and password match
        req.session.userId = user.id;
        res.status(200).json({ message: 'Logged in', user: user.username})
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
})

server.get('/api/protected', protected, (req, res) => {
  // if (req.session && req.session.userId) {
    db('users')
    .select('id', 'username', 'password')
    .where({ id: req.session.userId })
    .first()
    .then(user => {
        res.status(200).json({ message: 'Logged into protected area', user: user.username})
    })
    .catch(err => res.send(err));
})


server.get('/api/users', protected, (req, res) => {
  // if (req.session && req.session.userId)
  db('users')
    .select('id', 'username', 'password')
    // .select('username') to see just users
    .then(users => {
      res.status(201).json({ users })
    })
    .catch(err => res.send(err));
});

server.get('api/logout', (req, res) => {
  if(req.ession) {
    req.ession.destroy(err => {
      if (err) {
        res.send('there is an issue logging out')
      } else {
        res.send('you have logged out')
      }
    })
  }
})

server.get('/', (req, res) => {
  res.json({ api: 'auth-i up' });
});

module.exports = server;