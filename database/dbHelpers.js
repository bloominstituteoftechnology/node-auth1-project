const knex = require('knex');

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

function insertUser(user){
  return db('users').insert(user)
}

function findUsers(){
  return db('users').select('id', 'email');
}

function findByUsername(email){
  return db('users').where('email', email);
}

module.exports = {
   insertUser, findByUsername, findUsers
}