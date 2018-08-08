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

    post: async function(newUser) {
        [id] = await db('users').insert(newUser);
        return this.get(id);
    },

    login: function(username) {
        const query = db('users').select('password').where('username', username);
        return query.then(pw => {
            return pw.length === 0 
            ? null
            : pw[0].password;
        })
    },

    getId: function(username) {
        const query = db('users').select('id').where('username', username);
        return query.then(res => res[0].id)
    }
}