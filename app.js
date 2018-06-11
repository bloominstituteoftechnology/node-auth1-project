const express = require('express');
const mongoose = require('mongoose');

const User = require('./User.js');

const app = express();

app.use(express.json());

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

  User.findOne(user, (err, raw) => {
    if (err)
      return res.status(500).json(err);

    res.json(raw);
  });
});

mongoose.connect('mongodb://localhost/auth-i', () => console.log('\n===== DATABASE STATUS: 200 =====\n'));
app.listen(5000, () => console.log('\n\n\n\n\n===== Server listening at http://localhost:5000 ====='));