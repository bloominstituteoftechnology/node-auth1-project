const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 

const server = express();
server.use(express.json());
server.use(cors());

const knex = require('knex');

const knexConfig = require('./knexfile');

module.exports = knex(knexConfig.development);











server.listen(3300, () => console.log('\nrunning on port 3300\n'));
