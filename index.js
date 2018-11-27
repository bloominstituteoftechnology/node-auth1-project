const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./database/dbConfig');

const server = express();
const port = 8080;
const sessionConfig = {
  name: 'chimichurri',
  secret: 'story of my lyf serchin fordarai keeps keeps pordami',
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 5, // 5mins til session expires
    secure: false,  // set it to true when using https, irl: true
  },
  store: new KnexSessionStore({
    tablename: 'session',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

// middleware
server.use(express.json());
server.use(session(sessionConfig)); // wires up session management

// custom middleware
const protected = (req, res, next) => {
  if (req.session && req.session.userId) {
    // user is logged in
    next();
  } else {
    res.status(401).json({ message: 'You shall not pass!' });
  }
};

// test api
server.get('/', (_, res) => res.send('API is running...'));

// ===================== ENDPOINTS =====================
// retrieve users
server.get('/api/users', protected, (_, res) => {
  db('users')
    .select('id', 'username') // exclude password col
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json(err));
});

// register a new user
server.post('/api/register', (req, res) => {
  // initial value: {}
  // will populate it with the appropriate props when creating a new user
  // props: username, password
  console.log(req.body)
  const creds = req.body;

  // generates a hash for the user's password
  const hash = bcrypt.hashSync(creds.password, 8); // rounds to 2^X; in this case, X is 8

  // overrides the password prop with the hash
  creds.password = hash;

  // save the new user to the database
  db('users')
    .insert(creds)
    .then(id => {
      res.status(201).json({ message: `ID ${id} created` });
    })
    .catch(err => res.status(500).json(err));
});

// login a user
server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // if the user exists and passwords match,
        req.session.userId = user.id;
        res.status(200).json({ message: 'Logged in' })
      } else {
        // either username is invalid or password is wrong
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
