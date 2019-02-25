// Package imports
const knex = require('knex');

// Local imports
const knexConfig = require('../knexfile');

// Module export
module.exports = knex(knexConfig);
