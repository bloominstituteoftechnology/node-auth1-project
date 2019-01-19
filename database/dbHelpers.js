const knex = require('knex');
const knexConfig = require ('../knexfile.js');
const db = knex(knexConfig.development)

module.exports = {
  insertUser: (user) => {
    return db('users').insert(user);
  },
  findByUsername: (username) => {
    return db('users').where('username', username);
  },
  getUsers: (users) => {
    return db('users').select('id', 'username')
  }
}