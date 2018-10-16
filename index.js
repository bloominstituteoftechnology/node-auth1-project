const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();
const port = 9000;

const sessionConfig = {
  secret: 'heck-if-I.know%',
  name: 'eagle', //defaults to connect.sid
  httpOnly: true, // JS can't access this
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, //over httpS
    maxAge: 1000 * 60 * 1,
  },
};
server.use(session(sessionConfig));

function checkAuth(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'not authorized' });
  }
}

server.use(express.json());
server.use(cors());

server.get('/api/users', checkAuth, (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then((response) => {
      res.status(200).json(response);
    });
});

server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 13);
  creds.password = hash;
  db('users')
    .insert(creds)
    .then((ids) => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ errorMessage: 'Error creating password' });
    });
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users')
    .where({ username: creds.username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).send('Log in successful.');
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json(500).json({ errorMessage: 'Error logging in' });
    });
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.send("You can't leave");
      } else {
        res.send('good bye');
      }
    });
  }
});

server.listen(port, () => console.log(`\nAPI running on port ${port}\n`));
