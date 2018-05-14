const express = require('express');
const server = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authdb')
  .then( () => console.log('connected to mongodb'))
  .catch( err => console.log(err));

server.listen(5000, () => console.log('server running on port 5000'));

server.use(express.json());

const auth = (req, res, next) => {
  if (req.body.password === 'password') return next();

  res.status(401).send("You shall not pass!");
}

server.post('/api/login', auth, (req, res) => {
  res.status(200).send("You're logged in!"); 
});
