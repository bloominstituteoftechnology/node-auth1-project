const express = require('express');
const mongoose = require('mongoose');
const User = require('./auth/userModel.js');

mongoose.connect('mongodb://localhost/cs10').then(() => {
  console.log('*** Connected to database ***');
});

const server = express();

server.use(express.json());

server.get('/', (req, res,) => {
  res.json({ api: 'running...' })
});

server.post('/api/register', (req, res) => {
  User.create(req.body)
  .then(user => {
    res.status(201).json({ user });
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

server.listen(8000, () => {
  console.log('\n*** API running on port 8k ***\n');
});
