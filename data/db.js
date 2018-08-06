const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {
    get: function(id) {
        const query = db('users');

        if (id) {
            const result = query.where('id', id);
            return result;
        }

        return query;
    },

    post: function(newUser) {
        const query = db('users').insert(newUser);
        return query;
    }
}