const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = (knex(knexConfig.development));

module.exports = {
    getUsers,
}

const getUsers = () => {
    return db('users')
}