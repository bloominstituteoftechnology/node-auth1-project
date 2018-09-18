const knex = require('knex');
const dbConfig = require('../../knexfile');
const db = knex(dbConfig.development);

module.exports = {
    registerUser: function (creds) {
        return db('users')
            .insert(creds)
            .then(id => id)
    },

    loginUser: function (creds) {
        return db('users')
            .where({ username: creds.username })
            .first()
            .then(user => user)
    },

    getUsers: function () {
        return db('users')
            .select('id', 'username')
            .then(users => users)
    }


};