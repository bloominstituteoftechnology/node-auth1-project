const mongoose = require('mongoose');
const express = require('express');
const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(connection => {
    console.log('connection success!');
  })
  .catch(error => {
    console.log(error)
  });

const port = 3000;
const server = express();
server.use(express.json());

function authenticate(req, res, next) {
  if (req.body.password === 'mellon') {
    next();
  } else {
    res.status(401);
    res.send('Incorrect Login, please try again');
  };
}

server.get('/', (req, res) => {
  res.send({ route: '/', message: req.message });
})


server.post('/register', function (res, res) {
  const user = new User(req.body);

  user
    .save()
    .then(user => res.status(201.send(user)))
    .catch(err => res.status(500).send(err))
});

server.post('/login', (res, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
  .then(user => {
    if (user) {
      user.isPasswordValid
    } else {
      res.status(401).send('invalid password');
    }
  });
  .catch(err => res.status(500).send(err))
  user
    .save()
    .then(user => res.status(201.send(user)))
    .catch(err => res.status(500).send(err))
});


server.listen(port, () => console.log(`\n == HOMIE YOU ARE NOW listening on port ${port}`));