//? s43 
const knex = require('knex');

const knexfile = require('../knexfile.js');

const environment = process.env.NODE_ENV || 'development';

module.exports = knex(knexfile[environment]);

//? s44 create knexfile.js || terminal: knex init