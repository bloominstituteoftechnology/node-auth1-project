const knex = require('knex');

const dbConfig = require('../../knexfile');

const db = knex(dbConfig.development);

module.exports = {
  addUser,
  authorize,
  getUsers,
}

function addUser(user) {
  return db('users').insert(user);
}

function authorize(user) {
  return db('users').where('username', user);
}

function getUsers() {
  return db.select('username').from('users');
}