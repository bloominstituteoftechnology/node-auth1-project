const knex = require('knex');
const dbConfig = require('../knexfile');
const db = knex(dbConfig.development);

function add(user){
    return db('users').insert(user)
}

function find(id){
    return db('users').where('Username', id)
}

modeul.exports = {
    add, find,
};