const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const knex = require('knex')(require('./knexfile').development);
const session = require('express-session');

const server = express();
server.use(morgan('dev'));
server.use(
  session({
    name: 'notsession',
    secret: 'There is a time and a place for using numb3rs.',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: false,
    resave: false,
    saveUninitialized: false,
  }),
);
server.use(express.json());

// middleware to verify that user is logged in
async function filterForLoggedIn(req, res, next) {
  const { username } = req.session;
  if (username !== undefined) {
      return next();
    }
  res.status(400).json({ message: 'Could not authenticate user.' });
}

// server.use('/restricted/', fi)

server.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || username === '') {
    res.status(406).json('Please provide a username.');
  } else if (!password) {
    res.status(406).json('Please provide a password.');
  }

  bcrypt
    .hash(password, 14)
    .then((hashedPW) => {
      return knex('users').insert({ name: username, hash: hashedPW });
    })
    .then((dbRes) => {
      return res.status(200).json({ message: 'Registration successful.' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Registration did not succeed.' });
    });
});

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(406).json({ message: 'Please provide a username and password.' });
  }
  knex('users')
    .select('hash')
    .where('name', '=', username)
    .first()
    .then(({ hash: storedPW }) => {
      if (!storedPW) {
        res.status(400).json({
          message:
            'Login attempt was not successful. Please ensure username and password are correct.',
        });
      } else {
        bcrypt.compare(password, storedPW).then((result) => {
          if (result) {
            req.session.username = username;
            res.status(200).json({ message: 'Login was successful.' });
          } else {
            res.status(400).json({
              message:
                'Login attempt was not successful. Please ensure username and password are correct.',
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Login attempt could not be completed.' });
    });
});

server.post('/api/logout', filterForLoggedIn, (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logged out successfully.' });
});

server.get('/api/users', filterForLoggedIn, (req, res) => {
  knex('users')
    .select('name')
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'An error occured in retrieving requested database resource.',
        error: err,
      });
    });
});

server.listen(8000, () => {
  console.log('Listening on port 8000');
});
