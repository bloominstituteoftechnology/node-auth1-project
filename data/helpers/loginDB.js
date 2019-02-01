const knex = require('knex')

const config = require('../../knexfile')

const DB = knex(config.development)