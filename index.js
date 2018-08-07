const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./data/db.js');
 
const server = express();

function protected(req, res, next) {
  if (req.session && req.session.username === 'Jameson13B') {
    next();
  } else {
    return res.status(401).json({ error: 'Incorrect credentials' });
  }
}

server.use(
  session({
    name: 'notsession',
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: true,
  })
);

server.use(express.json());

server.get('/', (req, res) => {
  res.send('API is running!');
});

server.post('/register', function(req, res) {
  const user = req.body;

  // hash password
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  db('users')
    .insert(user)
    .then(function(ids) {
      db('users')
        .where({ id: ids[0] })
        .first()
        .then(user => {
          req.session.username = user.username;
          res.status(201).json(user);
        });
    })
    .catch(function(error) {
      res.status(500).json({ error });
    });
});

server.post('/login', function(req, res) {
  const credentials = req.body;
  db('users')
    .where({ username: credentials.username })
    .first()
    .then(function(user) {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        req.session.username = user.username;
        res.send(`welcome ${user.username}`);
      } else {
        return res.status(401).json({ error: 'Incorrect credentials' });
      }
    })
    .catch(function(error) {
      res.status(500).json({ error });
    });
});

server.get('/users', protected, (req, res) => {
  db('users')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/logout', (req, res) => {
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

server.listen(3300, () => console.log('API is running on 3300'));