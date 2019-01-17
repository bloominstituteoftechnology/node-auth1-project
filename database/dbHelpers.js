const knex = require('knex');

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

function insertUser(user){
  return db('users').insert(user)
}

function getUser(res){
  return db('users');
 }

function findByUsername(username){
  return db('users').where('username', username);
}

module.exports = {
   insertUser, findByUsername, getUser
}