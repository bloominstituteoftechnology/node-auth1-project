const express = require('express');
const mongoose = require('mongoose');
const port = 3333;

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('> connected to mongo');
  })
  .catch(err => console.log('error connecting to mongo'));

const server = express();

server.get('/', (req, res) => {
  res.send({ api: 'running' });
});

server.listen(port, () => console.log(' > API running on 3333.'));
