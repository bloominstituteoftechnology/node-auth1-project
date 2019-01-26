const knex = require('knex');

const dbConfig = require('../knexfile.js');

const db = knex(dbConfig.development);

module.exports = {

  insert: (user) => {
    return db('accounts').insert(user);
  },

  findByUsername: (username) => {
    return db('accounts').where('username', username);
  },

  findUsers: () => {
    return db('accounts').select('id', 'username');
  }
  
};