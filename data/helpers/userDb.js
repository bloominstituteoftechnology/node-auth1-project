const knex = require('knex');
const dbConfig = require('../../knexfile');

const db = knex(dbConfig.development);

module.exports = {
    add: function(user) {
        return db('users').insert(user);
    },

    get: function(user) {
        db('users').where('username', user.username)
    }
}