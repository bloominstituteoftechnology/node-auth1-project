const express = require('express');
const mongoose = require('mongoose');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/cs10').then(() => {
  console.log('\n*** Connected to database ***\n');
});

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({
    api: 'running...'
  });
});

server.post('/api/register', (req, res) => {
  // save the user to the database

  // const user = new User(req.body);
  // user.save().then().catch;

  // or an alternative syntax would be:
  User.create(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server up and running on ${port}`);
});