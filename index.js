// Import node modules
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
// const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./database/dbConfig.js');

const server = express();// creates the server

const sessionConfig = {
  secret: 'nobody.tosses.a.dwarf.!',
  name: 'cookie', // default to connect.sid
  httpOlny: true, // JS can't access this
  resave: false,
  saveUninitialized: false, // laws!
  cookie: {
    secure: false, // over httpS
    maxAge: 1000 * 60 * 1 // keep logged on for 1 minute
  },
  // store: new KnexSessionStore({
  //   tablename: 'sessions',
  //   sidfieldname: 'sid',
  //   knex: db,
  //   createtable: true,
  //   clearInterval: 1000 * 60 * 60, // remove only expired sessions every hour
  // })
};



// Add GLOBAL MIDDLEWARE
server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

// middleware to restrict access to protected routes
function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'Not Authorized' });
  }
}

// ROUTES

//Add home route
server.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Add POST ROUTE HANDLER to register/create a user
server.post('/api/register', (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Add POST ROUTE HANDLER to create api login endpoint
server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ welcome: `You are logged in ${user.username}!` });
      } else {
        res.status(401).json({ message: 'you shall not pass!' });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// Add POST ROUTE HANDLER to protect GET ROUTE HANDLER to access all users
// so that only authenticated users can see it
server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ welcome: user.username });
      } else {
        res.status(401).json({ message: 'Invalid username and password' });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// Add GET ROUTE HANDLER to access all users
server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// api logout endpoint
server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});

server.listen(3500, () => console.log('\n====running on port 3500====\n'));