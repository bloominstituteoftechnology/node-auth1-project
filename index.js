const express = require('express');
const mongoose = require('mongoose');

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authAppdb')
  .then(conn => {
    console.log('\n=== connected to mongodb ===\n');
  })
  .catch(err => console.log ('error connecting to mongodb', err));

  const server = express();

  server.use(express.json());

  server.get('/', (req, res) => {
    res.send({ route: '/', message: req.message });
  });

  server.post('/api/register', function(req, res) {
    const user = new User(req.body);
    user
      .save()
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send(err));
  });

  server.listen(5000, () => console.log('\n=== api running on port 5000 ===\n'));