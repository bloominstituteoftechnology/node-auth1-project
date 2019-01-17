const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);
const server = express();
const bcrypt = require('bcryptjs');
server.use(express.json());
server.use(cors());



server.get('/', (req, res) => {
  res.send('Its Alive!');
});

server.post('/api/register', (req, res) => {
  const user =  req.body;
  user.password = bcrypt.hashSync(user.password);
  db('users').insert(user)
  .then(ids => {
    res.status(201).json({id: ids[0]})
  })
  .catch(err => {
    res.status(500).send(err)
  })
})





server.listen(3300, () => console.log('\nrunning on port 3300\n'));
