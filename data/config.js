const knex = require('knex');

const knexfile = require('../knexfile');

const enviornment = process.env.NODE_ENV || 'development';

module.exports = knex(knexfile[enviornment]); 
