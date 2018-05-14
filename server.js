const express = require('express');
const mongoose = require('mongoose');

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('\n=== connected to mongo ===\n');
  })
  .catch(err => console.log('error connecting to mongo', err));

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {

});

server.listen(8000, () => console.log('\n=== api running on port 8000===\n'));
