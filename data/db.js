const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {
    addUser,
    getUsers,
    getUser

}

function addUser(newUser){
  return db('users').insert(newUser)   
}

function getUsers(){
    return db('users')
}

function getUser(username){
    return db('users').where({ username })
}