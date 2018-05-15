const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('=== connected to mongo ===');
  })
  .catch(err => console.log('error connecting to mongo', err));

const server = express();

function authenticate(req, res, next) {
  
}

server.use(express.json());

// Register new user
server.post('/api/register', (req, res) => {
  // Create new user from req body and save
  const newUser = new User(req.body);
  newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => {
      res.status(500).json({
        error: 'Could not complete registration'
      })
    });
});

// Login exsiting user
server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username })
    .then(user => {
      // If user is not found then return error
      if(!user) res.status(404).json({ error: 'Invalid credentials' });
      // Check if password matches hash
      bcrypt.compare(password, user.password, function(err, match) {
        // Store cookie to track match
        if(match) res.json(`Logged in as ${username}`);
        else res.status(401).json('You shall not pass!!!');
      });
    })
    .catch(err => {
      res.status(500).json({
        error: 'User could not be logged in'
      })
    });
});

// Retrieve users
server.get('/api/users', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => {
      res.status(500).json({
        error: 'Could not retrieve users',
      });
    });
});

server.listen(8000, () => console.log('=== api running on port 8000 ==='));
