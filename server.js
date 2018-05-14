const express = require('express');
const mongoose = require('mongoose');

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('=== connected to mongo ===');
  })
  .catch(err => console.log('error connecting to mongo', err));

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
  User.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({
        error: 'Could not retrieve users',
      });
    });
});

server.listen(8000, () => console.log('=== api running on port 8000 ==='));
