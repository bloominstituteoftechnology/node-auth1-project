const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

find = () => {
  return db('users').select('id', 'username', 'password');
}

