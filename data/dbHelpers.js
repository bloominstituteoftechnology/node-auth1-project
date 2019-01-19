const knex = require('knex');
const dbConfig = require('../knexfile.js');
const db = knex(dbConfig.development);

function insertUser(user) {
   return db('clients').insert(user);
}

function findByUsername(username) {
   return db('clients').where('username', username);
}

function findUsers() {
   return db('clients').select('id', 'username');
}

module.exports = {
   insertUser, findByUsername, findUsers
}