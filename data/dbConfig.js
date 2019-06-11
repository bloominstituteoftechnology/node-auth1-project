const knex = require('knex');

const configOptions = require('../knexfile').development;

module.exports = knex(configOptions);