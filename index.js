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

  function authenticate(req,res,next) {
    if(req.body.password === 'testing') {
      next();
    } else {
      res.status(401).send('wrong password please try again.')
    }
  }
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


  server.post('/api/login', authenticate, (req, res) => {
    console.log(res.body);
     res.send('User is now logged in');
  })

server.get('/api/users', (req, res) => {
  // put info here for checking if users is logged in display all users
})


  server.listen(5000, () => console.log('\n=== api running on port 5000 ===\n'));