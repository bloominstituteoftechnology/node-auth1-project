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





server.listen(3300, () => console.log('\nrunning on port 3300\n'));
