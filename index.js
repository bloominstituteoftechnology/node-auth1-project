const express = require('express');
const knex = require('knex')
const knexConfig = require('./knexfile.js')
const db = knex(knexConfig.development)
const bcrypt = require('bcryptjs')
const server = express();

server.use(express.json())

server.get('/', (req, res) => {
  res.send("hello")
})

server.get('/api/users', (req, res) => {
  db('users')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err))
})


server.post('/api/users', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 2)
  creds.password = hash;
  db('users').insert(creds).then(ids => {
    res.status(201).json(ids)
  }).catch(err => res.json(err))


});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
