const knex = require('knex');

const dbConfig = require('../knexfile');

const db = knex(dbConfig.development);

module.exports = {
    insert: (user) => {
        return db('users').insert(user);
    },

    findByUsername: (name) => {
        return db('users').where('name', name);
    },

    findUsers: () => {
        return db('users').select('id', 'name');
    }
};