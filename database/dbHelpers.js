// this file contains my helpers which is basically the knex logic.

const knex = require('knex');

const knexConfig = require('../knexfile');

const db = knex(knexConfig.development);

module.exports = {
  insert: (user) => {
    return db('users').insert(user);
  },

  findByUserName: (username) => {
    return db('users').where('username', username);
  },

  findUsers: () => {
    return db('users').select('id', 'username');
  }
}