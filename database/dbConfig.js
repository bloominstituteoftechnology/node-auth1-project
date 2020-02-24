const knex = require('knex');

const configOptions = require('../knexfile.js').development;

module.exports = knex(configOptions)