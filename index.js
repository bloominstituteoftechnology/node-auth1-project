const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('./knexfile')
const db = knex(knexConfig.development);
const session = require('express-session');

const server = express();
const sessionConfig = {
  secret: 'Cookie',
  name: 'Monster',
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 1,
  },
}

server.use(session(sessionConfig));
server.use(express.json(), cors(), helmet());

server.get('/', (req, res) => {
  res.json('Hi!');
});

const authorize = (req, res, next) => {
  if(req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ Message: 'You are not authorized.'})
  }
};

const usernameCheck = (req, res, next) => {
  const username = req.body.username;
  if ((!username) || (username.length > 128)) {
    return res.status(404).json({ Error: 'Username is required and can not exceed 128 characters.' });
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
      req.session.username = credentials.username;
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
        req.session.username = credentials.username;
        res.status(200).json({ Welcome: user.username });
      } else {
        res.status(401).json({ Message: 'You shall not pass!'})
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ Error: 'Error logging in.'})
    })
})

server.get('/api/users', authorize, (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
    console.log('User lists');
    res.status(200).json(users);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ Error: 'Error getting users.'})
  })
})


server.listen(9000, () => console.log('\n--- Server running on port 9000 ---\n'));