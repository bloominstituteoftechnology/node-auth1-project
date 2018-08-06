const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

let User;
mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected');
  const userSchema = new mongoose.Schema({
    name: String,
    hash: String,
  });
  User = mongoose.model('User', userSchema);
});

const server = express();
server.use(morgan('dev'));
server.use(express.json());

server.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || username === '') {
    res.status(406).json('Please provide a username.');
  } else if (!password) {
    res.status(406).json('Please provide a password.');
  }
  bcrypt
    .hash(password, 14)
    .then((hashedPW) => {
      const newUser = new User({ name: username, hash: hashedPW });
      newUser.save().then(() => {
        res.status(200).json({ message: 'Registration successful.' });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Registration did not succeed.' });
    });
});

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(406).json({ message: 'Please provide a username and password.' });
  }
  User.findOne({ name: username })
    .then((user) => {
      const storedPW = user.hash;
      if (!storedPW) {
        res.status(400).json({
          message:
            'Login attempt was not successful. Please ensure username and password are correct.',
        });
      } else {
        bcrypt.compare(password, storedPW).then((result) => {
          if (result) {
            res.status(200).json({ message: 'Registration successful.' });
          } else {
            res.status(400).json({
              message:
                'Login attempt was not successful. Please ensure username and password are correct.',
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Login attempt could not be completed.' });
    });
});

server.listen(8000, () => {
  console.log('Listening on port 8000');
});
