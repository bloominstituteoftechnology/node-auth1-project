const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports ={
    getUser
}

function getUser(id){
    return db('users')
}