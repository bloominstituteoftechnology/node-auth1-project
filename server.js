const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const knex = require('knex')(require('./knexfile').development);

const server = express();
server.use(morgan('dev'));
server.use(express.json());

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
      knex('users')
        .insert({ name: username, hash: hashedPW })
    })
    .then(() => {
      res.status(200).json({ message: 'Registration successful.' });
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
            res.status(200).json({ message: 'Registration successful.' });
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

server.listen(8000, () => {
  console.log('Listening on port 8000');
});
