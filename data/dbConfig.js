const knex = require('knex');

const knexfile = require('../knexfile.js')


const database = 'development';
module.exports = knex(knexfile[database])