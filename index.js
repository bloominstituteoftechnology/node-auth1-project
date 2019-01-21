const server = require('./server.js');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('../knexfile.js');

// connect to the database
const db = knex(knexConfig.development);

server.post('/api/register', (req, res) => {

})

server.post('/api/login', (req, res) => {

})

server.get('/api/users', (req, res) => {

})