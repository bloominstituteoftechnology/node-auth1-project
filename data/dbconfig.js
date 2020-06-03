const knex = require('knex')

const config = require('../knexfile')

const environment = 'development'

const db = knex(config[environment])

module.exports = db