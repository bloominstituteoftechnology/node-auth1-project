const knex = require('knex');

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

module.exports = {
    // helper method to insert new user into table
    insert: (user) => {
        return db('users_table')
            .insert(user);
    },
    // helper method to find database entry using username
    findByUsername: (username) => {
        return db('users_table')
            .where('username', username);
    },
    // helper method to find users
    findUsers: () => {
        return db('users_table')
            .select('id','username');
    }
} 