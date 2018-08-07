const express = require('express');
const db = require('./data/db');
const server = express();
const session = require('express-session');
const bcrypt = require("bcrypt");

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    return res.status(401).json({ error: 'You shall not pass!' });
  }
}

server.use(
  session({
    name: 'notsession',
    secret: 'zelda',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: false,
    resave: false,
    saveUninitialized: true,
  })
);

server.use(express.json());

server.post('/api/register', function(req, res) {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, 11);
  user.password = hash;

  if (!user) {
    res.status(400).json({ errorMessage: "Please provide a username and password." })
}

  db('users')
    .insert(user)
    .then(function(ids) {
      db('users')
        .where({ id: ids[0] })
        .first()
        .then(user => {
          req.session.username = user.username;
          res.status(200).json({'message': 'User registered'})
        });
    })
    .catch(function(error) {
      res.status(500).json({ 'error': 'Could not register user' });
    });
});

server.post('/api/login', (req, res) => {
  const credentials = req.body;
  db('users')
  .where({ username: credentials.username })
  .first()
  .then(user => {
    if (user && bcrypt.compareSync(credentials.password, user.password)) {
      return res.status(200).json({'message': 'You are now logged in.'})
    }
    return res.status(401).json({'errorMessage': 'The username and password you entered did not match our records. You shall not pass!'})
  })
  .catch(err => {
    res.status(500).json({'error': 'Could not login user'})
  })
});

server.get('/api/users', protected, (req, res) => {
  db('users')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({'error': 'Could not display users'})
    });
  });

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({'error': 'Could not log out'})
      } else {
        res.status(200).send('You are now logged out');
      }
    });
  } else {
    res.status(400).json({'error': 'You are not logged in'})
  }
});


const port = 8080;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
