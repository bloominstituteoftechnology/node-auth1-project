const knex = require('knex');
const knexConfig = require('../knexfile');

const db = knex(knexConfig.development);

module.exports = {
    addUser: (user) => {
        return db('users').insert(user);
    },

    findUser: (user) => {
        return db('users').where('username', user);
    },

    getUsers: () => {
        return db('users')
    }
};

