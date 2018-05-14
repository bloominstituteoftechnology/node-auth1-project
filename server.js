const express = require('express');
const mongoose = require('mongoose')
const User = require('./users/user');
const server = express()

server.use(express.json())

mongoose
  .connect('mongodb://localhost/authdb')
  .then(mongo => {
    console.log('connected to database');
  })
  .catch(err => {
    console.log('Error connecting to database', err);
  });

  server.get('/', (req, res) => {
    res.status(200).json({ api: 'running' });
  });
  function authenticate(req, res, next) {
    if (req.body.password === 'mellon') {
      next();
    } else {
      res.status(401).send('You shall not pass!!!');
    }
  }

  server.post('/register', function(req, res) {
    const user = new User(req.body);
  
    user
      .save()
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send(err));
  });
  server.post('/login', authenticate, (req, res) => {
    res.send('Welcome to the Mines of Moria');
  });
  
  

  const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n=== API up on port: ${port} ===\n`));
