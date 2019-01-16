const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("Hello!");
})

server.listen(3000, () => {
  console.log("Server started on port 3000.");
})

server.post('/api/register', (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;
  db('users').insert(user)
    .then(ids => {
      res.status(201).json(ids)
    })
    .catch(err => {
      res.status(400).json({ message: 'Registration failed.', error: err })
    })
})