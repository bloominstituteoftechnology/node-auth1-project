const ENV = 'development';
const knex = require('knex');
const dbCONFIG = require('../knexfile.js');
const db = knex(dbCONFIG[ENV])

module.exports = {
        get: () => {
            return db('users');
        },
        insert: (user) => {
            return db('users').insert(user);
        },
        findByUsername: (username) => {
            return db('users').where('username',username);
        }
}