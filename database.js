

//== Database Configuration ====================================================

//-- Dependencies --------------------------------
const knex = require('knex');
const config = require('./config.js');
const knexConfig = require('./knexfile.js');

//-- Configure and Export ------------------------
module.exports = knex(knexConfig[config.DATABASE_ENVIRONMENT]);
