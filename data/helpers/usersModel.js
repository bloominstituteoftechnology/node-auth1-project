const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = (knex(knexConfig.development));


module.exports = {
    getUsers,
    addUser,
    findUser
}

function getUsers() {
    return db('users')
}

function addUser(newUser) {
    return db('users').insert(newUser)
}

function findUser(filter) { 
    return db('users').where({username: filter}).first()
}