const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {
    register
};

function register(user){
    return db('data').insert(user);
};