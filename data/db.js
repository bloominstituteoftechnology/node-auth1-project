const knexConfig = require('../knexfile.js');
const knex = require('knex');
const db = knex(knexConfig.development);

module.exports = {
    register,
    login,
    getUsers,
};

function register (userInfo) {
    return db('users')
    .insert(userInfo)
    .returning('id');
}

function login (userInfo) {
    return db('users')
    .where('usersname', '=', userInfo.usersname)
    .first();
}

function getUsers() {
    return db('users')
}