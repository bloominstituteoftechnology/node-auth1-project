const express = require('express');
const server = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authdb')
  .then( () => console.log('connected to mongodb'))
  .catch( err => console.log(err));

server.listen(5000, () => console.log('server running on port 5000'));

server.use(express.json());
