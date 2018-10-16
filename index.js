const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);
const bcrypt = require('bcryptjs');
const session = require('express-session');

const sessionConfig = {
  secret: 'you.shall.not.pass.!',
  name: 'monkey', // defaults to --> connect.sid (session id)
  httpOnly: true, // i don't want this to be accessed by JS
  resave: false,
  saveUninitialized: false, // laws !
  cookie: {
    secure: false, // only over HTTPS, in production it'll be set to true
    maxAge: 1000 * 60 * 1 // when the cookie expires
  } // cookie
}

const server = express();
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
  res.send('Its Alive!');
});



server.get('/api/users', protectedRoute, (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      if (!users || users.length < 0) 
      {
        res.status(404).json({ missing: 'Could not find users in the database, either empty or try again' });        
      } else 
      {
        res.status(200).json(users);
      }

    })
    .catch(err => res.send(err));
});

server.post('/api/register', (req, res) => {
  const creds = req.body;

  // 1. hash the password
  const hash = bcrypt.hashSync(creds.password, 15);
  creds.password = hash; // so we can't access the plain text password

  // 2. Save user into db

  db('users')
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      console.log('creds entered', creds); // is an object of your username and password, the password is hashed
      console.log('req session', req.session); // session is an object, like the one below
      req.session.username = creds.username;
      console.log(req.session.username, 'req username'); // adds a username to the session object
      res.status(201).json({ newUserId: id }) // when they post, this is what shows
    })
    .catch(err => res.status(500).json(err));
});

server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {

      if (user && bcrypt.compareSync(creds.password, user.password))
      {
        req.session.username = user.username;
        res.status(200).json({ welcome: creds.username });
      } else 
      {
        res.status(401).json({ message: "Oops! Try Again!" });
      }

    })
    .catch(err => res.status(500).json(err));
});

server.get('/api/logout', (req, res) => {
  if (req.session)
  {
    req.session.destroy(err => {

      if (err) {
        res.send('You are stuck here mortal! Mwahahahaha');
      } else {
        res.send('Logout successful. Good bye!');
      }

    });
  }
});

function protectedRoute(req, res, next) {
  // req.session is an object
  if (req.session && req.session.username) {
    next(); // continue as usual
  } else { // else if not authorized...
    res.status(401).json({ authError: 'FBI DON\'T MOVE!' });
  }
}


server.listen(4405, () => console.log('\nrunning on port 4405\n'));