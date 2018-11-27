const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');
// yarn add bcryptjs

const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

// const nameCheck = require('../middleware/nameCheck.js');


const server = express();
server.use(express.json());


// TABLE SCHEMA


// endpoints here

server.post('/api/register', (req, res) => {
  // 1. grab username and password from body
  // 2. generate the hash from the user's password
  // 3. override the user.password with the hash
  // 4. save the user to the database
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14)
  creds.password = hash;
  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json({ id: ids[0]});
    })
    .catch(err => {
      res.status(500).json({ message: 'Error inserting', err })
    })
})


server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      return user && bcrypt.compareSync(creds.password, user.password) 
      ? res.status(200).json({ message: 'Logged in', user: user.username})
      : res.status(401).json({ message: 'You shall not pass!' })
      ;
    })
})


server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    // .select('username') to see just users
    .then(users => {
      res.status(201).json({ users })
    })
    .catch(err => res.send(err));
});

// Write a piece of global middleware that ensures a user is logged in when accessing any route prefixed by /api/restricted/. For instance, /api/restricted/something, /api/restricted/other, and /api/restricted/a should all be protected by the middleware; only logged in users should be able to access these routes.
// Build a React application that implements components to register, login and view a list of users. Gotta keep sharpening your React skills.


server.get('/', (req, res) => {
  res.json({ api: 'auth-i up' });
});

module.exports = server;