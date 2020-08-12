const knex = require('knex');

const config = require('../knexfile')

const enviroment = process.env.DB_ENV || 'development';


module.exports = knex(config[enviroment]);