const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db/dbConfig.js');

const server = express();
server.use(express.json());
server.use(cors());

server.get('/api/users', (req, res) => {
  db('users')
  .select('id', 'username', 'password')
  .then(users => {
    res.json(users)
  })
  .catch(err => res.json(err));
})

server.listen(3300, () => console.log('\nrunning on port 3300\n'));