const knex = require('knex');

const knexConfig = require('../../knexfile.js');

const db = knex(knexConfig.development);

module.exports = {
  insert: (user) => {
    db('users').insert(user);
  },

  findByUsername: (user) => {
    db('users').where('username', user.username);
  },
};
