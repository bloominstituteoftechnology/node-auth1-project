const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {
    register,
    login,
    getUsers,
    getUserInfo
};

function register(user){
    return db('data').insert(user);
};

function login(credentials){
    return db('data').where({username:credentials.username}).first();
};

function getUsers(){
    return db('data').select('id', 'username', 'password');
};

function getUserInfo(username){
    return db('data').where({username}).first();
}