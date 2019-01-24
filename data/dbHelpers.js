const knex = require('knex');

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

module.exports = {
    insertUser: user => {
        return db('users').insert(user)
    },

    getUser: user => {
        return db('users').where('username', user.username)
    },

    findUsers: () => {
        return db('users').select('id', 'username');
    }
}