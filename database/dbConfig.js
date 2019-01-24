const knex = require('knex');

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

module.exports = {
    getUsers,
    insertUser,
    findByUsername
}

function getUsers(){
    return db('users').select('id', 'username')
}

function insertUser(user){
    return db('users').insert(user)
}

function findByUsername(username){
    return db('users').where({username:username}).first()
}