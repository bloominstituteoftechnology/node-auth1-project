const knex = require('knex');

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

module.exports = {
// all the methods needed to be available someplace else 

insert: (user) => {
    return db('users').insert(user);
},

findByUsername: (username) => {
    return db('users').where('username', username);
}
};