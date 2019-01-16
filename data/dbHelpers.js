const knex = require('knex');

const db_config = require('../knexfile.js');

const db = knex(db_config.development);

module.exports = {
    registerUser: (user) => {
        return db('users').insert(user);
    },

    loginUser: (user) => {
        return db('users').where('users.username', user.username)
    } 
}