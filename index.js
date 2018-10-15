const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('./knexfile')
const db = knex(knexConfig.development);

const server = express();

server.use(express.json(), cors(), helmet());

server.get('/', (req, res) => {
  res.json('Hi!');
});

const usernameCheck = (req, res, next) => {
  const username = req.body.username;
  if ((!username) || (username.length > 128)) {
    return res.status(404).json({ Error: 'Username is required and can not exceed 128 characters.' })
  }
  next();
};

const passwordCheck = (req, res, next) => {
  const password = req.body.password;
  if ((!password) || (password.length > 128)) {
    return res.status(404).json({ Error: 'Password is required and can not exceed 128 characters.' });
  }
  next();
}


server.post('/register', usernameCheck, passwordCheck, (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  db('users').insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUser: id });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ Error: 'Error registering.' })
    });
});

server.post('/login', (req, res) => {
  const credentials = req.body;
  db('users').where({ username: credentials.username }).first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        res.status(200).json({ Welcome: user.username });
      } else {
        res.status(401).json({ Message: 'Please enter the correct username and password.'})
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ Error: 'Error logging in.'})
    })
})


server.listen(9000, () => console.log('\n--- Server running on port 9000 ---\n'));