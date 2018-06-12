const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./User.js');

const app = express();

app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

/*************************
** CUSTOM MIDDLEWARE **
*************************/
// checkLogin
const checkLogin = (req, res, next) => {
  
}

/*************************
** /api/users **
*************************/
app.get('/api/users', (req, res) => {
  User.find({}, (err, raw) => {
    if (err)
      return res.status(500).json(err);

    res.json(raw);
  });
});

/*************************
** /api/register **
*************************/
app.post('/api/register', (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  
  User.create(user, (err, raw) => {
    if (err)
      return res.status(500).json(raw);

    res.status(201).json(raw);
  });
});

/*************************
** /api/login **
*************************/
app.post('/api/login', (req, res) => {
  const user = ({ username, password } = req.body);

  User.findOne()
    .where({ username })
    .then(user => {
      if (!user)
        return res.status(404).json({ err: 'No user was found' });
      
      bcrypt.compare(password, user.password)
        .then(match => {
          if (!match)
            return res.status(401).json({ err: 'Wrong password' });

          return res.json({ succ: 'Authenticated' });
        })
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

mongoose.connect('mongodb://localhost/auth-i', () => console.log('\n===== DATABASE STATUS: 200 =====\n'));
app.listen(5000, () => console.log('\n\n\n\n\n===== Server listening at http://localhost:5000 ====='));