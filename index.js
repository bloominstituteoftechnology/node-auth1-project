const express = require('express');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const bcrypt = require('bcryptjs'); // *************************** added package and required it here

const db = require('./database/dbConfig.js');

const server = express();
const port = 9000;

const sessionConfig = {
  name: 'monkey',
  secret: 'asfjaofuwruq04r3oj;ljg049fjq30j4jlajg40j40tjojasl;kjg',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false // only set it over https; in production you want this true.
  },
  httpOnly: true, // no js can touch this cookie
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(session(sessionConfig)); // wires up session management
server.use(express.json());
server.use(cors());

server.post('/api/login', (req, res) => {
  // grab username and password from body
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // passwords match and user exists by that username
        req.session.user = user.id;
        res.status(200).json({ message: 'Welcome!', userid: req.session.user });
      } else {
        // either username is invalid or password is wrong
        res.status(401).json({ message: 'you shall not pass!!' });
      }
    })
    .catch(err => res.json(err));
});

function protected(req, res, next) {
  if (req.session && req.session.user) {
    // they're logged in, go ahead and provide access
    next();
  } else {
    // bounce them
    res.status(401).json({ you: 'shall not pass!!' });
  }
}

// protect this route, only authenticated users should see it
server.get('/api/me', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password') // ***************************** added password to the select
    .where({ id: req.session.user })
    .first()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// protect this route, only authenticated users should see it
server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password') // ***************************** added password to the select
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('you can never leave');
      } else {
        res.send('bye');
      }
    });
  } else {
    res.end();
  }
});

server.post('/api/register', (req, res) => {
  //grab username and password from body
  const creds = req.body;
  //generate the hash from the user's password
  const hash = bcrypt.hashSync(creds.password, 14);
  //override the password with the hash
  creds.password = hash;
  //save the user to the database.
  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => console.log(err));
});

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

server.listen(port, () => console.log(`\nAPI running on port ${port}\n`));
