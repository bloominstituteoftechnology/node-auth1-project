const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const port = 5000;
const User = './Models/Profile.js';

mongoose.connect('mongodb://localhost/userdb')
  .then(() => {
    console.log('server connected to mongodb successfully');
  })
  .catch(() => {
    console.log('server was unable to connect to database');
  })

const server = express();


server.use(helmet());
server.use(cors());
server.use(express.json());

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

server.listen(port, () => {
  console.log(`server is now listening on port ${port}`)
})
