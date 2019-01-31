const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {

    getUsers: () => {
        return db('users')
    },

    insertUser: (user) => {
        return db('users').insert(user);
    },

    findByUsername: (username) => {
        return db('users').where('username', username);
    }
};