const knex = require('knex');

const knexfig = require('../knexfile');

const db = knex(knexfig.development);

module.exports = db;
