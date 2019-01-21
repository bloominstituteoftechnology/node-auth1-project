const knex = require('knex');

const knexConfig = require('../../knexfile.js');

const db = knex(knexConfig.development);

module.exports = {
  insert: (user) => {
    return db('users').insert(user);
  },

  findByUsername: (user) => {
    return db('users').where('username', user.username);
  },

  findUsers: () => {
    return db('users').select('id', 'username');
  },
};
