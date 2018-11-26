const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const knex = require('knex');

const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('running');
  });
  
// server.get('/api/users', (req, res) => {
//     db('users')
//     .select('id', 'username')
//     .then(users => {
//         res.json(users);
//     })
//     .catch(err => res.send(err));
//   });
  
  server.listen(8300, () => console.log('\nrunning on port 8300\n'));