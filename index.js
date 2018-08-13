const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/db');

const server = express();
server.use(express.json());

const PORT = 8000;

server.get('/', (req, res) => {
  res.send('Sanity Check');
});

server.get('/users', (req, res) => {
  db('users')
   .then(response => {
     res.json(users);
   })
   .catch(err => {
     res.send(err);
   })
});

server.listen(PORT, () => {
  console.log(`UP and RUNNING on ${PORT}`)
});