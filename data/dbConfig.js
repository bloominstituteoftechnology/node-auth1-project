//IMPORTS
const knex = require('knex');
const knexConfig = require('../knexfile.js');

//EXPORTS
module.exports = knex(knexConfig.development);