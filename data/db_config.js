const knex = require('knex');
const configuration = require('../knexfile').development;
const db = knex(configuration);

module.exports = db;