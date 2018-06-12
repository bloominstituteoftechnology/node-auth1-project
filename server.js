const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session')
const User = require('./auth/UserModel');

// mongoose.connect('mongodb://localhost/cs10').then(() => {
//   console.log('\n*** Connected to database ***\n');
// });

const server = express();

server.use(cors());
server.use(express.json());

server.use('/api/user', userRouter);

const session = require('express-session');

server.use(
  session({
    secret: 'nobody toss a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    },
    httpOnly: true,
    secure: true,
  })
);

server.get('/', (req, res) => {
  res.status(200).json({
    api: 'running...'
  });
});

server.post('/api/register', (req, res) => {
  const user = new User(req.body);

  user.save().then(savedUser => res.status(200).json(savedUser))
    .then(err => res.status(500).json(err));
});

server.post('/api/login', (req, res) => {
  const {
    username,
    password
  } = req.body;
  user.findOne({
    username
  }).then(user => {
    if (user) {
      bcrypt.compare(password, user.password).then(passwordsMatch => {

      }).catch(err => {
        res.send('error comparing Password')
      });
    } else {
      res.status(404).send('user not found');
    }
  }).catch(err => {
    res.send(err)
  });

});

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/authDb', {}, err => {
  if (err) console.log(err);
  console.log('you are connected to DB');
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server up and running on ${port}`);
});