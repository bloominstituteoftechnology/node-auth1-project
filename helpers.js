const knex = require('knex');

const db_config = require('./knexfile');
const db = knex(db_config.development);

// Sanitize and check the input before using these methods

module.exports = {
    addUser: function(user) {
        return db('users').insert(user);
    },

    getUser: function(username) {
        return db('users').where('username', username);
    },

    getUsernames: function() {
        return db('users').select('username');
    }
}