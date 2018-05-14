const express = require('express');
const mongoose = require('mongoose');
const port = 5000;
const User = require('./Models/Profile.js');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/userdb')
  .then(() => {
    console.log('server connected to mongodb successfully');
  })
  .catch(() => {
    console.log('server was unable to connect to database');
  })

const server = express();

const auth = (req, res, next) => {
  User.findOne({username: req.body.username}).select('username password -_id')
    .then(obj => {
      bcrypt.compare(req.body.password, obj.password)
        .then(response => {
          console.log(response);
          if (response) {
            req.user = {...obj._doc};
          } else {
            req.user = {login: 'unsuccessful'};
          }
          next();

        })
        .catch(err => console.log(err));
    })
}

server.use(express.json());

server.get('/', (req, res) => {
  res.json({message: 'connected to api'})
});

server.get('/api/users', (req, res) => {
  User.find()
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      console.log(err);
    })
});

server.post('/api/register', (req, res) => {
  const user = new User(req.body);
  user.save()
  .then(response => {
    res.status(201).json(response);
  })
});

server.post('/api/login', auth, (req, res) => {
  res.json({...req.user});
});

server.listen(port, () => {
  console.log(`server is now listening on port ${port}`)
})
